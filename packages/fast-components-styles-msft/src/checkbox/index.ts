import {IDesignSystem} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {ICheckboxClassNameContract} from "@microsoft/fast-components-class-name-contracts";

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
        fontSize: "15",
        marginLeft: "5px"
    }
};

export default styles;
