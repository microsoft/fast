import * as React from "react";
import {
    IButtonHandledProps as IBaseButtonHandledProps,
    IButtonUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import { IFlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { FlipperStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTFlipper, { IFlipperHandledProps } from "./flipper";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Flipper = manageJss(FlipperStyles)(MSFTFlipper);
type Flipper = InstanceType<typeof Flipper>;

export { Flipper };
