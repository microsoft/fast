import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { applyInputStyle, background000 } from "../../style";

export interface CSSSpacingClassNameContract {
    cssSpacing?: string;
    cssSpacing_row?: string;
    cssSpacing_type?: string;
    cssSpacing_type_contentRegion?: string;
    cssSpacing_type__margin?: string;
    cssSpacing_type__padding?: string;
    cssSpacing_type__marginActive?: string;
    cssSpacing_type__paddingActive?: string;
    cssSpacing_type__marginHover?: string;
    cssSpacing_type__paddingHover?: string;
    cssSpacing_input?: string;
}

const typeThickness: number = 11;
const outlineStrokeThickness: number = 2;
const locationIndicatorHeight: number = typeThickness - 4;
const marginTypeColor: string = "1, 209, 199";
const paddingTypeColor: string = "118, 108, 255";
const leftRightPositionActiveMargin: number = typeThickness - 1;
const topBottomPositionActiveMargin: number = 2 * locationIndicatorHeight + 4;
const leftRightPositionActivePadding: number = 1;
const topBottomPositionActivePadding: number = typeThickness / 2 + 1;

const styles: ComponentStyles<CSSSpacingClassNameContract, {}> = {
    cssSpacing: {
        fontSize: "11px",
        paddingRight: "10px",
    },
    cssSpacing_row: {
        display: "flex",
        justifyContent: "center",
    },
    cssSpacing_type: {
        position: "relative",
        borderRadius: "2px",
        width: "135px",
        height: "48px",
        "&::before, &::after": {
            content: "''",
            position: "absolute",
            width: toPx(locationIndicatorHeight),
            height: "2px",
            background: "white",
            zIndex: 1,
        },
    },
    cssSpacing_type_contentRegion: {
        display: "inline-block",
        width: "100%",
        lineHeight: "26px",
    },
    cssSpacing_type__margin: {
        position: "relative",
        border: `${toPx(typeThickness)} solid rgba(${marginTypeColor}, 0.5)`,
        textAlign: "center",
        margin: "4px",
        "&::before, &::after": {
            top: "calc(50% - 1px)",
        },
        "&::before": {
            left: toPx(leftRightPositionActivePadding),
        },
        "&::after": {
            right: toPx(leftRightPositionActivePadding),
        },
        "&$cssSpacing_type__marginActive": {
            "&::before": {
                left: `-${toPx(leftRightPositionActiveMargin)}`,
            },
            "&::after": {
                right: `-${toPx(leftRightPositionActiveMargin)}`,
            },
        },
    },
    cssSpacing_type__padding: {
        position: "relative",
        boxShadow: `0 0 0 ${toPx(outlineStrokeThickness)} #FFFFFF`,
        border: `${toPx(typeThickness)} solid rgba(${paddingTypeColor}, 0.5)`,
        width: `calc(100% - ${toPx(2 * typeThickness)})`,
        height: `calc(100% - ${toPx(2 * typeThickness)})`,
        "&::before, &::after": {
            left: "calc(50% - 1px)",
            transform: "rotate(90deg)",
        },
        "&::before": {
            top: `-${toPx(topBottomPositionActiveMargin)}`,
        },
        "&::after": {
            bottom: `-${toPx(topBottomPositionActiveMargin)}`,
        },
        "&$cssSpacing_type__paddingActive": {
            "&::before": {
                top: `-${toPx(topBottomPositionActivePadding)}`,
            },
            "&::after": {
                bottom: `-${toPx(topBottomPositionActivePadding)}`,
            },
        },
    },
    cssSpacing_type__marginActive: {
        border: `${toPx(typeThickness)} solid rgb(${marginTypeColor})`,
        color: `rgb(${marginTypeColor})`,
    },
    cssSpacing_type__paddingActive: {
        border: `${toPx(typeThickness)} solid rgb(${paddingTypeColor})`,
        color: `rgb(${paddingTypeColor})`,
    },
    cssSpacing_type__marginHover: {
        borderColor: `rgba(${marginTypeColor}, 1)`,
    },
    cssSpacing_type__paddingHover: {
        borderColor: `rgba(${paddingTypeColor}, 1)`,
    },
    cssSpacing_input: {
        ...applyInputStyle(),
        alignSelf: "center",
        width: "45px",
    },
};

export default styles;
