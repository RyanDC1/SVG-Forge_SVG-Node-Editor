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
        flatMap: SVGFlatMap
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
    /**
     * ids of each item of path traversed from root node
     */
    path: string[]
    children: SVGDataItem[]
}

export type SVGFlatMap = Record<string, SVGDataItem>