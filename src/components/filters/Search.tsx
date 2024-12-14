import { SearchOutlined } from '@ant-design/icons'
import { Input, InputProps } from 'antd'

interface Props extends Omit<InputProps, 'onChange'> {
    onSearch: (searchTerm: string) => void
}

export default function Search(props: Props) {

    const {
        onSearch,
        ...rest
    } = props

    return (
        <Input
            variant='filled'
            placeholder='Search'
            allowClear
            prefix={<SearchOutlined />}
            {...rest}
            rootClassName='ant-search'
            onChange={(event) => {
                onSearch(event.target.value)
            }}
        />
    )
}