import * as React from "react";
import {
    IFoundationProps,
    ITypographyClassNameContract,
    ITypographyHandledProps,
    ITypographyUnhandledProps,
    Typography
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import { TypographyStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(TypographyStyles)(Typography);
