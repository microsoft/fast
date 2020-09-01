import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlWrapperStyle,
    inputStyle,
    L1CSSProperty,
    selectInputStyle,
    selectSpanStyle,
    textColorCSSProperty,
} from "../../style";

export interface CSSPositionClassNameContract {
    cssPosition?: string;
    cssPosition_control?: string;
    cssPosition_select?: string;
    cssPosition_input?: string;
    absoluteInput_row?: string;
    absoluteInput?: string;
    absoluteInput_centerRow?: string;
    absoluteInput_centerRow__activeTop?: string;
    absoluteInput_centerRow__activeBottom?: string;
    absoluteInput_centerRow__activeLeft?: string;
    absoluteInput_centerRow__activeRight?: string;
    absoluteInput_centerRowContent?: string;
}

const styles: ComponentStyles<CSSPositionClassNameContract, {}> = {
    cssPosition: {
        fontSize: "11px",
        ...controlWrapperStyle,
    },
    cssPosition_control: {
        ...selectSpanStyle,
    },
    cssPosition_select: {
        ...selectInputStyle,
    },
    cssPosition_input: {
        ...inputStyle,
        alignSelf: "center",
        width: "45px",
    },
    absoluteInput: {
        marginTop: "10px",
    },
    absoluteInput_row: {
        display: "flex",
        justifyContent: "center",
    },
    absoluteInput_centerRow: {
        position: "relative",
        padding: "10px",
        "&::before, &::after": {
            content: "''",
            position: "absolute",
            top: "calc(50% - 1px)",
            width: "5px",
            height: "2px",
            background: L1CSSProperty,
            zIndex: 1,
        },
        "&::before": {
            left: "2px",
        },
        "&::after": {
            right: "2px",
        },
    },
    absoluteInput_centerRow__activeTop: {
        "& $absoluteInput_centerRowContent": {
            "&::before": {
                background: textColorCSSProperty,
            },
        },
    },
    absoluteInput_centerRow__activeBottom: {
        "& $absoluteInput_centerRowContent": {
            "&::after": {
                background: textColorCSSProperty,
            },
        },
    },
    absoluteInput_centerRow__activeLeft: {
        "&::before": {
            background: textColorCSSProperty,
        },
    },
    absoluteInput_centerRow__activeRight: {
        "&::after": {
            background: textColorCSSProperty,
        },
    },
    absoluteInput_centerRowContent: {
        "&::before, &::after": {
            content: "''",
            position: "absolute",
            left: "calc(50% - 1px)",
            width: "2px",
            height: "5px",
            background: L1CSSProperty,
            zIndex: 1,
        },
        "&::before": {
            top: "2px",
        },
        "&::after": {
            bottom: "2px",
        },
    },
};

export default styles;
