import * as React from "react";
import { Button, IButtonProps, IButtonManagedClasses } from "@microsoft/fast-react-components-base";
import manageJss, { Foo } from "@microsoft/fast-react-jss-manager";

const styles: Foo<IButtonManagedClasses> = {
    host: {
        color: "red"
    },
};

export default manageJss(styles)(Button);
