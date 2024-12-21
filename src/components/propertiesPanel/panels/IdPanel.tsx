import { useCallback, useRef } from "react";
import { Input, InputProps, InputRef } from "antd";
import { debounce } from "lodash";
import { useEditorState, useEditorStateReducer } from "@/utils/hooks";
import Panel from "./Panel";

export default function IdPanel(props: InputProps) {

    const inputRef = useRef<InputRef>(null!)

    const { setNodeAttribute, setSelectedNodes } = useEditorStateReducer()
    const selectedNodes = useEditorState(state => state.editorStateReducer.selectedNodes)

    const debouncedUpdateSelectedNodes = useCallback(debounce((ids) => {
        setSelectedNodes(ids)
    }, 60), [selectedNodes])

    return (
        <Panel title="ID">
            <Input
                {...props}
                ref={inputRef}
                variant='filled'
                onFocus={() => {
                    const value = props.value ?? props.defaultValue
                    if(value) {
                        inputRef.current.setSelectionRange(0, String(value).length)
                    }
                }}
                onKeyDown={(event) => {
                    if(event.key === 'Enter') {
                        inputRef.current.blur()
                        updateId()
                    }
                }}
                onBlur={updateId}
            />
        </Panel>
    )

    function updateId() {
        const value = inputRef.current.input?.value
        const oldValue = props.value ?? props.defaultValue

        if(value) {
            setNodeAttribute({
                ids: [oldValue as string],
                properties: {
                    id: value
                }
            })
    
            debouncedUpdateSelectedNodes([...selectedNodes.filter(s => s !== oldValue), value])
        }
    }
}