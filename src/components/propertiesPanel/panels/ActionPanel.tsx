import { Button } from "antd";
import Panel from "./Panel";
import { useEditorState, useEditorStateReducer } from "@/utils/hooks";

export default function ActionPanel() {

    const { deleteNode, setSelectedNodes } = useEditorStateReducer()
    const selectedNodes = useEditorState(state => state.editorStateReducer.selectedNodes)

    return (
        <Panel
            title='Actions'
        >
            <Button
                danger
                block
                onClick={() => {
                    deleteNode(selectedNodes)
                    setSelectedNodes([])
                }}
            >
                Delete
            </Button>
        </Panel>
    )
}