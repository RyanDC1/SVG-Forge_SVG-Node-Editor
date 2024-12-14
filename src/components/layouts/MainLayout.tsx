import React from "react"
import { Flex, Layout, Switch, Typography } from 'antd'
import { MoonFilled, SunFilled } from "@ant-design/icons"
import { ThemePref } from "@/types"

const { Header, Content } = Layout

interface Props {
    children: React.ReactNode,
    themePref: ThemePref,
    onThemePrefChange: (theme: ThemePref) => void
}

export default function MainLayout(props: Props) {

    const { children, themePref, onThemePrefChange } = props

    return (
        <Layout className={themePref === ThemePref.DARK ? 'dark-theme' : 'light-theme'}>
            <Header className="main-header">
                <Flex gap={14} align='center'>
                    <img className="main-logo" src="/images/svgforge_logo.png" />
                    <Typography.Title className="main-header-title">
                        SVGForge
                    </Typography.Title>
                </Flex>
                <Switch
                    checked={themePref == ThemePref.DARK}
                    onChange={(isChecked) => onThemePrefChange(isChecked ? ThemePref.DARK : ThemePref.LIGHT)}
                    checkedChildren={<MoonFilled />}
                    unCheckedChildren={<SunFilled />}
                />
            </Header>
            <Content className="main-layout-content">
                {children}
            </Content>
        </Layout>
    )
}