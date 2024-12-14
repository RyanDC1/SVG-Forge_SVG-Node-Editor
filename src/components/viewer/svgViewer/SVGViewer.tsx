import { useEffect, useRef } from 'react'
import { message as antMessage } from 'antd'
import { useEditorState, useEditorStateReducer } from '@/utils/hooks'
import SVGControls from './SVGControls'
import { parseSVG } from '@/utils/helpers'

export default function SVGViewer() {

    const [message, messageContext] = antMessage.useMessage()

    const SVGData = useEditorState(state => state.editorStateReducer.svg)
    const { setEditorState } = useEditorStateReducer()

    const SVGViewerContainerRef = useRef<HTMLSpanElement>(null!)

    useEffect(() => {
        if (SVGData) {
            loadSVG(SVGData)
        }
    }, [SVGData])


    return (
        <>
            {messageContext}
            <SVGControls
                svgContainerRef={SVGViewerContainerRef}
            >
                <span className='svg-viewer-content' ref={SVGViewerContainerRef} />
            </SVGControls>
        </>
    )

    async function loadSVG(data: string) {
        parseSVG(data)
        .then((element) => {
            if (SVGViewerContainerRef.current.hasChildNodes()) {
                const SVGNode = SVGViewerContainerRef.current.querySelector('svg')
                if (SVGNode) {
                    SVGViewerContainerRef.current.removeChild(SVGNode)
                }
            }
            SVGViewerContainerRef.current.appendChild(element)
            setEditorState({ isLoaded: true })
        })
        .catch(() => {
            message.error('Invalid format, please upload a properly formatted SVG file')
        })
    }
}