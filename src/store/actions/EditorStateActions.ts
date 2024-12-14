import { EditorConfig } from "@/types";
import { 
    setEditorStateReducer,
    mapSVGDataReducer,
    setPreviewNodeReducer,
    clearEditorStateReducer,
    setSelectedNodesReducer,
} from "../reducers";
import { StoreDispatchType } from "../store";

export const setEditorState = (data: Partial<EditorConfig>) => (dispatch: StoreDispatchType) => {
    const { svg, ...rest } = data

    if(svg) {
        dispatch(mapSVGDataReducer(svg))
    }
    return dispatch(setEditorStateReducer(rest))
}

export const setPreviewNode = (data: EditorConfig['previewNode']) => (dispatch: StoreDispatchType) => dispatch(setPreviewNodeReducer(data))

export const setSelectedNodes = (data: EditorConfig['selectedNodes']) => (dispatch: StoreDispatchType) => dispatch(setSelectedNodesReducer(data))

export const resetEditorState = () => (dispatch: StoreDispatchType) => dispatch(clearEditorStateReducer(undefined))