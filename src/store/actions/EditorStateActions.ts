import { EditorConfig, NodeAttributePayload } from "@/types";
import { 
    setEditorStateReducer,
    mapSVGDataReducer,
    setPreviewNodeReducer,
    clearEditorStateReducer,
    setSelectedNodesReducer,
    setNodeAttributeReducer,
    deleteNodeReducer,
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

export const setNodeAttribute = (data: NodeAttributePayload) => (dispatch: StoreDispatchType) => dispatch(setNodeAttributeReducer(data))

export const deleteNode = (ids: string[]) => (dispatch: StoreDispatchType) => dispatch(deleteNodeReducer(ids))

export const resetEditorState = () => (dispatch: StoreDispatchType) => dispatch(clearEditorStateReducer(undefined))