import { Divider, Space, Typography } from 'antd'
import { filter, isEmpty } from 'lodash'
import { useEditorState } from '@/utils/hooks'
import {
  ActionPanel,
  IdPanel,
  ThemeEditorPanel
} from '@/components/propertiesPanel/panels'
import { useMemo } from 'react'

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
    <Space
      direction='vertical'
      className='properties-panel'
      split={<Divider />}
      size={0}
    >
      <Typography.Text strong>
        <Space size={4}>
          {selectedItem?.name}
          Properties
        </Space>
      </Typography.Text>

      <>
        {
          selectedItem && !isEmpty(selectedNodes) &&
          <IdPanel
            defaultValue={selectedItem.id}
            key={selectedItem.id}
          />
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
  )
}