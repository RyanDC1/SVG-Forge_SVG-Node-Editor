import { EditorLayout } from '@/components/layouts'
import { Viewer } from '@/components/viewer'
import { store } from '@/store'
import { Provider } from 'react-redux'
import { NodeHierarchy } from '../nodeHierarchy'
import { PropertiesPanel } from '../propertiesPanel'

export default function Editor() {
  return (
    <Provider store={store}>
        <EditorLayout
            leftToolbar={<NodeHierarchy title='Elements' />}
            viewer={<Viewer />}
            rightToolbar={<PropertiesPanel />}
        />
    </Provider>
  )
}