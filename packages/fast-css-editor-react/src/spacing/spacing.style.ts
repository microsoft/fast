import { ComponentStyles } from "@microsoft/fast-jss-manager";

export interface CSSSpacingClassNameContract {
    cssSpacing?: string;
    cssSpacing_row?: string;
    cssSpacing_type?: string;
    cssSpacing_type_contentRegion?: string;
    cssSpacing_type__margin?: string;
    cssSpacing_type__padding?: string;
    cssSpacing_type__margin__active?: string;
    cssSpacing_type__padding__active?: string;
    cssSpacing_type__margin__hover?: string;
    cssSpacing_type__padding__hover?: string;
    cssSpacing_input?: string;
}

function styles(): ComponentStyles<CSSSpacingClassNameContract, {}> {
    const typeThickness: number = 11;
    const outlineStrokeThickness: number = 2;
    const locationIndicatorHight: number = typeThickness - 4;
    const marginTypeColor: string = "1, 209, 199";
    const paddingTypeColor: string = "118, 108, 255";
    const leftRightPositionActiveMargin: number = typeThickness - 1;
    const topBottomPositionActiveMargin: number = 2 * locationIndicatorHight + 4;
    const leftRightPositionActivePadding: number = 1;
    const topBottomPositionActivePadding: number = typeThickness / 2 + 1;

    return {
        cssSpacing: {},
        cssSpacing_row: {
            display: "flex",
            justifyContent: "center",
        },
        cssSpacing_type: {
            position: "relative",
            borderRadius: "2px",
            width: "155px",
            height: "48px",
            "&:before, &:after": {
                content: "''",
                position: "absolute",
                width: `${locationIndicatorHight}px`,
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
            border: `${typeThickness}px solid rgba(${marginTypeColor}, 0.5)`,
            textAlign: "center",
            margin: "4px",
            "&::before, &::after": {
                top: `calc(50% - ${1}px)`,
            },
            "&::before": {
                left: `${leftRightPositionActivePadding}px`,
            },
            "&::after": {
                right: `${leftRightPositionActivePadding}px`,
            },
            "&$cssSpacing_type__margin__active": {
                "&::before": {
                    left: `-${leftRightPositionActiveMargin}px`,
                },
                "&::after": {
                    right: `-${leftRightPositionActiveMargin}px`,
                },
            },
        },
        cssSpacing_type__padding: {
            position: "relative",
            boxShadow: `0 0 0 ${outlineStrokeThickness}px #FFFFFF`,
            border: `${typeThickness}px solid rgba(${paddingTypeColor}, 0.5)`,
            width: `calc(100% - ${2 * typeThickness}px)`,
            height: `calc(100% - ${2 * typeThickness}px)`,
            "&::before, &::after": {
                left: `calc(50% - ${1}px)`,
                transform: "rotate(90deg)",
            },
            "&::before": {
                top: `-${topBottomPositionActiveMargin}px`,
            },
            "&::after": {
                bottom: `-${topBottomPositionActiveMargin}px`,
            },
            "&$cssSpacing_type__padding__active": {
                "&::before": {
                    top: `-${topBottomPositionActivePadding}px`,
                },
                "&::after": {
                    bottom: `-${topBottomPositionActivePadding}px`,
                },
            },
        },
        cssSpacing_type__margin__active: {
            border: `${typeThickness}px solid rgb(${marginTypeColor})`,
            color: `rgb(${marginTypeColor})`,
        },
        cssSpacing_type__padding__active: {
            border: `${typeThickness}px solid rgb(${paddingTypeColor})`,
            color: `rgb(${paddingTypeColor})`,
        },
        cssSpacing_type__margin__hover: {
            borderColor: `rgba(${marginTypeColor}, 1)`,
        },
        cssSpacing_type__padding__hover: {
            borderColor: `rgba(${paddingTypeColor}, 1)`,
        },
        cssSpacing_input: {
            width: "46px",
            alignSelf: "center",
            border: "none",
            padding: "10px",
            outline: "none",
            fontSize: "14px",
            boxShadow: "inset 0px 0px 4px 0px rgba(0, 0, 0, 0.08)",
            lineHeight: "16px",
            borderRadius: "2px",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
    };
}

export default styles();
