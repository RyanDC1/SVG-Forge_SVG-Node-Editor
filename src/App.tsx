import { ConfigProvider, theme } from 'antd'
import { useEffect, useState } from 'react'
import { ThemePref } from '@/types'
import { MainLayout } from '@/components/layouts'
import { localStoreKeys } from '@/utils/constants'
import { useBrowserStore } from '@/utils/hooks'
import { Editor } from '@/components/editor'

function App() {

  const { getFromStore, addToStore } = useBrowserStore()

  const [themePref, setThemePref] = useState<ThemePref>(() => {
    return getFromStore(localStoreKeys.THEME) || ThemePref.DARK
  })

  useEffect(() => {
    document.documentElement.dataset.theme = themePref;
  }, [themePref])

  return (
    <ConfigProvider
      theme={{
        algorithm: themePref === ThemePref.DARK ?
          theme.darkAlgorithm
          :
          theme.defaultAlgorithm,
        token: {
          colorPrimary: "#f57c19"
        },
        components: {
          Tree: {
            indentSize: 12
          }
        }
      }}
    >
      <MainLayout
        themePref={themePref}
        onThemePrefChange={onThemeChange}
      >
        <Editor />
      </MainLayout>
    </ConfigProvider>
  )

  function onThemeChange(theme: ThemePref) {
    setThemePref(theme)
    addToStore(localStoreKeys.THEME, theme)
  }
}

export default App
