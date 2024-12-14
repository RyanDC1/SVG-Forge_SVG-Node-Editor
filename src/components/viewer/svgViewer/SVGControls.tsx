import { useCallback, useEffect, useRef } from "react"
import { message as antMessage, Tooltip } from 'antd'
import { clamp, throttle } from "lodash"
import { useEditorState, useEditorStateReducer, useResizeObserver } from "@/utils/hooks"
import { translateHTMLTag } from "@/utils/helpers"

interface Props {
    children: React.ReactNode,
    svgContainerRef: React.MutableRefObject<HTMLSpanElement>
}

const SVG_CONTAINER_PADDING = 40
const MIN_SCALE = 0.1
const MAX_SCALE = 10
const SCALE_STEP = 0.1
const PAN_SPEED_MULTIPLIER = 2

let SCALE_NOTIFICATION_TIMEOUT: NodeJS.Timeout | undefined = undefined
const SCALE_NOTIFICATION_KEY = 'SVG_SCALE_NOTIFICATION'

export default function SVGControls(props: Props) {

    const { children, svgContainerRef } = props

    const isSvgLoaded = useEditorState(state => state.editorStateReducer.isLoaded)
    const previewNode = useEditorState(state => state.editorStateReducer.previewNode)
    const selectedNodes = useEditorState(state => state.editorStateReducer.selectedNodes)

    const { setSelectedNodes } = useEditorStateReducer()

    const [message, messageContext] = antMessage.useMessage({
        getContainer: () => controlRef.current,
        maxCount: 1,
        duration: 0,
        top: 'initial',
        prefixCls: 'svg-scale-notification'
    })

    const controlRef = useRef<HTMLDivElement>(null!)
    const isPanActive = useRef(false)
    const isPointerDown = useRef(false)
    const panOffset = useRef({
        clientX: 0,
        clientY: 0
    })
    const overlayRef = useRef<HTMLSpanElement>(null!)
    const overlayRefTooltip = useRef<HTMLSpanElement>(null!)
    const selectedOverlayIdsRef = useRef<string[]>([])
    const selectedNodesRef = useRef<string[]>([])

    const throttledScale = useCallback(throttle(scaleSVGOnScroll, 60), [])

    const viewPortSize = useResizeObserver(controlRef)

    useEffect(() => {
        if (isSvgLoaded) {
            initScale()

            svgContainerRef.current.addEventListener('mouseover', onMouseOver)
            svgContainerRef.current.addEventListener('mouseleave', hideOverlay)
            svgContainerRef.current.addEventListener('pointerup', setSelectedItems)
        }

        return () => {
            svgContainerRef.current?.removeEventListener('mouseover', onMouseOver)
            svgContainerRef.current?.removeEventListener('mouseleave', hideOverlay)
            svgContainerRef.current?.removeEventListener('pointerup', setSelectedItems)
        }
    }, [isSvgLoaded])

    useEffect(() => {
        if (previewNode) {
            const targetNode = document.getElementById(previewNode)

            if (targetNode) {
                showOverlay(targetNode)
            }
        } else {
            hideOverlay()
        }
    }, [previewNode])

    useEffect(() => {
        selectedNodesRef.current = selectedNodes
        updateSelectedOverlay(selectedNodes)
    }, [selectedNodes])

    useEffect(() => {
        updateSelectedOverlay(selectedNodes)
    }, [viewPortSize])

    return (
        <div
            ref={controlRef}
            className='svg-control'
            onWheel={throttledScale}
            onPointerDown={onPanStart}
            onPointerUp={onPanStop}
            onPointerLeave={onPanStop}
            onPointerMove={onPan}
        >
            <Tooltip
                rootClassName="svg-path-overlay-tooltip"
                title={<span ref={overlayRefTooltip} />}
                forceRender
                getPopupContainer={() => overlayRef.current}
                open
                arrow={false}
                placement='topLeft'
            >
                <span
                    ref={overlayRef}
                    className="svg-path-overlay"
                />
            </Tooltip>
            {messageContext}
            {children}
        </div>
    )

    function initScale() {
        const SVGContainer: HTMLSpanElement = svgContainerRef.current

        const SVGDimensions = SVGContainer.querySelector('svg')?.getBoundingClientRect()

        if (SVGDimensions) {
            // Get SVG width and height
            const {
                width: SVGWidth,
                height: SVGHeight
            } = SVGDimensions

            // compute scale
            const containerWidth = SVGContainer.clientWidth - SVG_CONTAINER_PADDING
            const containerHeight = SVGContainer.clientHeight - SVG_CONTAINER_PADDING

            if (SVGWidth > containerWidth || SVGHeight > containerHeight) {
                const scaleX = containerWidth / SVGWidth
                const scaleY = containerHeight / SVGHeight

                const newScale = Math.min(scaleX, scaleY)
                SVGContainer.style.setProperty('scale', String(clamp(newScale, MIN_SCALE, MAX_SCALE)))
            }
        }
    }

    function getSVGScale() {
        const scale = parseFloat(svgContainerRef.current.style.getPropertyValue('scale') ?? '1')
        return !Number.isNaN(scale) ? scale : 1
    }

    function setSVGScale(scale: number) {
        const currentScale = getSVGScale()

        if (currentScale == scale) {
            return
        }

        if (scale >= MIN_SCALE && scale <= MAX_SCALE) {
            const SVGContainer: HTMLSpanElement = svgContainerRef.current
            SVGContainer.style.setProperty('scale', String(scale))

            message.open({
                content: `Scale: ${Math.round(scale * 10)}%`,
                key: SCALE_NOTIFICATION_KEY
            })

            if (SCALE_NOTIFICATION_TIMEOUT) {
                clearTimeout(SCALE_NOTIFICATION_TIMEOUT)
            }

            SCALE_NOTIFICATION_TIMEOUT = setTimeout(() => {
                message.destroy(SCALE_NOTIFICATION_KEY)
            }, 1500);
        }
    }

    function scaleSVGOnScroll(event: React.WheelEvent<HTMLDivElement>) {
        const currentScale = getSVGScale()
        const scaleFactor = event.deltaY < 0 ? (1 + SCALE_STEP) : (1 - SCALE_STEP);

        let newScale = currentScale * scaleFactor;
        newScale = clamp(newScale, MIN_SCALE, MAX_SCALE)
        setSVGScale(newScale)

        updateSelectedOverlay(selectedNodesRef.current)
    }

    function onPanStart() {
        isPointerDown.current = true
    }

    function onPanStop() {
        isPanActive.current = false
        isPointerDown.current = false
        controlRef.current.style.removeProperty('cursor')
    }

    function onPan(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (isPointerDown.current === true) {
            isPanActive.current = true
            controlRef.current.style.setProperty('cursor', 'move')

            panOffset.current.clientX += (event.movementX * PAN_SPEED_MULTIPLIER);
            panOffset.current.clientY += (event.movementY * PAN_SPEED_MULTIPLIER);

            svgContainerRef.current.style.transform = `translate(${panOffset.current.clientX}px, ${panOffset.current.clientY}px)`;

            updateSelectedOverlay(selectedNodesRef.current)
        }
    }

    function onMouseOver(event: MouseEvent) {
        const target = event.target as Element
        showOverlay(target)
    }

    function createOverlayProperties(overlay: HTMLSpanElement, target: Element) {
        const { x, y, height, width, top, left, right, bottom } = target.getBoundingClientRect()

        overlay.style.setProperty('transform-origin', `${x}px ${y}px`)
        overlay.style.setProperty('height', `${height}px`)
        overlay.style.setProperty('width', `${width}px`)
        overlay.style.setProperty('top', `${top}px`)
        overlay.style.setProperty('left', `${left}px`)
        overlay.style.setProperty('right', `${right}px`)
        overlay.style.setProperty('bottom', `${bottom}px`)
        overlay.style.setProperty('opacity', '1')

        return overlay
    }

    function showOverlay(target: Element) {
        if (target === svgContainerRef.current) {
            hideOverlay()
            return
        }

        overlayRef.current = createOverlayProperties(overlayRef.current, target)
        overlayRefTooltip.current.innerText = translateHTMLTag(target.nodeName)
    }

    function hideOverlay() {
        overlayRef.current.style.setProperty('opacity', '0')
    }

    function setSelectedItems(event: PointerEvent) {
        const target = event.target as Element

        if (
            event.button !== 0,
            isPanActive.current ||
            target === svgContainerRef.current
        ) {
            return
        }

        if (event.ctrlKey) {
            // multi select
            if (selectedNodesRef.current.includes(target.id)) {
                setSelectedNodes(selectedNodesRef.current.filter(id => id !== target.id))
            }
            else {
                setSelectedNodes([...selectedNodesRef.current, target.id])
            }
        }
        else {
            if (selectedNodesRef.current.includes(target.id)) {
                setSelectedNodes([])
            }
            else {
                setSelectedNodes([target.id])
            }
        }
    }

    function updateSelectedOverlay(ids: string[]) {
        // cleanup 
        selectedOverlayIdsRef.current.map((id) => {
            const overlay = document.getElementById(id)
            if (overlay) {
                overlay.remove()
            }
        })

        selectedOverlayIdsRef.current = []

        ids.forEach((id) => {
            const target = document.getElementById(id)

            if (target) {
                // create selection overlay
                const overlayElement = createOverlayProperties(document.createElement('span'), target)
                overlayElement.id = `overlay-${id}`
                overlayElement.className = 'selected-path-overlay'

                // append selection overlay to control
                controlRef.current.appendChild(overlayElement)

                // store overlay ids for cleanup
                selectedOverlayIdsRef.current.push(overlayElement.id)
            }
        })
    }
}