import * as React from "react";
import { 
    Hypertext, 
    IFoundationProps, 
    IHypertextClassNameContract, 
    IHypertextHandledProps, 
    IHypertextUnhandledProps, 
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import {HypertextStyles} from "@microsoft/fast-components-styles-msft";

export default manageJss(HypertextStyles)(Hypertext);
