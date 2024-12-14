import { Button, Flex, Space, Tooltip, Typography, Modal, message as antMessage } from "antd"
import { useEditorState, useEditorStateReducer } from "@/utils/hooks"
import { CodeOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons"

export default function SVGViewerHeader() {

    const SVGName = useEditorState(state => state.editorStateReducer.fileName)
    const { resetEditorState, getStoreState } = useEditorStateReducer()

    const [modal, modalContext] = Modal.useModal()
    const [message, messageContext] = antMessage.useMessage()

    return (
        <Flex 
            justify='space-between' 
            className='svg-header-content' 
            align='center' 
            wrap
        >
            {modalContext}
            {messageContext}
            <span className='header-title'>
                <Typography.Text strong>
                    {SVGName}
                </Typography.Text>
            </span>
            <span>
                <Space>
                    <Tooltip title='Clear'>
                        <Button
                            type='link'
                            icon={<DeleteOutlined />}
                            danger
                            onClick={clearSVGData}
                        />
                    </Tooltip>

                    <Tooltip title='Download'>
                        <Button
                            type='link'
                            icon={<DownloadOutlined />}
                            onClick={downloadSVG}
                        />
                    </Tooltip>

                    <Tooltip title='Copy Code'>
                        <Button
                            type='link'
                            icon={<CodeOutlined />}
                            onClick={copySVGCode}
                        />
                    </Tooltip>
                </Space>
            </span>
        </Flex>
    )

    function clearSVGData() {
        modal.confirm({
            title: 'Are you sure?',
            content: `Any changes to ${SVGName} will be lost`,
            onOk: resetEditorState,
            okText: 'Clear',
            okButtonProps: {
                danger: true
            }
        })
    }

    function downloadSVG() {
        const { editorStateReducer } = getStoreState()
        if (editorStateReducer?.svg) {
            const blob = new Blob([editorStateReducer.svg], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = SVGName!
            a.click()

            URL.revokeObjectURL(url)
        }
    }

    function copySVGCode() {
        const { editorStateReducer } = getStoreState()
        if (editorStateReducer?.svg) {
            navigator.clipboard.writeText(editorStateReducer.svg)
            .then(() => {
                message.success('SVG code copied to clipboard')
            })
            .catch((error) => {
                console.error(error)
            })
        }
    }
}