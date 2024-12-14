import { store, useDispatch } from '@/store'
import { setEditorState, setPreviewNode, resetEditorState, setSelectedNodes } from '@/store/actions'
import { EditorConfig } from '@/types'

export default function useEditorStateReducer() {

    const dispatch = useDispatch()

    return {
        setEditorState: (editorState: Partial<EditorConfig>) => setEditorState(editorState)(dispatch),
        setPreviewNode: (nodeId: EditorConfig['previewNode']) => setPreviewNode(nodeId)(dispatch),
        setSelectedNodes: (nodeIds: EditorConfig['selectedNodes']) => setSelectedNodes(nodeIds)(dispatch),
        resetEditorState: () => resetEditorState()(dispatch),
        getStoreState: () => store.getState()
    }
}