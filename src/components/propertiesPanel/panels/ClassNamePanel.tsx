import { useRef } from "react";
import { Input, InputRef } from "antd";
import { useEditorState, useEditorStateReducer } from "@/utils/hooks";
import Panel from "./Panel";

export default function ClassNamePanel() {

    const { setNodeAttribute } = useEditorStateReducer()

    const selectedNode = useEditorState(state => state.editorStateReducer.selectedNodes?.[0])
    const { className } = useEditorState(state => state.editorStateReducer.svgData?.flatMap?.[selectedNode]) || {}

    const inputRef = useRef<InputRef>(null!)

    return (
        <Panel title="Class">
            <Input
                ref={inputRef}
                placeholder="Add Class"
                variant='filled'
                defaultValue={className as string}
                onFocus={() => {
                    const value = inputRef.current.input?.value
                    if(value) {
                        inputRef.current.setSelectionRange(0, String(value).length)
                    }
                }}
                onKeyDown={(event) => {
                    if(event.key === 'Enter') {
                        inputRef.current.blur()
                        updateClassName()
                    }
                }}
                onBlur={updateClassName}
            />
        </Panel>
    )

    function updateClassName() {
        const value = inputRef.current.input?.value ?? ''

        setNodeAttribute({
            ids: [selectedNode],
            properties: {
                class: value
            }
        })
    }
}