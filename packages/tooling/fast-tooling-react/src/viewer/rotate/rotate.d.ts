import React from "react";
import {
    Orientation,
    RotateHandledProps as BaseRotateHandledProps,
    RotateManagedClasses,
    RotateProps as BaseRotateProps,
    RotateUnhandledProps,
} from "./rotate.props";
import { RotateClassNameContract } from "./rotate.class-name-contract";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
declare const Rotate: React.ComponentClass<
    ManagedJSSProps<unknown, RotateClassNameContract, {}>,
    any
>;
declare type Rotate = InstanceType<typeof Rotate>;
interface RotateHandledProps
    extends Omit<BaseRotateHandledProps, keyof RotateManagedClasses> {}
declare type RotateProps = ManagedJSSProps<BaseRotateProps, RotateClassNameContract, {}>;
export {
    Orientation,
    Rotate,
    RotateProps,
    RotateClassNameContract,
    RotateHandledProps,
    RotateUnhandledProps,
};
