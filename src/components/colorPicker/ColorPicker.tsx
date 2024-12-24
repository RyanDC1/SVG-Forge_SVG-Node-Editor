import { ColorPicker as AntColorPicker, Space, Typography } from "antd"
import Color from "color"
import { isEmpty } from "lodash"

interface Props {
    id: string,
    title: string,
    colors: string[],
    onChange: (color: string, prevColor: string) => void
}

export default function ColorPicker(props: Props) {

    const { id, title, colors, onChange } = props

    return (
        !isEmpty(colors) &&
        <Space direction='vertical'>
            <Typography.Text type='secondary'>{title}</Typography.Text>
            <Space direction='vertical'>
                {
                    colors.map((color, index) => (
                        <AntColorPicker
                            key={`${id}-${index}`}
                            value={color != 'none' ? color : undefined}
                            allowClear
                            showText={(color) => {
                                return (
                                    <Typography.Text
                                        type='secondary'
                                        copyable
                                    >
                                        {color.toHexString().toUpperCase()}
                                    </Typography.Text>
                                )
                            }}
                            disabledFormat
                            format='hex'
                            onChange={(value, rgb) => {
                                if(!value.cleared) {
                                    const newColor = Color(rgb).hexa()
                                    onChange(newColor, color)
                                }
                            }}
                            onClear={() => {
                                onChange('', color)
                            }}
                        />
                    ))
                }
            </Space>
        </Space>
    )
}