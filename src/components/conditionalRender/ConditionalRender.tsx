
interface Props {
    condition: boolean,
    children: React.ReactNode,
    fallback: React.ReactNode
}

export default function ConditionalRender(props: Props) {

    const { condition, fallback, children } = props

    return (
        <>
            {
                condition ?
                children
                :
                fallback
            }
        </>
    )
}