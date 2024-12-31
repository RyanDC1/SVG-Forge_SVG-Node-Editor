import { Space, Typography } from "antd"
import { isEmpty } from "lodash"
import ColorPicker from "./ColorPicker"

interface Props extends Omit<React.ComponentProps<typeof ColorPicker>, 'color'> {
    id: string,
    title: string,
    colors: string[]
}

export default function ColorPickerList(props: Props) {

    const { id, title, colors, ...rest } = props

    return (
        !isEmpty(colors) &&
        <Space direction='vertical'>
            <Typography.Text type='secondary'>{title}</Typography.Text>
            <Space direction='vertical'>
                {
                    colors.map((color, index) => (
                        <ColorPicker
                            {...rest}
                            key={`${id}-${index}`}
                            color={color}
                        />
                    ))
                }
            </Space>
        </Space>
    )
}