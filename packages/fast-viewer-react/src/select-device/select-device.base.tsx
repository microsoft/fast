import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { SelectDeviceProps } from "./select-device.props";
import { Device } from "./devices";

class SelectDevice extends Foundation<SelectDeviceProps, {}, {}> {
    public static displayName: string = "SelectDevice";

    protected handledProps: HandledProps<SelectDeviceProps> = {
        devices: void 0,
        activeDeviceId: void 0,
        onUpdateDevice: void 0,
    };

    public render(): JSX.Element {
        if (this.props.devices) {
            return (
                <div className={this.props.managedClasses.selectDevice}>
                    {this.renderLabel()}
                    <span
                        className={this.props.managedClasses.selectDevice_contentRegion}
                    >
                        <select
                            className={
                                this.props.managedClasses
                                    .selectDevice_contentRegion_select
                            }
                            onChange={this.handleOnChange}
                            value={this.props.activeDeviceId}
                            disabled={this.props.disabled}
                        >
                            {this.renderOptions()}
                        </select>
                    </span>
                </div>
            );
        }

        return null;
    }

    private renderLabel(): React.ReactNode {
        if (this.props.label) {
            return (
                <label className={this.props.managedClasses.selectDevice_label}>
                    {this.props.label}
                </label>
            );
        }
    }

    private renderOptions(): React.ReactNode {
        return this.props.devices.map(
            (device: Device, index: number): React.ReactNode => {
                return (
                    <option value={device.id} key={device.id + index}>
                        {device.displayName}
                    </option>
                );
            }
        );
    }

    private handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.onUpdateDevice(e.target.value || "");
    };
}

export default SelectDevice;
