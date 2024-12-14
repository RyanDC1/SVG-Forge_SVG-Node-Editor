import React, { useMemo } from "react"
import { Space, Typography } from "antd"
import { escapeRegExp, isEmpty, isEqual } from "lodash"

interface Props {
    title: string,
    description?: string,
    searchTerm?: string
}

const getHighlightedNodes = (text: string, highlightedText?: string): React.ReactNode => {
    if (isEmpty(highlightedText)) {
        return (
            <>
                {text}
            </>
        )
    }

    const searchRegEx = RegExp(`${escapeRegExp(highlightedText)}`, 'gi')
    const matches = [...text.matchAll(searchRegEx)]

    let lastIndex = 0

    // Replace matched strings with highlighted nodes
    const node: React.ReactNode[] = matches.map(match => {
        const substring = text.slice(lastIndex, match.index)
        lastIndex = match.index + match[0].length

        return (
            <span key={match.index}>
                {substring}
                <span className='highlighted-text'>
                    {match[0]}
                </span>
            </span>
        )
    })

    // Append existing substring if any
    node.push(text.substring(lastIndex));

    return node
}

const NodeHierarchyTitle = (props: Props) => {

    const { title, description = '', searchTerm } = props

    const { titleRender, descriptionRender } = useMemo(() => {

        const titleRender: React.ReactNode = getHighlightedNodes(title, searchTerm?.trim())
        const descriptionRender: React.ReactNode = getHighlightedNodes(description, searchTerm?.trim())

        return {
            titleRender,
            descriptionRender
        }

    }, [title, description, searchTerm])

    return (
        <Space direction='vertical' className='node-hierarchy-title' title={description}>
            <Typography.Text className='title'>
                {titleRender}
            </Typography.Text>
            <Typography.Text type='secondary' className='description'>
                {descriptionRender}
            </Typography.Text>
        </Space>
    )
}

const arePropsEqual = (prevProps: Props, nextProps: Props) => {
    return isEqual(prevProps.title, nextProps.title)
        && isEqual(prevProps.description, nextProps.description)
        && isEqual(prevProps.searchTerm, nextProps.searchTerm)
}

export default React.memo(NodeHierarchyTitle, arePropsEqual)