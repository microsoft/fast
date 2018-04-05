import * as React from "react";
import {
    Checkbox,
    ICheckboxClassNameContract,
    ICheckboxHandledProps,
    ICheckboxUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import {CheckboxStyles} from "@microsoft/fast-components-styles-msft";

export default manageJss(CheckboxStyles)(Checkbox);
