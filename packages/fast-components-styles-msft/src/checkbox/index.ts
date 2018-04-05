import {IDesignSystem} from "../design-system";
import {ComponentStyles} from "@microsoft/fast-jss-manager";
import {ICheckboxClassNameContract} from "@microsoft/fast-components-class-name-contracts";

const styles: ComponentStyles<ICheckboxClassNameContract, IDesignSystem> = {
    checkbox: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        }
    }
};

export default styles;
