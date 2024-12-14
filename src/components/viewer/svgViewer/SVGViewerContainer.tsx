import { SVGViewerLayout } from '@/components/layouts'
import SVGViewerHeader from '@/components/viewer/svgViewer/SVGViewerHeader'
import SVGViewer from '@/components/viewer/svgViewer/SVGViewer'

export default function SVGViewerContainer() {

    return (
        <SVGViewerLayout
            header={<SVGViewerHeader />}
            footer={null}
        >
            <SVGViewer />
        </SVGViewerLayout>
    )
}