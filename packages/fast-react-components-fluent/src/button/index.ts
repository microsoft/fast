import * as React from "react";
import { Button, IButtonManagedClasses } from "@microsoft/fast-react-components-base";
import manageJss, { Foo } from "@microsoft/fast-react-jss-manager";

const styles: Foo<IButtonManagedClasses> = {
    host: {
        color: "red"
    },
    color: {

    }
};

export default manageJss(styles)(Button);
