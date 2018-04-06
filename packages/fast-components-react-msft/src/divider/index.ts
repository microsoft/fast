import * as React from "react";
import {
    Divider,
    IDividerClassNameContract,
    IDividerHandledProps,
    IDividerUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import { DividerStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(DividerStyles)(Divider);
