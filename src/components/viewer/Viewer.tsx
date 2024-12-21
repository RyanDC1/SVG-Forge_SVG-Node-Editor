import React, { useRef } from 'react'
import { message as antMessage } from 'antd'
import { ViewerLayout } from "@/components/layouts"
import { ConditionalRender } from "@/components/conditionalRender"
import { SVGUploader } from "@/components/viewer/uploader"
import { useEditorState } from "@/utils/hooks"
import { SVGViewerContainer } from '@/components/viewer/svgViewer'
import { HtmlViewer } from '@/components/viewer/htmlViewer'
import { ViewerContext } from '@/contexts'


export default function Viewer() {

    const [message, messageContext] = antMessage.useMessage()
    const isSvgUploaded = useEditorState(state => state.editorStateReducer.isUploaded)

    const htmlViewerRef = useRef<React.ComponentRef<typeof HtmlViewer>>(null!)

    return (
        <ViewerLayout
            htmlViewer={
                isSvgUploaded ? 
                <HtmlViewer 
                    ref={htmlViewerRef}
                />
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
                <ViewerContext
                    value={{
                        undo: () => htmlViewerRef.current?.undo(),
                        redo: () => htmlViewerRef.current?.redo()
                    }}
                >
                    <SVGViewerContainer />
                </ViewerContext>
            </ConditionalRender>
        </ViewerLayout>
    )
}