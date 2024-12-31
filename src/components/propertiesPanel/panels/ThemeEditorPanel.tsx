import { useCallback } from "react"
import { isEmpty, throttle } from "lodash"
import { useEditorState, useEditorStateReducer } from "@/utils/hooks"
import { ColorPickerList } from "@/components/colorPicker"
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
                <ColorPickerList
                    id="fill"
                    colors={Object.keys(fill ?? {})}
                    title="Fill Colors"
                    onChange={(color, prevColor) => {
                        updateSVGFillColors(color, prevColor)
                    }}
                />

                <ColorPickerList
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

    function updateSVGColor(ids: string[], color: string, type: 'stroke' | 'fill') {
        if (ids.length > 0) {
            throttledSetAttributes({
                ids,
                properties: {
                    [type]: color
                }
            })
        }
    }

    function updateSVGFillColors(color: string, prevColor: string) {
        const ids = fill?.[prevColor] ?? []
        updateSVGColor(ids, color, 'fill')
    }

    function updateSVGStrokeColors(color: string, prevColor: string) {
        const ids = stroke?.[prevColor] ?? []
        updateSVGColor(ids, color, 'stroke')
    }
}