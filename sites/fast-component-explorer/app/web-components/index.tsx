/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import {
    FASTButton,
    FASTDesignSystemProvider,
    FASTOption,
    FASTSelect,
    FASTTab,
    FASTTabPanel,
    FASTTabs,
} from "@microsoft/fast-components";
import { downChevron, upChevron } from "@microsoft/site-utilities";
import { neutralLayerL1, neutralLayerL3 } from "@microsoft/fast-components-styles-msft";
import h from "@microsoft/site-utilities/dist/web-components/pragma";
import { ListboxOption } from "@microsoft/fast-foundation";
import { Scenario } from "../fast-components/configs/data.props";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
FASTButton;
FASTDesignSystemProvider;
FASTOption;
FASTSelect;
FASTTab;
FASTTabPanel;
FASTTabs;

interface RenderDevToolsTabsConfig {
    codeRenderCallback: (e: HTMLElement) => void;
    tabUpdateCallback: (e: React.ChangeEvent<HTMLElement>) => void;
    guidanceTabPanelContent: React.ComponentClass<{}, any>;
    definitionTabPanelContent: string;
    schemaTabPanelContent: string;
}

function renderScenarioFastOptions(scenarioOptions: Array<Scenario>): React.ReactNode {
    return scenarioOptions.map((scenarioOption: Scenario, index: number) => {
        return (
            <fast-option key={index} value={index}>
                {scenarioOption.displayName}
            </fast-option>
        );
    });
}

export function renderDevToolToggle(
    selected: boolean,
    onToggleCallback: () => void
): React.ReactNode {
    return (
        <fast-button
            events={{
                click: (e: React.ChangeEvent): void => {
                    onToggleCallback();
                },
            }}
            class={"dev-tools-trigger"}
        >
            {selected ? downChevron() : upChevron()}
        </fast-button>
    );
}

export function renderScenarioFastSelect(
    selectedScenarioIndex: number,
    scenarioOptions: Array<Scenario>,
    onChangeCallback: (
        newValue: string | string[],
        selectedItems: ListboxOption[]
    ) => void
) {
    return (
        <fast-select
            selectedIndex={selectedScenarioIndex}
            events={{
                change: (e: React.ChangeEvent): void => {
                    onChangeCallback(
                        (e.target as FASTSelect).value,
                        (e.target as FASTSelect).selectedOptions
                    );
                },
            }}
        >
            {renderScenarioFastOptions(scenarioOptions)}
        </fast-select>
    );
}

export function renderDevToolsTabs(config: RenderDevToolsTabsConfig): React.ReactNode {
    const styleOverrides: string = `
        a {
            color: var(--accent-foreground-rest);
        }

        .tab-panel_region {
            height: calc(50vh - 94px);
            overflow: auto;
            width: 100%;
        }

        pre {
            margin: 0;
            padding: 0;
        }

        fast-tabs {
            height: 100%;
        }

        fast-tab-panel {
            padding: 0;
            height: calc(100% - 72px);
        }

        .tab-panel_region::-webkit-scrollbar {
            background: ${neutralLayerL1};
            width: 8px;
            height: 8px;
        }

        .tab-panel_region::-webkit-scrollbar-thumb {
            background: ${neutralLayerL3},
            border-radius: 8px;
        }
    `;
    return (
        <fast-design-system-provider use-defaults style={{ height: "100%" }}>
            <style>{styleOverrides}</style>
            <fast-tabs id="dev-tools-tabs" events={{ change: config.tabUpdateCallback }}>
                <fast-tab id="code" slot="tab">
                    Code
                </fast-tab>
                <fast-tab id="guidance" slot="tab">
                    Guidance
                </fast-tab>
                <fast-tab id="definition" slot="tab">
                    Definition
                </fast-tab>
                <fast-tab id="schema">Schema</fast-tab>
                <fast-tab-panel
                    slot="tabpanel"
                    ref={config.codeRenderCallback}
                ></fast-tab-panel>
                <fast-tab-panel slot="tabpanel">
                    <div className={"tab-panel_region"}>
                        <config.guidanceTabPanelContent />
                    </div>
                </fast-tab-panel>
                <fast-tab-panel slot="tabpanel">
                    <div className={"tab-panel_region"}>
                        <pre>{config.definitionTabPanelContent}</pre>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel>
                    <div className={"tab-panel_region"}>
                        <pre>{config.schemaTabPanelContent}</pre>
                    </div>
                </fast-tab-panel>
            </fast-tabs>
        </fast-design-system-provider>
    );
}
