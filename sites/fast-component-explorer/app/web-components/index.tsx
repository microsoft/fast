/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import {
    FASTDesignSystemProvider,
    FASTTab,
    FASTTabPanel,
    FASTTabs,
} from "@microsoft/fast-components";
import { neutralLayerL1, neutralLayerL3 } from "@microsoft/fast-components-styles-msft";
import h from "@microsoft/site-utilities/dist/web-components/pragma";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
FASTDesignSystemProvider;
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

export function renderDevToolsTabs(config: RenderDevToolsTabsConfig): React.ReactNode {
    const styleOverrides: string = `
        a {
            color: var(--accent-foreground-rest);
        }

        .devToolsTabPanel_region {
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

        .devToolsTabPanel_region::-webkit-scrollbar {
            background: ${neutralLayerL1};
            width: 8px;
            height: 8px;
        }

        .devToolsTabPanel_region::-webkit-scrollbar-thumb {
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
                    <div className={"devToolsTabPanel_region"}>
                        <config.guidanceTabPanelContent />
                    </div>
                </fast-tab-panel>
                <fast-tab-panel slot="tabpanel">
                    <div className={"devToolsTabPanel_region"}>
                        <pre>{config.definitionTabPanelContent}</pre>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel>
                    <div className={"devToolsTabPanel_region"}>
                        <pre>{config.schemaTabPanelContent}</pre>
                    </div>
                </fast-tab-panel>
            </fast-tabs>
        </fast-design-system-provider>
    );
}
