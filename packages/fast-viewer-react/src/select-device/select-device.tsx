import React from "react";
import BaseSelectDevice from "./select-device.base";
import {
    SelectDeviceHandledProps as BaseSelectDeviceHandledProps,
    SelectDeviceManagedClasses,
    SelectDeviceProps as BaseSelectDeviceProps,
    SelectDeviceUnhandledProps,
} from "./select-device.props";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import SelectDeviceStyles from "./select-device.style";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const SelectDevice = manageJss(SelectDeviceStyles)(BaseSelectDevice);
type SelectDevice = InstanceType<typeof SelectDevice>;

interface SelectDeviceHandledProps
    extends Subtract<BaseSelectDeviceHandledProps, SelectDeviceManagedClasses> {}
type SelectDeviceProps = ManagedJSSProps<
    BaseSelectDeviceProps,
    SelectDeviceClassNameContract,
    {}
>;

export default SelectDevice;
export {
    SelectDeviceProps,
    SelectDeviceClassNameContract,
    SelectDeviceHandledProps,
    SelectDeviceUnhandledProps,
};
