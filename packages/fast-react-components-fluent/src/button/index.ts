import * as React from "react";
import { Button, IButtonProps, IButtonManagedClasses } from "@microsoft/fast-react-components-base";
import manageJss, { ComponentStyles } from "@microsoft/fast-react-jss-manager";

const styles: ComponentStyles<IButtonManagedClasses> = {
    host: {
        color: "red"
    },
};

export default manageJss(styles)(Button);
