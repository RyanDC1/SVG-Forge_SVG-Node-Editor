import { message as antMessage } from 'antd'
import { ViewerLayout } from "@/components/layouts"
import { ConditionalRender } from "@/components/conditionalRender"
import { SVGUploader } from "@/components/viewer/uploader"
import { useEditorState } from "@/utils/hooks"
import { SVGViewerContainer } from '@/components/viewer/svgViewer'
import { HtmlViewer } from '@/components/viewer/htmlViewer'


export default function Viewer() {

    const [message, messageContext] = antMessage.useMessage()
    const isSvgUploaded = useEditorState(state => state.editorStateReducer.isUploaded)

    return (
        <ViewerLayout
            htmlViewer={
                isSvgUploaded ? 
                <HtmlViewer />
                : 
                null
            }
        >
            {messageContext}
            <ConditionalRender
                condition={isSvgUploaded}
                fallback={
                    <SVGUploader 
                        onUploadComplete={(name) => {
                            message.success(`${name} uploaded successfully`)
                        }}
                        onError={() => {
                            message.error('An error occurred while uploading the file')
                        }}
                    />
                }
            >
                <SVGViewerContainer />
            </ConditionalRender>
        </ViewerLayout>
    )
}