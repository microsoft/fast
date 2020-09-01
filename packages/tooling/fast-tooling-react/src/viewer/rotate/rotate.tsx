import React from "react";
import { Rotate as BaseRotate } from "./rotate.base";
import {
    Orientation,
    RotateHandledProps as BaseRotateHandledProps,
    RotateManagedClasses,
    RotateProps as BaseRotateProps,
    RotateUnhandledProps,
} from "./rotate.props";
import { RotateClassNameContract } from "./rotate.class-name-contract";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import RotateStyles from "./rotate.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Rotate = manageJss(RotateStyles)(BaseRotate);
type Rotate = InstanceType<typeof Rotate>;

interface RotateHandledProps
    extends Omit<BaseRotateHandledProps, keyof RotateManagedClasses> {}
type RotateProps = ManagedJSSProps<BaseRotateProps, RotateClassNameContract, {}>;

export {
    Orientation,
    Rotate,
    RotateProps,
    RotateClassNameContract,
    RotateHandledProps,
    RotateUnhandledProps,
};
