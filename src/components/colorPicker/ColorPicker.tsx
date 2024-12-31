import { ColorPicker as AntColorPicker, ColorPickerProps, Typography } from "antd"
import Color from "color"
import { useRef } from "react"

interface Props extends Omit<ColorPickerProps, 'onChange' | 'onClear' | 'allowClear' | 'showText' | 'value' | 'disabledFormat' | 'format'> {
    color: string,
    onChange: (color: string, prevColor: string) => void,
    onBlur?: (color: string) => void
}

export default function ColorPicker(props: Props) {

    const { color, onChange, onBlur, ...rest } = props

    const colorRef = useRef(color)

    return (
        <AntColorPicker
            {...rest}
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
                if (!value.cleared) {
                    const newColor = Color(rgb).hexa()
                    onChange(newColor, color)
                    colorRef.current = newColor
                }
            }}
            onClear={() => {
                onChange('', color)
                colorRef.current = ''
            }}
            onOpenChange={(open) => {
                if(!open) {
                    onBlur?.(colorRef.current)
                }
            }}
        />
    )
}