import BaseRotate from "./rotate.base";
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
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Rotate = manageJss(RotateStyles)(BaseRotate);
type Rotate = typeof Rotate;

interface RotateHandledProps
    extends Subtract<BaseRotateHandledProps, RotateManagedClasses> {}
type RotateProps = ManagedJSSProps<BaseRotateProps, RotateClassNameContract, {}>;

export default Rotate;
export {
    Orientation,
    RotateProps,
    RotateClassNameContract,
    RotateHandledProps,
    RotateUnhandledProps,
};
