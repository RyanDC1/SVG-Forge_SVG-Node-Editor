import { useCallback } from "react"
import { isEmpty, throttle } from "lodash"
import { useEditorState, useEditorStateReducer } from "@/utils/hooks"
import ThemeColorPicker from "@/components/propertiesPanel/panels/ThemeColorPicker"
import Panel from "./Panel"

export default function ThemeEditorPanel() {

    const { fill, stroke } = useEditorState(state => state.editorStateReducer.svgData?.theme) || {}
    const svg = useEditorState(state => state.editorStateReducer.svg)

    const { setEditorState } = useEditorStateReducer()

    const throttledUpdateSVG = useCallback(throttle(setEditorState, 160), [])

    return (
        (!isEmpty(fill) || !isEmpty(stroke)) &&
        <>
            <Panel
                title="Theme Editor"
                className="theme-editor"
            >
                <ThemeColorPicker
                    id="fill"
                    colors={fill!}
                    title="Fill Colors"
                    onChange={(color, prevColor) => {
                        updateSVGColors(color, prevColor, 'fill')
                    }}
                />

                <ThemeColorPicker
                    id="stroke"
                    colors={stroke!}
                    title="Stroke Colors"
                    onChange={(color, prevColor) => {
                        updateSVGColors(color, prevColor, 'stroke')
                    }}
                />
            </Panel>
        </>
    )

    function updateSVGColors(color: string, prevColor: string, type: 'fill' | 'stroke') {
        const regex = new RegExp(`${type}="${prevColor}"`, 'gm')
        const updatedSvg = svg?.replace(regex, `${type}="${color}"`)
        throttledUpdateSVG({
            svg: updatedSvg
        })
    }
}