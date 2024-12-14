import { Splitter } from 'antd'
import { useState } from 'react'

interface Props {
    children: React.ReactNode,
    htmlViewer?: React.ReactNode
}

export default function ViewerLayout(props: Props) {

    const { children, htmlViewer } = props

    const [sizes, setSizes] = useState<(number | string)[]>(['80%', '20%'])

    return (
        <Splitter 
            className='viewer-layout' 
            layout='vertical'
            onResize={setSizes}
        >
            <Splitter.Panel 
                size={sizes[0]}
                className='svg-viewer-container'
                min={38}
            >
                {children}
            </Splitter.Panel>
            {
                htmlViewer &&
                <Splitter.Panel 
                    collapsible 
                    size={sizes[1]}
                    min={2}
                    className='html-viewer-container'
                >
                    {htmlViewer}
                </Splitter.Panel>
            }
        </Splitter>
    )
}