import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { Rotate as BaseRotate } from "./rotate.base";
import {
    RotateHandledProps as BaseRotateHandledProps,
    RotateProps as BaseRotateProps,
    Orientation,
    RotateManagedClasses,
    RotateUnhandledProps,
} from "./rotate.props";
import { RotateClassNameContract } from "./rotate.class-name-contract";
import RotateStyles from "./rotate.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Rotate = manageJss(RotateStyles)(BaseRotate);
type Rotate = InstanceType<typeof Rotate>;

interface RotateHandledProps
    extends Omit<BaseRotateHandledProps, keyof RotateManagedClasses> {}
type RotateProps = ManagedJSSProps<BaseRotateProps, RotateClassNameContract, unknown>;

export {
    Orientation,
    Rotate,
    RotateProps,
    RotateClassNameContract,
    RotateHandledProps,
    RotateUnhandledProps,
};
