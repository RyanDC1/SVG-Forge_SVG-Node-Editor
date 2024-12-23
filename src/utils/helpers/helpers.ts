import { NodeAttributePayload, SVGDataItem, SVGFlatMap, SVGNodeTypes, SVGTheme } from "@/types"
import { v4 as uuidv4 } from 'uuid'
import { get, isEmpty, kebabCase, startCase } from "lodash"
import Color from 'color'
import {
    BezierCurveOutlined,
    CircleDashedOutlined,
    GroupOutlined,
    LineOutlined,
    PathOutlined,
    PolygonOutlined,
    PolylineOutlined,
    RectangleOutlined,
    SVGOutlined
} from "@/components/icons"


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

/**
 * Modifies element color/fill property from styles and normalizes it to hexadecimal value
 */
function normalizeSVGNodeColor(element: HTMLElement, color: string, type: 'fill' | 'stroke') {
    if(color.toLowerCase() === 'none') {
        element?.style?.removeProperty(type)
        element.setAttribute(type, 'none')
        return
    }

    const normalizedColor = Color(color).hexa()
    element?.style?.removeProperty(type)
    element.setAttribute(type, normalizedColor)
    return normalizedColor.toUpperCase()
}

/**
 * Transforms inline style to inline attribute values
 */
function transformStyleToInlineAttr(element: HTMLElement, property: keyof Partial<CSSStyleDeclaration>): Partial<CSSStyleDeclaration> {
    const propertyName: string = kebabCase(property as string)
    const value = element?.style?.getPropertyValue(propertyName)
    if (value) {
        (element as HTMLElement)?.style?.removeProperty(propertyName as string)
        element.setAttribute(propertyName, value)

        return {
            [property]: element.getAttribute(propertyName)!
        }
    }

    return element.hasAttribute(propertyName) ?
        {
            [property]: element.getAttribute(propertyName)!
        } : {}

}

interface MapSVGElementsOptions {
    /**
     * pass custom properties to be set on the SVG
     */
    customProperties?: NodeAttributePayload
}

export function mapSVGElements(svgString: string, options: MapSVGElementsOptions = {}) {
    const flatMap: SVGFlatMap = {}
    const theme: SVGTheme = {
        fill: [],
        stroke: []
    }

    const { customProperties } = options

    try {
        const node = parseElementFromString(svgString, 'image/svg+xml')
        const svgElement = node.documentElement

        const assignedIds: string[] = []

        const mapHierarchy = (elements: Element[], path: string[] = []): SVGDataItem[] => {
            return elements.map((element) => {

                let definedProperties: Partial<CSSStyleDeclaration> = {}

                if (customProperties?.ids && customProperties.ids.includes(element.id)) {
                    // Add custom properties and update svg element while mapping
                    for (const [name, value] of Object.entries(customProperties.properties)) {
                        element.setAttribute(kebabCase(name), value)
                    }
                }

                // #region Id Assignment
                let id = element.id?.trim()

                if (isEmpty(id) || assignedIds.includes(id)) {
                    id = uuid()
                }

                element.setAttribute('id', id)
                assignedIds.push(id)
                // #endregion Id Assignment


                // #region color normalization

                // fill colors
                const color = (element as HTMLElement)?.style?.fill || element.getAttribute('fill')
                if (color) {
                    try {
                        const normalizedColor = normalizeSVGNodeColor(element as HTMLElement, color, 'fill')
                        if (normalizedColor && !theme.fill.includes(normalizedColor)) {
                            theme.fill.push(normalizedColor)
                        }
                    }
                    catch (error) {
                        console.log(error)
                    }
                }

                // stroke colors
                const strokeColor = (element as HTMLElement)?.style?.stroke || element.getAttribute('stroke')
                if (strokeColor) {
                    try {
                        const normalizedColor = normalizeSVGNodeColor(element as HTMLElement, strokeColor, 'stroke')
                        if (normalizedColor && !theme.stroke.includes(normalizedColor)) {
                            theme.stroke.push(normalizedColor)
                        }
                    }
                    catch (error) {
                        console.log(error)
                    }
                }

                // #endregion color normalization

                // #region convert style to inline attribute
                const attributes: (keyof CSSStyleDeclaration)[] = [
                    'strokeWidth',
                    'strokeOpacity'
                ]

                attributes.forEach((attribute) => {
                    const attributeData = transformStyleToInlineAttr(element as HTMLElement, attribute)
                    definedProperties = {
                        ...definedProperties,
                        ...attributeData
                    }
                })
                // #endregion convert style to inline attribute


                if (isEmpty(element.getAttribute('style'))) {
                    element.removeAttribute('style')
                }

                const item: SVGDataItem = {
                    id,
                    path,
                    className: element.getAttribute('class'),
                    name: translateHTMLTag(element.tagName),
                    children: element.hasChildNodes() ? mapHierarchy(Array.from(element.children), [...path, id]) : [],
                    attributes: {
                        fill: color,
                        stroke: strokeColor,
                        ...definedProperties
                    }
                }

                flatMap[id] = item
                return item
            })
        }

        const map = mapHierarchy([svgElement], [])

        return {
            map,
            flatMap,
            theme,
            svg: svgElement.outerHTML
        }

    } catch (error) {
        console.error(error)
        return {
            map: [],
            flatMap: {},
            theme
        }
    }
}

/**
 * returns the new svgString with the deleted node
 */
export function deleteSVGNode(svgString: string, ids: string[]) {
    const svg = parseElementFromString(svgString, 'image/svg+xml')
    const svgElement = svg.documentElement

    const htmlDocument = document.implementation.createHTMLDocument()
    htmlDocument.body.append(svgElement)

    ids.forEach(id => {
        const node = htmlDocument.getElementById(id)
        if (node && node.tagName.toLowerCase() !== 'svg') {
            node.remove()
        }
    })

    return htmlDocument.body.innerHTML
}

/**
 * returns a string interpretation of key combinations with ctrl and shift key
 * 
 * order: ctrl > alt > shift > key
 * 
 * @example 'ctrl + shift + z'
 */
export function getKeyCombination(event: KeyboardEvent) {
    const combination: string[] = []

    if (event.ctrlKey) {
        combination.push('ctrl')
    }
    if (event.altKey) {
        combination.push('alt')
    }
    if (event.shiftKey) {
        combination.push('shift')
    }

    combination.push(event.key.toLowerCase())

    return combination.join(' + ')
}