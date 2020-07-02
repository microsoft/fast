import React from "react";
import { SelectDevice as BaseSelectDevice } from "./select-device.base";
import {
    SelectDeviceHandledProps as BaseSelectDeviceHandledProps,
    SelectDeviceManagedClasses,
    SelectDeviceProps as BaseSelectDeviceProps,
    SelectDeviceUnhandledProps,
} from "./select-device.props";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import SelectDeviceStyles from "./select-device.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const SelectDevice = manageJss(SelectDeviceStyles)(BaseSelectDevice);
type SelectDevice = InstanceType<typeof SelectDevice>;

interface SelectDeviceHandledProps
    extends Omit<BaseSelectDeviceHandledProps, keyof SelectDeviceManagedClasses> {}
type SelectDeviceProps = ManagedJSSProps<
    BaseSelectDeviceProps,
    SelectDeviceClassNameContract,
    {}
>;

export {
    SelectDevice,
    SelectDeviceProps,
    SelectDeviceClassNameContract,
    SelectDeviceHandledProps,
    SelectDeviceUnhandledProps,
};
