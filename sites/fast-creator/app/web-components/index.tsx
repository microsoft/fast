/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import { FASTButton, FASTSelect } from "@microsoft/fast-components";
import { downChevron, upChevron } from "@microsoft/site-utilities";
import h from "@microsoft/site-utilities/dist/web-components/pragma";
import { defaultDevices, Device } from "./devices";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
FASTButton;

export function renderDevToolToggle(selected: boolean, onToggleCallback: () => void) {
    return (
        <fast-button
            events={{
                click: (e: React.ChangeEvent) => {
                    onToggleCallback();
                },
            }}
            class={"dev-tools-trigger"}
        >
            {selected ? downChevron() : upChevron()}
        </fast-button>
    );
}

function renderDeviceOptions(): React.ReactNode {
    return defaultDevices.map((deviceOption: Device) => {
        return (
            <fast-option
                key={deviceOption.id}
                value={deviceOption.id}
                style={{ height: "auto" }}
            >
                {deviceOption.displayName}
            </fast-option>
        );
    });
}

export function renderDeviceSelect(
    selectedDeviceId: string,
    onChangeCallback: (deviceId: string) => void,
    disable: boolean
): React.ReactNode {
    return (
        <fast-select
            selectedIndex={selectedDeviceId}
            events={{
                change: (e: React.ChangeEvent): void => {
                    onChangeCallback((e.target as FASTSelect).value);
                },
            }}
            disabled={disable ? true : null}
        >
            {renderDeviceOptions()}
        </fast-select>
    );
}
