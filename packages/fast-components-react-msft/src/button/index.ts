import * as React from "react";
import { Button, IButtonProps, IButtonClassNameContract, IFoundationProps } from "@microsoft/fast-components-react-base";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {IDesignSystem} from "../design-system";

const styles: ComponentStyles<IButtonClassNameContract, IDesignSystem> = {
    button: {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        backgroundColor: (config: IDesignSystem): string => {
            return config.brandColor;
        }
    },
};

export default manageJss(styles)(Button);
