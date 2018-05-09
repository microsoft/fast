import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ITextfieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import * as Chroma from "chroma-js";

const styles: ComponentStyles<ITextfieldClassNameContract, IDesignSystem> = {
    textField: {
        color: "#757575",
        outline: `${toPx(1)} solid transparent`,
        fontSize: toPx(14),
        lineHeight: toPx(16),
        border: `${toPx(1)} solid #757575`,
        boxSizing: "border-box",
        borderRadius: toPx(2),
        padding: toPx(10),
        margin: toPx(0),
        "&:focus": {
            outline: `${toPx(1)} solid #616161`,
            border: `${toPx(1)} solid #616161`
        },
        "&:disabled": {
            color: "#CCCCCC",
            cursor: "not-allowed",
            background: (config: IDesignSystem): string => {
                return Chroma(config.backgroundColor).css();
            },
            borderColor: "#DCDCDC"
        }
    }
};

export default styles;
