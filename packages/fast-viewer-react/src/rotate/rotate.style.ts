import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { RotateClassNameContract } from "./rotate.class-name-contract";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<
    RotateClassNameContract,
    {}
> = (config: {}): ComponentStyleSheet<RotateClassNameContract, {}> => {
    return {
        rotate: {
            display: "inline-block",
        },
        rotate_input: {
            appearance: "none",
            margin: "0",
            "&:checked": {
                "& + span": {
                    backgroundColor: "#EEEEEE",
                },
            },
            "&:focus": {
                "& + span": {
                    boxShadow: "inset 0px 0px 0px 1px #FB356D",
                },
            },
        },
        rotate_stateIndicator: {
            display: "inline-block",
            cursor: "pointer",
            height: "36px",
            width: "40px",
            verticalAlign: "middle",
            textAlign: "center",
            lineHeight: "40px",
            borderRadius: "2px",
            boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.08)",
            backgroundColor: "#FFFFFF",
        },
        rotate_stateIndicator__landscape: {
            borderTopRightRadius: "0 0",
            borderBottomRightRadius: "0 0",
        },
        rotate_stateIndicator__portrait: {
            borderTopLeftRadius: "0 0",
            borderBottomLeftRadius: "0 0",
        },
    };
};

export default styles;
