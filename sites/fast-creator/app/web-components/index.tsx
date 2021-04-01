/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import {
    FASTButton,
    FASTSelect,
    FASTTab,
    FASTTabPanel,
    FASTTabs,
} from "@microsoft/fast-components";
import { componentCategories, downChevron, upChevron } from "@microsoft/site-utilities";
import { MessageSystem } from "@microsoft/fast-tooling";
import { ModularForm, StandardControlPlugin } from "@microsoft/fast-tooling-react";

import h from "@microsoft/site-utilities/dist/web-components/pragma";
import { FormId } from "../creator.props";
import { defaultDevices, Device } from "./devices";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
FASTButton;
FASTTab;
FASTTabs;
FASTTabPanel;

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

export function renderFormTabs(
    activeId: any,
    fastMessageSystem: MessageSystem,
    fastDesignMessageSystem: MessageSystem,
    linkedDataControl: StandardControlPlugin,
    handleFormVisibility: (formId: any) => void
): React.ReactNode {
    const formStyleOverride: string = `
        fast-tab-panel > div { width: 100%; }
    `;

    return (
        <fast-tabs
            activeId={activeId}
            events={{
                change: (e: React.ChangeEvent<HTMLElement>) => {
                    if ((e as any).detail) {
                        handleFormVisibility((e as any).detail.id);
                    }
                },
            }}
        >
            <fast-tab id={FormId.component}>Components</fast-tab>
            <fast-tab id={FormId.designSystem}>Design System</fast-tab>
            <fast-tab-panel id={FormId.component + "Panel"}>
                <style>{formStyleOverride}</style>
                <ModularForm
                    key={FormId.component}
                    messageSystem={fastMessageSystem}
                    controls={[linkedDataControl]}
                    categories={componentCategories}
                />
            </fast-tab-panel>
            <fast-tab-panel id={FormId.designSystem + "Panel"}>
                <style>{formStyleOverride}</style>
                <ModularForm
                    key={FormId.designSystem}
                    messageSystem={fastDesignMessageSystem}
                    categories={componentCategories}
                />
            </fast-tab-panel>
        </fast-tabs>
    );
}
