import { EditorConfig } from '@/types'
import { useSelector } from 'react-redux'
import { StoreReducerType } from '@/store/store'

type ReducerType = { editorStateReducer: EditorConfig }
type SelectorType<T> = (state: ReducerType) => T

export default function useEditorState<T = EditorConfig>(selector?: SelectorType<T>) {

    const stateSelector: SelectorType<T> = selector || (
        (state) => {
            return state.editorStateReducer as T;
        }
    )

    return useSelector<StoreReducerType, T>(stateSelector)
}