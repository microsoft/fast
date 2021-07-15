import React from "react";
import { ListboxOption } from "@microsoft/fast-foundation";
import { Scenario } from "../fast-components/configs/data.props";
interface RenderDevToolsTabsConfig {
    codeRenderCallback: (e: HTMLElement) => void;
    tabUpdateCallback: (e: React.ChangeEvent<HTMLElement>) => void;
    guidanceTabPanelContent: React.ComponentClass<{}, any>;
    definitionTabPanelContent: string;
    schemaTabPanelContent: string;
}
export declare function renderDevToolToggle(
    selected: boolean,
    onToggleCallback: () => void
): React.ReactNode;
export declare function renderScenarioSelect(
    selectedScenarioIndex: number,
    scenarioOptions: Array<Scenario>,
    onChangeCallback: (
        newValue: string | string[],
        selectedItems: ListboxOption[]
    ) => void
): React.ReactNode;
export declare function renderDevToolsTabs(
    config: RenderDevToolsTabsConfig
): React.ReactNode;
export {};
