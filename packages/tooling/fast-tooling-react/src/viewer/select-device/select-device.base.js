import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
export class SelectDevice extends Foundation {
    constructor() {
        super(...arguments);
        this.handledProps = {
            devices: void 0,
            activeDeviceId: void 0,
            onUpdateDevice: void 0,
        };
        this.handleOnChange = e => {
            this.props.onUpdateDevice(e.target.value || "");
        };
    }
    render() {
        if (this.props.devices) {
            return (
                <div className={this.props.managedClasses.selectDevice}>
                    {this.renderLabel()}
                    <span
                        className={this.props.managedClasses.selectDevice_contentRegion}
                    >
                        <select
                            className={this.props.managedClasses.selectDevice_select}
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
    renderLabel() {
        if (this.props.label) {
            return (
                <label className={this.props.managedClasses.selectDevice_label}>
                    {this.props.label}
                </label>
            );
        }
    }
    renderOptions() {
        return this.props.devices.map((device, index) => {
            return (
                <option value={device.id} key={device.id + index}>
                    {device.displayName}
                </option>
            );
        });
    }
}
SelectDevice.displayName = "SelectDevice";
