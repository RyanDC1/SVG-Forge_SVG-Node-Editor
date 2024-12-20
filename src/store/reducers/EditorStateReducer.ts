import { PayloadAction, SliceCaseReducers, SliceSelectors, createSlice } from "@reduxjs/toolkit";
import { EditorConfig, NodeAttributePayload } from "@/types";
import { deleteSVGNode, mapSVGElements } from "@/utils/helpers";


export const initialState: EditorConfig = {
    isUploaded: false,
    isLoaded: false,
    selectedNodes: []
}

const EditorConfigReducer = createSlice<EditorConfig, SliceCaseReducers<EditorConfig>, string, SliceSelectors<EditorConfig>, string>({
    name: 'SVG_DATA_REDUCER',
    initialState: initialState,
    reducers: {
        setEditorStateReducer: (state, action: PayloadAction<EditorConfig>) => {
            return {
                ...state,
                ...(action.payload)
            }
        },
        mapSVGDataReducer: (state, action: PayloadAction<EditorConfig['svg']>) => {
            const { map, flatMap, svg } = mapSVGElements(action.payload!)

            return {
                ...state,
                svgData: {
                    map,
                    flatMap
                },
                svg
            }
        },
        setPreviewNodeReducer: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                previewNode: action.payload
            }
        },
        setSelectedNodesReducer: (state, action: PayloadAction<string[]>) => {
            return {
                ...state,
                selectedNodes: action.payload
            }
        },
        setNodeAttributeReducer: (state, action: PayloadAction<NodeAttributePayload>) => {

            const { map, flatMap, svg } = mapSVGElements(
                state.svg!,
                {
                    customProperties: action.payload
                }
            )

            return {
                ...state,
                svgData: {
                    map,
                    flatMap
                },
                svg
            }
        },
        deleteNodeReducer: (state, action: PayloadAction<string[]>) => {

            const svgString = deleteSVGNode(state.svg!, action.payload)

            const { map, flatMap, svg } = mapSVGElements(svgString)

            return {
                ...state,
                svgData: {
                    map,
                    flatMap
                },
                svg
            }
        },
        clearEditorStateReducer: () => initialState
    }
})

export const {
    setEditorStateReducer,
    mapSVGDataReducer,
    setPreviewNodeReducer,
    setSelectedNodesReducer,
    setNodeAttributeReducer,
    deleteNodeReducer,
    clearEditorStateReducer,
} = EditorConfigReducer.actions
export default EditorConfigReducer.reducer