import { PayloadAction, SliceCaseReducers, SliceSelectors, createSlice } from "@reduxjs/toolkit";
import { EditorConfig } from "@/types";
import { mapSVGElements } from "@/utils/helpers";


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
        clearEditorStateReducer: () => initialState
    }
})

export const { 
    setEditorStateReducer,
    mapSVGDataReducer,
    setPreviewNodeReducer,
    setSelectedNodesReducer,
    clearEditorStateReducer,
} = EditorConfigReducer.actions
export default EditorConfigReducer.reducer