import { store, useDispatch } from '@/store'
import { setEditorState, setPreviewNode, resetEditorState, setSelectedNodes, setNodeAttribute, deleteNode } from '@/store/actions'
import { EditorConfig, NodeAttributePayload } from '@/types'

export default function useEditorStateReducer() {

    const dispatch = useDispatch()

    return {
        setEditorState: (editorState: Partial<EditorConfig>) => setEditorState(editorState)(dispatch),
        setPreviewNode: (nodeId: EditorConfig['previewNode']) => setPreviewNode(nodeId)(dispatch),
        setSelectedNodes: (nodeIds: EditorConfig['selectedNodes']) => setSelectedNodes(nodeIds)(dispatch),
        setNodeAttribute: (properties: NodeAttributePayload) => setNodeAttribute(properties)(dispatch),
        deleteNode: (ids: string[]) => deleteNode(ids)(dispatch),
        resetEditorState: () => resetEditorState()(dispatch),
        getStoreState: () => store.getState()
    }
}