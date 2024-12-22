import { useEffect, useMemo, useRef, useState } from "react"
import { Space, Tree, Typography, TreeDataNode } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { isEmpty, last, uniq } from "lodash"
import { Search } from "@/components/filters"
import NodeHierarchyTitle from "@/components/nodeHierarchy/NodeHierarchyTitle"
import { useEditorState, useEditorStateReducer } from "@/utils/hooks"
import { SVGDataItem, SVGFlatMap } from "@/types"
import { getSVGNodeIcon } from "@/utils/helpers"

interface Props {
    title: React.ReactNode
}

interface TreeData extends TreeDataNode {
    label: string
}

const getTreeData = (svgData: SVGDataItem[], flatMap: SVGFlatMap, searchTerm: string)
    : { data: TreeData[], expandedKeys: React.Key[] } => {

    if (svgData == null) {
        return {
            data: [],
            expandedKeys: []
        }
    }

    const filteredIds = !isEmpty(searchTerm) ? Object.values(flatMap)
        .filter(item =>
            item.name.trim()
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase())
            ||
            item.id.trim()
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase())
        )
        .map(item => [...item.path, item.id])
        .flat()
        :
        null

    const mapTreeData = (data: SVGDataItem[]): TreeData[] => {
        const filteredData = filteredIds !== null ?
            data.filter(item =>
                filteredIds.includes(item.id)
            )
            :
            data

        return filteredData.map(item => {
            const Icon = getSVGNodeIcon(item.name)
            
            return {
                key: item.id,
                children: item.children?.length > 0 ? mapTreeData(item.children) : [],
                title: item.name,
                label: item.name ?? '',
                icon: <Icon />
            }
        })
    }

    return {
        data: mapTreeData(svgData),
        expandedKeys: filteredIds || [svgData?.[0]?.id]
    }
}


export default function NodeHierarchy(props: Props) {

    const { title } = props

    const hierarchy = useEditorState(state => state.editorStateReducer.svgData?.map)
    const flatMap = useEditorState(state => state.editorStateReducer.svgData?.flatMap)
    const checkedNodes = useEditorState(state => state.editorStateReducer.selectedNodes)

    const { setPreviewNode, setSelectedNodes } = useEditorStateReducer()

    const [searchTerm, setSearchTerm] = useState('')
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])

    const treeRef = useRef<React.ComponentRef<typeof Tree>>(null!)
    const locallyCheckedKeysRef = useRef<React.Key[]>([])

    const treeData = useMemo(() => {
        const { data, expandedKeys } = getTreeData(hierarchy!, flatMap!, searchTerm)
        setExpandedKeys((keys) => uniq([...keys, ...expandedKeys]))

        return data
    }, [hierarchy, searchTerm])

    useEffect(() => {
        const lastCheckedId = last(checkedNodes)

        if(lastCheckedId) {
            const selectedNode = flatMap?.[lastCheckedId]

            if(selectedNode) {
                const path = [...selectedNode.path, selectedNode.id]
                setExpandedKeys((keys) => uniq([...keys, ...path]))
            }

            if(!locallyCheckedKeysRef.current.includes(lastCheckedId)) {
                // scroll to checkedNode only if it was checked externally and
                // not when it was checked locally using the tree component
                setTimeout(() => {
                    // allow time for nodes to expand
                    treeRef.current.scrollTo({ 
                        key: lastCheckedId,
                        align: 'top'
                    })
                }, 60);
            }
        }
    }, [checkedNodes])

    return (
        <Space direction='vertical'>
            <Typography.Text strong>
                {title}
            </Typography.Text>

            <Search
                onSearch={(searchTerm) => setSearchTerm(searchTerm)}
                disabled={isEmpty(hierarchy)}
            />

            <Tree<TreeData>
                ref={treeRef}
                rootClassName="svg-hierarchy"
                treeData={treeData || []}
                selectedKeys={[]}
                expandedKeys={expandedKeys}
                checkedKeys={checkedNodes}
                height={(document.getElementById('editor-map-panel')?.clientHeight ?? 200) - 80}
                showLine
                multiple
                virtual
                blockNode
                checkable
                showIcon
                switcherIcon={<DownOutlined />}
                titleRender={(node) => (
                    <NodeHierarchyTitle
                        key={node.key}
                        title={node.label}
                        description={node.key as string}
                        searchTerm={searchTerm}
                    />
                )}
                onExpand={(expandedKeys) => {
                    setExpandedKeys(expandedKeys)
                }}
                onSelect={(_keys, info) => {
                    if (!expandedKeys.includes(info.node.key)) {
                        setExpandedKeys(keys => [...keys, info.node.key])
                    } else {
                        setExpandedKeys(keys => keys.filter(key => key != info.node.key))
                    }
                }}
                onCheck={(keys) => {
                    setSelectedNodes(keys as string[])
                    locallyCheckedKeysRef.current = keys as string[]
                }}
                onMouseEnter={(info) => {
                    setPreviewNode(info.node.key as string)
                }}
                onMouseLeave={() => {
                    setPreviewNode(undefined)
                }}
            />
        </Space>
    )
}