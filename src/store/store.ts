import { configureStore } from '@reduxjs/toolkit'
import EditorStateReducer from './reducers/EditorStateReducer'
import { useDispatch as useReduxDispatch } from 'react-redux'

export const useDispatch: () => StoreDispatchType = useReduxDispatch

const store = configureStore({
  reducer: {
    editorStateReducer: EditorStateReducer,
  }
})

export default store
export type StoreDispatchType = typeof store.dispatch
export type StoreReducerType = ReturnType<typeof store.getState>