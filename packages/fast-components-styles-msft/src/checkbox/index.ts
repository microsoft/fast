import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ICheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { toPx } from "@microsoft/fast-jss-utilities";
import * as Chroma from "chroma-js";

const styles: ComponentStyles<ICheckboxClassNameContract, IDesignSystem> = {
    checkbox: {
        display: "flex",
        flexDirection: "row"
    },
    checkbox_input: {
        cursor: "pointer",
        width: toPx(20),
        height: toPx(20),
        appearance: "none",
        border: `${toPx(1)} solid`,
        borderColor: (config: IDesignSystem): string => {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, 0.46).css();
        },
        "&:after": {
            content: "''",
            display: "block",
            transform: "scale(0)",
            transition: "transform .2s",
            position: "absolute"
        },
        "&:checked": {
            "&:after": {
                width: "3px",
                height: "9px",
                backgroundColor: "black",
                left: "11px",
                top: "6px",
                transform: "scale(1)"
            }
        },
        "&:focus": {
            outline: "none"
        }
    },
    checkbox_label: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        ...applyTypeRampConfig("t7"),
        marginLeft: toPx(5),
        marginTop: toPx(2)
    },
    checkbox_disabled: {
        "& $checkbox_input, & $checkbox_label": {
            cursor: "default",
            opacity: ".6"
        }
    }
};

export default styles;
