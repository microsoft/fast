import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

const styles: ComponentStyles<IButtonClassNameContract, IDesignSystem> = {
    button: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        backgroundColor: "purple"
    }
};

export default styles;
