import * as React from "react";
import { Button, IButtonProps, IButtonManagedClasses } from "@microsoft/fast-react-components-base";
import manageJss, { ComponentStyles } from "@microsoft/fast-react-jss-manager";

export interface IConfig {
    foreground: string;
    background: string;
}

const styles: ComponentStyles<IButtonManagedClasses, boolean> = {
    host: {
        color: "red",
        backgroundColor: (config: boolean): string => {
            // return "red";
            return config.toString();
        }
    },
};

export default manageJss(styles)(Button);
