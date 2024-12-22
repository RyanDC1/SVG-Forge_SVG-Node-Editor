import { Space, Typography } from "antd"

interface Props {
    title: string
    children: React.ReactNode,
    className?: string
}

export default function Panel(props: Props) {

    const { title, children, className } = props

    return (
        <Space 
            direction='vertical' 
            className={['panel-item', className].filter(name => name != null).join(' ')}
        >
            <Typography.Text strong>
                {title}
            </Typography.Text>
            {children}
        </Space>
    )
}