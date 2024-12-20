import { Space, Typography } from "antd"

interface Props {
    title: string
    children: React.ReactNode
}

export default function Panel(props: Props) {

    const { title, children } = props

    return (
        <Space direction='vertical' className='panel-item'>
            <Typography.Text strong>
                {title}
            </Typography.Text>
            {children}
        </Space>
    )
}