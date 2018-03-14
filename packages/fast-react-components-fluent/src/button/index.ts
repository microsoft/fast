import * as React from "react";
import { Button, IButtonProps, IButtonManagedClasses, IFoundationProps } from "@microsoft/fast-react-components-base";
import manageJss, { ComponentStyles } from "@microsoft/fast-react-jss-manager";
import {IFluentDesignSystem} from "../design-system";

const styles: ComponentStyles<IButtonManagedClasses, IFluentDesignSystem> = {
    button: {
        color: (config: IFluentDesignSystem): string => {
            return config.foregroundColor;
        },
        backgroundColor: (config: IFluentDesignSystem): string => {
            return config.brandColor;
        }
    },
};

export default manageJss(styles)(Button);
