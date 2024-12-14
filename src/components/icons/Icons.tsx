import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import Icon from "@ant-design/icons";
//@ts-expect-error - vite svgr paths
import SVGIcon from './svg-icon.svg?react';
//@ts-expect-error - vite svgr paths
import GroupIcon from './group-icon.svg?react';
//@ts-expect-error - vite svgr paths
import PathIcon from './path-icon.svg?react';
//@ts-expect-error - vite svgr paths
import PolylineIcon from './polyline-icon.svg?react';
//@ts-expect-error - vite svgr paths
import PolygonIcon from './polygon-icon.svg?react';
//@ts-expect-error - vite svgr paths
import BezierCurveIcon from './beziercurve-icon.svg?react';
//@ts-expect-error - vite svgr paths
import LineIcon from './line-icon.svg?react';
//@ts-expect-error - vite svgr paths
import RectIcon from './rectangle-icon.svg?react';
//@ts-expect-error - vite svgr paths
import CircleDashedIcon from './circle-icon.svg?react';


type IconGeneratorProps = Partial<CustomIconComponentProps> & {
    size?: number
}

type IconType = React.ComponentType<CustomIconComponentProps | React.SVGProps<SVGSVGElement>> | React.ForwardRefExoticComponent<CustomIconComponentProps>

const iconGenerator = (
    component: IconType,
    props: IconGeneratorProps
) => {
    const { style = {}, ...rest } = props

    return <Icon component={component} {...rest} style={{ fontSize: props.size, ...style }} />
}

const createIcon = (icon: IconType) => (props: IconGeneratorProps) => iconGenerator(icon, props)

export const SVGOutlined = createIcon(SVGIcon)
export const GroupOutlined = createIcon(GroupIcon)
export const PathOutlined = createIcon(PathIcon)
export const PolylineOutlined = createIcon(PolylineIcon)
export const PolygonOutlined = createIcon(PolygonIcon)
export const BezierCurveOutlined = createIcon(BezierCurveIcon)
export const LineOutlined = createIcon(LineIcon)
export const RectangleOutlined = createIcon(RectIcon)
export const CircleDashedOutlined = createIcon(CircleDashedIcon)