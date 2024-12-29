import { Divider, Space, Typography } from 'antd'
import { filter, isEmpty } from 'lodash'
import { useEditorState } from '@/utils/hooks'
import {
  ActionPanel,
  ClassNamePanel,
  IdPanel,
  StrokeProperties,
  ThemeEditorPanel
} from '@/components/propertiesPanel/panels'
import { useMemo } from 'react'
import ColorEditorPanel from './panels/ColorEditorPanel'

export default function PropertiesPanel() {

  const selectedNodes = useEditorState(state => state.editorStateReducer.selectedNodes)
  const flatMap = useEditorState(state => state.editorStateReducer.svgData?.flatMap)

  const selectedItems = useMemo(() => {
    if (isEmpty(selectedNodes) || flatMap == null) {
      return []
    }
    else {
      return filter(flatMap, item => selectedNodes.includes(item.id))
    }
  }, [selectedNodes])

  const selectedItem = useMemo(() => {
    const isMultipleSelection = selectedNodes.length > 1

    return isMultipleSelection ?
      null
      :
      selectedItems[0]

  }, [selectedItems])

  return (
    <>
      <Typography.Text strong className='properties-panel-title'>
        <Space size={4}>
          {selectedItem?.name}
          Properties
        </Space>
      </Typography.Text>

      <Space
        direction='vertical'
        className='properties-panel'
        split={<Divider />}
        size={0}
      >

        <>
          {
            selectedItem && !isEmpty(selectedNodes) &&
            <>
              <IdPanel
                defaultValue={selectedItem.id}
                key={selectedItem.id}
              />

              <ClassNamePanel 
                key={selectedItem.className}
              />

              <ColorEditorPanel
                showFill={selectedItem?.name !== 'SVG'}
              />

              <StrokeProperties/>
            </>
          }

          {
            (selectedItem?.name === 'SVG' || isEmpty(selectedNodes)) &&
            <ThemeEditorPanel />
          }

          {
            selectedItem?.name !== 'SVG' && !isEmpty(selectedNodes) &&
            <ActionPanel />
          }
        </>
      </Space>
    </>
  )
}