import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ICheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";

const styles: ComponentStyles<ICheckboxClassNameContract, IDesignSystem> = {
    checkbox: {
        display: "flex",
        flexDirection: "row"
    },
    checkbox_input: {
        cursor: "pointer",
        width: "20px",
        height: "20px"
    },
    checkbox_label: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        ...applyTypeRampConfig("t7"),
        marginLeft: "5px",
        marginTop: "2px"
    },
    checkbox_disabled: {
        "& $checkbox_input, & $checkbox_label": {
            cursor: "default",
            opacity: ".6"
        }
    }
};

export default styles;
