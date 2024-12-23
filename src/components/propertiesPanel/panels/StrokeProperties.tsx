import { useMemo, useRef } from "react";
import { InputNumber, Select, Typography } from "antd";
import { isEmpty } from "lodash";
import { useEditorState, useEditorStateReducer } from "@/utils/hooks";
import Panel from "./Panel";

type ValueType = 'px' | '%'

export default function StrokeProperties() {

    const { setNodeAttribute } = useEditorStateReducer()

    const selectedNode = useEditorState(state => state.editorStateReducer.selectedNodes?.[0])
    const strokeWidth = useEditorState(state => state.editorStateReducer.svgData?.flatMap?.[selectedNode]?.attributes?.strokeWidth) || ''

    const inputRef = useRef<React.ComponentRef<typeof InputNumber>>(null!)
    const valueTypeRef = useRef<ValueType>('px')

    const { value, valueType } = useMemo(() => {
        let value = ''
        let valueType: ValueType = 'px'

        if (isEmpty(strokeWidth.trim())) {
            value = ''
        }
        else {
            try {
                value = parseFloat(strokeWidth).toString()
            } catch {
                value = ''
            }
        }

        if (strokeWidth.includes('%')) {
            valueType = '%'
        }
        else {
            valueType = 'px'
        }

        return {
            value,
            valueType
        }
    }, [strokeWidth, selectedNode])

    return (
        <Panel
            title="Stroke Properties"
            key={selectedNode}
        >
            <Typography.Text type='secondary'>
                Stroke Width
            </Typography.Text>

            <InputNumber
                ref={inputRef}
                value={value as string}
                variant='filled'
                min="0"
                onChange={(value) => {
                    updateStrokeWidth(value!)
                }}
                step={valueType === '%' ? 0.1 : undefined}
                addonAfter={(
                    <Select
                        value={valueType}
                        onChange={(value) => {
                            valueTypeRef.current = value
                            updateStrokeWidth()
                        }}
                    >
                        <Select.Option value="px">px</Select.Option>
                        <Select.Option value="%">%</Select.Option>
                    </Select>
                )}
            />
        </Panel>
    )

    function updateStrokeWidth(value?: string) {
        const updatedValue = value ?? inputRef.current?.value
        setNodeAttribute({
            ids: [selectedNode],
            properties: {
                strokeWidth: updatedValue ? `${updatedValue }${valueTypeRef.current}` : ''
            }
        })
    }
}