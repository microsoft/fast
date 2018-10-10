import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { Device } from "./devices";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";

export interface SelectDeviceManagedClasses
    extends ManagedClasses<SelectDeviceClassNameContract> {}
export interface SelectDeviceUnhandledProps
    extends React.AllHTMLAttributes<HTMLElement> {}
export interface SelectDeviceHandledProps extends SelectDeviceManagedClasses {
    /**
     * The label for the select
     */
    label?: string;

    /**
     * The list of devices to use as options
     */
    devices: Device[];

    /**
     * The active index of the devices array
     */
    activeIndex: number;

    /**
     * The update device event handler
     */
    onUpdateDevice: (index: number) => void;
}

export type SelectDeviceProps = SelectDeviceUnhandledProps & SelectDeviceHandledProps;
