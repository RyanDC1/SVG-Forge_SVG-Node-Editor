import { message as antMessage } from 'antd'
import { useEditorStateReducer } from '@/utils/hooks';
import { UploadDragger } from '@/components/upload';
import { RcFile } from 'antd/es/upload';
import { parseSVG } from '@/utils/helpers';

interface Props {
    onUploadComplete?: (fileName: string) => void,
    onError?: () => void
}

export default function SVGUploader(props: Props) {

    const { onUploadComplete, onError } = props

    const { setEditorState } = useEditorStateReducer()

    const [message, messageContext] = antMessage.useMessage()

    return (
        <>
            {messageContext}
            <UploadDragger
                allowedFileTypes={['image/svg+xml']}
                customRequest={(options) => {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        if (event.target?.DONE) {
                            parseSVG(event.target?.result as string)
                            .then(() => {
                                setTimeout(() => {
                                    setEditorState({
                                        fileName: (options.file as RcFile).name,
                                        svg: event.target?.result as string,
                                        isUploaded: true
                                    })
                                }, 60);
        
                                onUploadComplete?.((options.file as RcFile).name)
                            })
                            .catch((error) => {
                                console.log(error)
                                message.error('Invalid format, please upload a properly formatted SVG file')
                            })
                        }
                    }
                    reader.onerror = () => onError?.()
                    reader.readAsText(options.file as RcFile);
                }}
            />
        </>
    )
}