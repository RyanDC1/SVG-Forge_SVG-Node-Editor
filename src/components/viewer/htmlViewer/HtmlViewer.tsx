import { useRef, useState } from "react";
import { Button, ConfigProvider, Flex, Modal, Space, Spin, theme as antTheme } from "antd";
import { CloseCircleFilled, CloseOutlined, LoadingOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import Editor from '@monaco-editor/react';
import { editor, Range } from "monaco-editor";
import { useBrowserStore, useEditorState, useEditorStateReducer } from "@/utils/hooks"
import { localStoreKeys } from "@/utils/constants";
import { MonacoTheme } from "@/types";
import { parseSVG } from "@/utils/helpers";

interface Error {
    line: number,
    column: number,
    code: string
}

export default function HtmlViewer() {

    const svg = useEditorState(state => state.editorStateReducer.svg)
    const { setEditorState } = useEditorStateReducer()
    const { getFromStore, addToStore } = useBrowserStore()

    const [theme, setTheme] = useState<MonacoTheme>(() => {
        return getFromStore(localStoreKeys.MONACO_THEME) ?? MonacoTheme.DARK
    })

    const [showError, setShowError] = useState(false)
    const [error, setError] = useState<Error | undefined>()

    const errorContentRef = useRef<HTMLElement>(null!)
    const xmlErrorCodeRef = useRef<editor.IStandaloneCodeEditor>(null!)

    return (
        <div className="html-viewer-container">
            <Editor
                key='main-html-viewer'
                language="html"
                value={svg}
                theme={theme}
                loading={<Spin indicator={<LoadingOutlined />} />}
                options={{
                    colorDecorators: true,
                    wordWrap: 'bounded',
                    minimap: {
                        enabled: false
                    },
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollBeyondLastLine: false
                }}
                onChange={(svgString) => {
                    validateAndSave(svgString!)
                }}
                onMount={(editor) => {
                    onEditorLoad(editor)
                }}
            />

            <ConfigProvider
                theme={{
                    algorithm: theme === MonacoTheme.DARK ?
                        antTheme.darkAlgorithm
                        :
                        antTheme.defaultAlgorithm
                }}
            >
                <div
                    className="monaco-editor-footer"
                >
                    <Space>
                        {
                            <Button
                                danger
                                type='primary'
                                style={{
                                    opacity: error ? '1' : '0'
                                }}
                                shape='circle'
                                size='large'
                                icon={<CloseOutlined />}
                                onClick={() => error && setShowError(true)}
                            />
                        }
                        <Button
                            icon={
                                theme === MonacoTheme.DARK ?
                                    <SunOutlined />
                                    :
                                    <MoonOutlined />
                            }
                            shape='circle'
                            size='large'
                            onClick={switchTheme}
                        />
                    </Space>
                </div>

                <Modal
                    open={showError}
                    title={
                        <Flex
                            gap={8}
                            align='center'
                            className="xml-error-modal-title"
                        >
                            <CloseCircleFilled />
                            Error
                        </Flex>
                    }
                    footer={null}
                    forceRender
                    width={800}
                    centered
                    rootClassName="xml-error-view-modal"
                    onCancel={() => setShowError(false)}
                    afterOpenChange={(open) => {
                        if (open && error) {
                            xmlErrorCodeRef.current.revealLineInCenter(error.line)
                            xmlErrorCodeRef.current.createDecorationsCollection([
                                {
                                    range: new Range(
                                        error.line,
                                        error.column,
                                        error.line,
                                        error.column
                                    ),
                                    options: {
                                        isWholeLine: true,
                                        className: "monaco-error-glyph-content",
                                        glyphMarginClassName: "monaco-error-glyph-margin"
                                    },
                                },
                            ]);
                        }
                    }}
                >
                    <>
                        <span ref={errorContentRef} />
                        <Editor
                            language="xml"
                            line={error?.line}
                            className="xml-error-view"
                            key='xml-error-view'
                            value={error?.code ?? undefined}
                            theme={theme}
                            loading={<Spin />}
                            options={{
                                wordWrap: 'bounded',
                                minimap: {
                                    enabled: false
                                },
                                readOnly: true,
                                scrollBeyondLastLine: false,
                                scrollBeyondLastColumn: 1
                            }}
                            onMount={(editor) => {
                                xmlErrorCodeRef.current = editor
                                onEditorLoad(editor)
                            }}
                        />
                    </>
                </Modal>
            </ConfigProvider>
        </div>
    )

    function switchTheme() {
        const selectedTheme = theme === MonacoTheme.DARK ?
            MonacoTheme.LIGHT
            :
            MonacoTheme.DARK

        setTheme(selectedTheme)
        addToStore(localStoreKeys.MONACO_THEME, selectedTheme)
    }

    function onEditorLoad(editor: editor.IStandaloneCodeEditor) {
        setTimeout(function () {
            editor.getAction?.('editor.action.formatDocument')?.run();
        }, 0);
    }

    async function validateAndSave(svgData: string) {
        // reset error state
        setError(undefined)

        parseSVG(svgData)
            .then(() => {
                setEditorState({
                    svg: svgData
                })
            })
            .catch((errorNode: Element) => {
                // clean up previous errors
                if (errorContentRef.current.hasChildNodes()) {
                    const childNode = errorContentRef.current.firstChild
                    if (childNode) {
                        errorContentRef.current.removeChild(childNode)
                    }
                }

                const container = document.createElement('div');
                container.setHTMLUnsafe(errorNode.innerHTML);

                errorContentRef.current.appendChild(container);

                // get the line and column number of the error
                const regex = /error on line ([0-9]?.) at column ([0-9]?.)/gm
                const errors = errorNode.textContent?.match(regex)?.map(match => ({
                    line: ~~match.replace(regex, '$1'),
                    column: ~~match.replace(regex, '$2')
                }))


                setError({
                    line: errors?.[0]?.line ?? 1,
                    column: errors?.[0]?.column ?? 1,
                    code: svgData
                })
            })
    }
}