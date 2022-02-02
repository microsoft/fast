import { html } from "@microsoft/fast-element";
import DataAreaIcon from "@fluentui/svg-icons/icons/data_area_24_regular.svg";
import DataHistogramIcon from "@fluentui/svg-icons/icons/data_histogram_24_regular.svg";
import DataScatterIcon from "@fluentui/svg-icons/icons/data_scatter_24_regular.svg";

export const sampleAppTemplate = html`
    <template>
        <app-layer-background background-layer-recipe="L3">
            <div class="wrapper">
                <div class="toolbar">
                    <p>Adaptive sample app</p>
                </div>
                <fast-tabs orientation="vertical">
                    <fast-tab id="tab-1" title="Area">${DataAreaIcon}</fast-tab>
                    <fast-tab id="tab-2" title="Histogram">${DataHistogramIcon}</fast-tab>
                    <fast-tab id="tab-3" title="Scatter">${DataScatterIcon}</fast-tab>
                    <fast-tab-panel id="tab-panel-1">
                        <fast-card class="content">
                            <div class="pane">
                                <fast-tree-view render-collapsed-nodes="false">
                                    <fast-tree-item>
                                        Root item 1
                                        <fast-divider></fast-divider>
                                        <fast-tree-item expanded>
                                            Flowers
                                            <fast-tree-item>Daisy</fast-tree-item>
                                            <fast-tree-item disabled>
                                                Sunflower
                                            </fast-tree-item>
                                            <fast-tree-item expanded>
                                                Rose
                                                <fast-divider
                                                    role="presentation"
                                                ></fast-divider>
                                                <fast-tree-item>Pink</fast-tree-item>
                                                <fast-tree-item>Red</fast-tree-item>
                                                <fast-tree-item>White</fast-tree-item>
                                            </fast-tree-item>
                                        </fast-tree-item>
                                        <fast-tree-item>Nested item 2</fast-tree-item>
                                        <fast-tree-item>Nested item 3</fast-tree-item>
                                    </fast-tree-item>
                                    <fast-tree-item>
                                        Root item 2
                                        <fast-tree-item>
                                            Flowers
                                            <fast-divider></fast-divider>
                                            <fast-tree-item disabled>
                                                Daisy
                                            </fast-tree-item>
                                            <fast-tree-item>Sunflower</fast-tree-item>
                                            <fast-tree-item>Rose</fast-tree-item>
                                        </fast-tree-item>
                                        <fast-tree-item>Nested item 2</fast-tree-item>
                                        <fast-tree-item>Nested item 3</fast-tree-item>
                                    </fast-tree-item>
                                    <fast-tree-item>
                                        Root item 3
                                    </fast-tree-item>
                                </fast-tree-view>
                            </div>
                            <fast-card class="details"></fast-card>
                        </fast-card>
                    </fast-tab-panel>
                    <fast-tab-panel id="tab-panel-2">
                        <fast-card class="content">
                            <div class="pane">
                                <fast-listbox>
                                    <fast-option>Item 1</fast-option>
                                    <fast-option>Item 2</fast-option>
                                    <fast-option>Item 3</fast-option>
                                </fast-listbox>
                            </div>
                            <fast-card class="details"></fast-card>
                        </fast-card>
                    </fast-tab-panel>
                    <fast-tab-panel id="tab-panel-3">
                        <fast-card class="content">
                            <app-sample-page></app-sample-page>
                        </fast-card>
                    </fast-tab-panel>
                </fast-tabs>
            </div>
        </app-layer-background>
    </template>
`;
