import * as React from "react";
import {
    Card,
    ICardClassNameContract,
    ICardHandledProps,
    ICardUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CardStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

export default manageJss(CardStyles)(Card);
