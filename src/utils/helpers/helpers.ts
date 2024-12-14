import { SVGDataItem, SVGFlatMap, SVGNodeTypes } from "@/types"
import { v4 as uuidv4 } from 'uuid'
import { get, isEmpty, startCase } from "lodash"
import { BezierCurveOutlined, CircleDashedOutlined, GroupOutlined, LineOutlined, PathOutlined, PolygonOutlined, PolylineOutlined, RectangleOutlined, SVGOutlined } from "@/components/icons"


function parseElementFromString(data: string, type: DOMParserSupportedType) {
    const parser = new DOMParser()
    return parser.parseFromString(data, type)
}

/**
 * Validate and parse HTML source code from string
 * 
 * on error the rejection message will be of type Element
 */
export async function parseDOM(data: string, type: DOMParserSupportedType): Promise<Element> {
    return new Promise<Element>((resolve, reject) => {
        const node = parseElementFromString(data, type)
        const errorNode = node.querySelector("parsererror")
        if (errorNode) {
            reject(errorNode)
        }

        resolve(node.documentElement)
    })
}

/**
 * Validate and parse SVG source code from string
 * 
 * on error the rejection message will be of type Element
*/
export async function parseSVG(data: string): Promise<SVGElement> {
    return await parseDOM(data, 'image/svg+xml') as SVGElement
}


/**
 * Returns the text representation of an HTML tag
 */
export function translateHTMLTag(tagName: string) {
    const translations = {
        // add custom translations
        'g': () => 'Group',
        'svg': () => 'SVG',
        default: () => startCase(tagName)
    }

    return get(translations, tagName.toLowerCase(), translations.default)()
}

export function getSVGNodeIcon(name: string) {

    const icons = {
        [SVGNodeTypes.SVG]: SVGOutlined,
        [SVGNodeTypes.GROUP]: GroupOutlined,
        [SVGNodeTypes.PATH]: PathOutlined,
        [SVGNodeTypes.POLYLINE]: PolylineOutlined,
        [SVGNodeTypes.POLYGON]: PolygonOutlined,
        [SVGNodeTypes.LINE]: LineOutlined,
        [SVGNodeTypes.RECT]: RectangleOutlined,
        [SVGNodeTypes.CIRCLE]: CircleDashedOutlined,
        default: BezierCurveOutlined
    }

    return get(icons, name?.trim().toLowerCase(), icons.default)
}

export function uuid() {
    return uuidv4()
}

export function mapSVGElements(svgString: string) {
    const flatMap: SVGFlatMap = {}

    try {
        const parser = new DOMParser()
        const node = parser.parseFromString(svgString, 'image/svg+xml')
        const svgElement = node.documentElement

        const assignedIds: string[] = []

        const getHierarchy = (elements: Element[], path: string[] = []): SVGDataItem[] => {
            return elements.map((element) => {

                let id = element.id?.trim()

                if (isEmpty(id) || assignedIds.includes(id)) {
                    id = uuid()
                }

                element.setAttribute('id', id)
                assignedIds.push(id)

                const item = {
                    id,
                    path,
                    name: translateHTMLTag(element.tagName),
                    children: element.hasChildNodes() ? getHierarchy(Array.from(element.children), [...path, id]) : []
                }

                flatMap[id] = item
                return item
            })
        }

        const map = getHierarchy([svgElement], [])

        return {
            map,
            flatMap,
            svg: svgElement.outerHTML
        }

    } catch (error) {
        console.error(error)
        return {
            map: [],
            flatMap: {}
        }
    }
}