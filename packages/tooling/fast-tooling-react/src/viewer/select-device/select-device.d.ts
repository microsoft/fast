import React from "react";
import {
    SelectDeviceHandledProps as BaseSelectDeviceHandledProps,
    SelectDeviceManagedClasses,
    SelectDeviceProps as BaseSelectDeviceProps,
    SelectDeviceUnhandledProps,
} from "./select-device.props";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
declare const SelectDevice: React.ComponentClass<
    ManagedJSSProps<unknown, SelectDeviceClassNameContract, {}>,
    any
>;
declare type SelectDevice = InstanceType<typeof SelectDevice>;
interface SelectDeviceHandledProps
    extends Omit<BaseSelectDeviceHandledProps, keyof SelectDeviceManagedClasses> {}
declare type SelectDeviceProps = ManagedJSSProps<
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
