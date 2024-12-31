export interface EditorConfig {
    fileName?: string,
    /**
     * The SVG xml file as string
     */
    svg?: string,
    /**
     * is true when a file is uploaded
     */
    isUploaded: boolean,
    /**
     * is true when the svg is ready to use after preprocessing
     */
    isLoaded: boolean,
    /**
     * contains the hierarchy and reference map for O(1) access
     */
    svgData?: {
        map: SVGDataItem[],
        flatMap: SVGFlatMap,
        theme: SVGTheme
    },
    /**
     * set the node on which an overlay is to be displayed
     * This will display an overlay in the viewport over the desired element
     */
    previewNode?: string,
    selectedNodes: string[]
}

export enum MonacoTheme {
    DARK = 'vs-dark',
    LIGHT = 'light'
}

export interface SVGDataItem {
    id: string,
    name: string,
    className?: string | null,
    /**
     * ids of each item of path traversed from root node
     */
    path: string[],
    children: SVGDataItem[],
    attributes: SVGDataItemProperties
}

interface SVGDataItemProperties {
    fill?: string | null,
    stroke?: string | null,
    strokeWidth?: string | null,
    strokeOpacity?: string | null
}

export type SVGFlatMap = Record<string, SVGDataItem>

export interface SVGTheme {
    fill: Record<string, string[]>,
    stroke: Record<string, string[]>
}

interface HTMLAttributes {
    id?: string,
    class?: string
}

export interface NodeAttributePayload {
    ids: string[],
    properties: HTMLAttributes & Partial<CSSStyleDeclaration>
}