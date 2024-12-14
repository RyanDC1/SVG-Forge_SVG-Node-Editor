import { MutableRefObject, useEffect, useState } from "react"


export default function useResizeObserver(element: Element | MutableRefObject<Element> | (() => Element), deps = []) {

    const [size, setSize] = useState<DOMRectReadOnly | undefined>()

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            setSize(entries[0].contentRect)
        })

        let target : Element | null = null
        if(typeof element === 'function') {
            target = element()
        }
        else if(typeof element === 'object') {
            if((element as MutableRefObject<Element>)?.current) {
                target = (element as MutableRefObject<Element>).current
            }
            else {
                target = element as Element
            }
        }

        if(target) {
            observer.observe(target)
        }

        return () => {
            observer?.disconnect()
        }
    
    }, deps)

    return size
}