import * as React from "react";
import {
    IButtonHandledProps as IBaseButtonHandledProps,
    IButtonUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import { IFlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { FlipperStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import Flipper, { IFlipperHandledProps } from "./flipper";

export default manageJss(FlipperStyles)(Flipper);
