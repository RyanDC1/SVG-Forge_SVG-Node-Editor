import { useCallback } from "react"
import { isEmpty, throttle } from "lodash"
import { useEditorState, useEditorStateReducer } from "@/utils/hooks"
import { ColorPicker } from "@/components/colorPicker"
import Panel from "./Panel"

export default function ThemeEditorPanel() {

    const { fill, stroke } = useEditorState(state => state.editorStateReducer.svgData?.theme) || {}

    const { setNodeAttribute } = useEditorStateReducer()

    const throttledSetAttributes = useCallback(throttle(setNodeAttribute, 160), [])

    return (
        (!isEmpty(fill) || !isEmpty(stroke)) &&
        <>
            <Panel
                title="Theme Editor"
                className="color-editor"
            >
                <ColorPicker
                    id="fill"
                    colors={Object.keys(fill ?? {})}
                    title="Fill Colors"
                    onChange={(color, prevColor) => {
                        updateSVGFillColors(color, prevColor)
                    }}
                />

                <ColorPicker
                    id="stroke"
                    colors={Object.keys(stroke ?? {})}
                    title="Stroke Colors"
                    onChange={(color, prevColor) => {
                        updateSVGStrokeColors(color, prevColor)
                    }}
                />
            </Panel>
        </>
    )

    function updateSVGFillColors(color: string, prevColor: string) {
        const ids = fill?.[prevColor] ?? []
        if(ids.length > 0) {
            throttledSetAttributes({
                ids,
                properties: {
                    fill: color
                }
            })
        }
    }
    
    function updateSVGStrokeColors(color: string, prevColor: string) {
        const ids = stroke?.[prevColor] ?? []
        if(ids.length > 0) {
            throttledSetAttributes({
                ids,
                properties: {
                    stroke: color
                }
            })
        }
    }
}