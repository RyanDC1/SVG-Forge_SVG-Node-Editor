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

    const selectedNode = useEditorState(state => state.editorStateReducer.selectedNodes?.[0])
    const fill = useEditorState(state => state.editorStateReducer.svgData?.flatMap?.[selectedNode]?.attributes?.fill)
    const stroke = useEditorState(state => state.editorStateReducer.svgData?.flatMap?.[selectedNode]?.attributes?.stroke)

    const { setNodeAttribute } = useEditorStateReducer()

    const throttledSetNodeAttribute = useCallback(throttle(setNodeAttribute, 160), [])

    return (
        selectedNode &&
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
            ids: [selectedNode],
            properties: {
                [type]: color
            }
        })
    }
}