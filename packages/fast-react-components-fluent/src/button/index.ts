import * as React from "react";
import { Button, IButtonProps, IButtonManagedClasses } from "@microsoft/fast-react-components-base";
import manageJss, { ComponentStyles } from "@microsoft/fast-react-jss-manager";
import {IFluentDesignSystem} from "../design-system";

const styles: ComponentStyles<IButtonManagedClasses, IFluentDesignSystem> = {
    host: {
        color: (config: IFluentDesignSystem): string => {
            return config.foregroundColor;
        },
        backgroundColor: (config: IFluentDesignSystem): string => {
            return config.brandColor;
        }
    },
};

export default manageJss(styles)(Button);
