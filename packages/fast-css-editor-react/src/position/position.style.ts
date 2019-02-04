import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { background800, foreground800 } from "../editor.constants.style";
import {
    applyInputStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
} from "../editor.utilities.style";

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
    },
    cssPosition_control: {
        ...applySelectSpanStyles(),
    },
    cssPosition_select: {
        ...applySelectInputStyles(),
    },
    cssPosition_input: {
        ...applyInputStyle(),
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
            background: background800,
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
                background: foreground800,
            },
        },
    },
    absoluteInput_centerRow__activeBottom: {
        "& $absoluteInput_centerRowContent": {
            "&::after": {
                background: foreground800,
            },
        },
    },
    absoluteInput_centerRow__activeLeft: {
        "&::before": {
            background: foreground800,
        },
    },
    absoluteInput_centerRow__activeRight: {
        "&::after": {
            background: foreground800,
        },
    },
    absoluteInput_centerRowContent: {
        "&::before, &::after": {
            content: "''",
            position: "absolute",
            left: "calc(50% - 1px)",
            width: "2px",
            height: "5px",
            background: background800,
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
