
interface Props {
    header: React.ReactNode,
    children: React.ReactNode,
    footer: React.ReactNode
}

export default function SVGViewerLayout(props: Props) {

    const { header, children, footer } = props

    return (
        <span className='svg-viewport'>
            <span className='svg-viewer-header'>
                {header}
            </span>
            <span className='svg-viewer-layout'>
                {children}
                <span className='svg-viewer-footer'>
                    {footer}
                </span>
            </span>
        </span>
    )
}