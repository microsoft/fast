import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { toPx } from "@microsoft/fast-jss-utilities";

export interface CSSPositionClassNameContract {
    cssPosition?: string;
    cssPosition_selectContainer?: string;
    cssPosition_selectContainer_select?: string;
    cssPosition_input?: string;
    absoluteInput_row?: string;
    absoluteInput_row_center?: string;
    absoluteInput_row_center__activeTop?: string;
    absoluteInput_row_center__activeBottom?: string;
    absoluteInput_row_center__activeLeft?: string;
    absoluteInput_row_center__activeRight?: string;
}

const styles: ComponentStyles<CSSPositionClassNameContract, {}> = {
    cssPosition: {},
    cssPosition_selectContainer: {
        display: "flex",
        position: "relative",
        "&::before, &::after": {
            top: toPx(12),
            width: toPx(1),
            height: toPx(10),
            content: "''",
            zIndex: "1",
            position: "absolute",
            background: "#000",
            borderRadius: toPx(2),
        },
        "&::before": {
            right: toPx(15),
            transform: "rotate(45deg)",
        },
        "&::after": {
            right: toPx(22),
            transform: "rotate(-45deg)",
        },
    },
    cssPosition_selectContainer_select: {
        marginBottom: toPx(5),
        height: toPx(36),
        width: "100%",
        border: "none",
        padding: `${toPx(10)} ${toPx(36)} ${toPx(10)} ${toPx(10)}`,
        outline: "none",
        fontSize: toPx(14),
        boxShadow: `inset 0 0 ${toPx(4)} 0 rgba(0, 0, 0, 0.08)`,
        lineHeight: toPx(16),
        borderRadius: toPx(2),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        appearance: "none",
    },
    cssPosition_input: {
        width: toPx(46),
        height: toPx(16),
        border: "none",
        padding: `${toPx(10)} ${toPx(8)} ${toPx(10)}`,
        outline: "none",
        fontSize: toPx(14),
        boxShadow: `inset 0 0 ${toPx(9)} 0 rgba(0, 0, 0, 0.08)`,
        lineHeight: toPx(16),
        borderRadius: toPx(2),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    absoluteInput_row: {
        display: "flex",
        justifyContent: "center",
    },
    absoluteInput_row_center: {
        width: toPx(50),
        height: toPx(25),
        border: `${toPx(5)} solid transparent`,
    },
    absoluteInput_row_center__activeTop: {
        borderTopColor: "#FB356D",
    },
    absoluteInput_row_center__activeBottom: {
        borderBottomColor: "#FB356D",
    },
    absoluteInput_row_center__activeLeft: {
        borderLeftColor: "#FB356D",
    },
    absoluteInput_row_center__activeRight: {
        borderRightColor: "#FB356D",
    },
};

export default styles;
