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
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

type DispatchAction<T> = {
    payload: T;
    type: `${string}/${string}`;
}

type ThunkAction = ThunkDispatch<{ editorStateReducer: EditorConfig; }, undefined, DispatchAction<UnknownAction> & Dispatch<DispatchAction<UnknownAction>>>

const createDispatchAction = <T>(reducerAction: (data: T) => StoreDispatchType) => (data: T) => (dispatch: StoreDispatchType) => dispatch(reducerAction(data));

export const setEditorState = (data: Partial<EditorConfig>) => (dispatch: StoreDispatchType) => {
    const { svg, ...rest } = data

    if(svg) {
        dispatch(mapSVGDataReducer(svg))
    }
    return dispatch(setEditorStateReducer(rest))
}

export const setPreviewNode = createDispatchAction<EditorConfig['previewNode']>(setPreviewNodeReducer as ThunkAction)

export const setSelectedNodes = createDispatchAction<EditorConfig['selectedNodes']>(setSelectedNodesReducer as ThunkAction)

export const setNodeAttribute = createDispatchAction<NodeAttributePayload>(setNodeAttributeReducer as ThunkAction)

export const deleteNode = createDispatchAction<string[]>(deleteNodeReducer as ThunkAction)

export const resetEditorState = createDispatchAction<void>(clearEditorStateReducer as ThunkAction)