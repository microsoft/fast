import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { SelectDevice as BaseSelectDevice } from "./select-device.base";
import {
    SelectDeviceHandledProps as BaseSelectDeviceHandledProps,
    SelectDeviceProps as BaseSelectDeviceProps,
    SelectDeviceManagedClasses,
    SelectDeviceUnhandledProps,
} from "./select-device.props";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";
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
    unknown
>;

export {
    SelectDevice,
    SelectDeviceProps,
    SelectDeviceClassNameContract,
    SelectDeviceHandledProps,
    SelectDeviceUnhandledProps,
};
