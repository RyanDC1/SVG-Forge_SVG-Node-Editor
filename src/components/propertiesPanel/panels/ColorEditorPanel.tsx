import { useCallback } from "react";
import { throttle } from "lodash";
import { useEditorState, useEditorStateReducer } from "@/utils/hooks";
import { ColorPicker } from "@/components/colorPicker";
import Panel from "./Panel";

interface Props {
    showFill?: boolean,
    showStroke?: boolean
}

export default function ColorEditorPanel(props: Props) {

    const { showFill = true, showStroke = true } = props

    const selectedNodes = useEditorState(state => state.editorStateReducer.selectedNodes)
    const flatMap = useEditorState(state => state.editorStateReducer.svgData?.flatMap)

    const { setNodeAttribute } = useEditorStateReducer()

    const selectedItem = flatMap?.[selectedNodes[0]]
    const { fill, stroke } = selectedItem?.properties || {}

    const throttledSetNodeAttribute = useCallback(throttle(setNodeAttribute, 160), [])

    return (
        selectedItem &&
        <Panel
            title="Colors"
            className="color-editor"
        >
            {
                showFill &&
                <ColorPicker
                    id="fill"
                    title="Fill Color"
                    colors={[fill!]}
                    onChange={(color) => {
                        updateColor(color, 'fill')
                    }}
                />
            }
            {
                showStroke &&
                <ColorPicker
                    id="stroke"
                    title="Stroke Color"
                    colors={[stroke!]}
                    onChange={(color) => {
                        updateColor(color, 'stroke')
                    }}
                />
            }
        </Panel>
    )

    function updateColor(color: string, type: 'fill' | 'stroke') {
        throttledSetNodeAttribute({
            ids: [selectedItem!.id],
            properties: {
                [type]: color
            }
        })
    }
}