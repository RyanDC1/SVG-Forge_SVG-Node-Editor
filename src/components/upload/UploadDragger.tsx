import { Upload, UploadProps, message as antMessage } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

interface Props extends UploadProps {
    allowedFileTypes?: string[]
}

export default function UploadDragger(props: Props) {

    const { allowedFileTypes, ...rest } = props

    const [message, messageContext] = antMessage.useMessage()

    return (
        <Upload.Dragger
            multiple={false}
            showUploadList={false}
            maxCount={1}
            fileList={[]}
            accept={allowedFileTypes?.join(',')}
            beforeUpload={(file) => {
                if (allowedFileTypes && !allowedFileTypes.includes(file?.type)) {
                    message.error('Invalid file type, please upload an SVG file.')
                    return false
                }
            }}
            {...rest}
        >
            {messageContext}
            <p className="ant-upload-drag-icon">
                <UploadOutlined />
            </p>
            <p className="ant-upload-text">
                Click or drag an SVG file to this area to upload
            </p>
        </Upload.Dragger>
    )
}