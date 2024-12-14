import { Layout } from "antd"

const { Sider, Content } = Layout

interface Props {
    leftToolbar: React.ReactNode,
    rightToolbar: React.ReactNode,
    viewer: React.ReactNode
}

export default function EditorLayout(props: Props) {

    const { leftToolbar, rightToolbar, viewer } = props

    return (
        <Layout className="editor-layout">
            <Sider id='editor-map-panel'>
                {leftToolbar}
            </Sider>
            <Content>
                {viewer}
            </Content>
            <Sider id='editor-properties-panel'>
                {rightToolbar}
            </Sider>
        </Layout>
    )
}