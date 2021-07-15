import { camelCase, get } from "lodash-es";
import rafThrottle from "raf-throttle";
import {
    ModularForm,
    ModularViewer,
    NavigationMenu,
    ViewerCustomAction,
} from "@microsoft/fast-tooling-react";
import React from "react";
import { StandardLuminance } from "@microsoft/fast-components";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import { MessageSystemType } from "@microsoft/fast-tooling";
import {
    componentCategories,
    DirectionSwitch,
    Editor,
    Logo,
    ThemeSelector,
    TransparencyToggle,
} from "@microsoft/site-utilities";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { monacoAdapterId } from "@microsoft/fast-tooling/dist/esm/message-system-service/monaco-adapter.service";
import * as componentConfigs from "./fast-components/configs";
import { history, menu, schemaDictionary } from "./config";
import { previewReady } from "./preview";
import { Footer } from "./site-footer";
import {
    renderDevToolsTabs,
    renderDevToolToggle,
    renderScenarioSelect,
} from "./web-components";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("@microsoft/site-utilities/statics/assets/fast-inline-logo.svg");
let componentLinkedDataId = "root";
class Explorer extends Editor {
    constructor(props) {
        super(props);
        this.editorContainerRef = React.createRef();
        this.viewerContainerRef = React.createRef();
        this.handleWindowPopState = () => {
            if (window.location.pathname !== this.state.locationPathname) {
                this.handleUpdateRoute(window.location.pathname);
            }
        };
        this.handleWindowResize = () => {
            if (this.webComponentEditorContainerRef) {
                if (this.windowResizing) {
                    clearTimeout(this.windowResizing);
                }
                this.windowResizing = window.setTimeout(() => {
                    this.setState({
                        viewerWidth: 0,
                        viewerHeight: 0,
                    });
                    this.setViewerToFullSize();
                    if (this.state.activePivotTab === "code") {
                        this.updateMonacoEditor();
                    }
                });
            }
        };
        this.updateMonacoEditor = () => {
            this.createMonacoEditor(monaco, this.webComponentEditorContainerRef);
            if (
                this.webComponentEditorContainerRef &&
                this.editor &&
                this.state.activePivotTab === "code"
            ) {
                this.editor.layout();
            }
        };
        this.handleMessageSystem = e => {
            if (e.data.type === MessageSystemType.navigation) {
                componentLinkedDataId = e.data.activeDictionaryId;
            }
            if (
                e.data.type === MessageSystemType.custom &&
                e.data.action === ViewerCustomAction.response &&
                e.data.value === previewReady
            ) {
                const dataDictionary = this.getScenarioData(this.state.componentConfig);
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary,
                    schemaDictionary,
                });
                this.setState(
                    {
                        previewReady: true,
                    },
                    () => {
                        this.updateEditorContent(dataDictionary);
                    }
                );
            } else if (
                (e.data.type === MessageSystemType.data ||
                    e.data.type === MessageSystemType.initialize) &&
                (!e.data.options || e.data.options.originatorId !== monacoAdapterId)
            ) {
                this.setState(
                    {
                        dataDictionary: e.data.dataDictionary,
                    },
                    () => {
                        this.updateEditorContent(e.data.dataDictionary);
                    }
                );
            }
        };
        this.handleUpdateScenario = (newValue, selectedItems) => {
            const selectedScenarioIndex = parseInt(selectedItems[0].value, 10);
            this.setState(
                {
                    selectedScenarioIndex,
                },
                () => {
                    if (window.Worker && this.fastMessageSystem) {
                        this.fastMessageSystem.postMessage({
                            type: MessageSystemType.initialize,
                            dataDictionary: this.getScenarioData(
                                this.state.componentConfig,
                                selectedScenarioIndex
                            ),
                            schemaDictionary,
                        });
                    }
                }
            );
        };
        this.handleUpdateRoute = route => {
            const componentName = this.getComponentNameSpinalCaseByPath(route);
            const componentConfig = get(
                componentConfigs,
                `${camelCase(componentName)}Config`
            );
            if (window.Worker && this.fastMessageSystem) {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.getScenarioData(componentConfig, 0),
                    schemaDictionary,
                });
            }
            this.setState(
                {
                    locationPathname: route,
                    componentName,
                    componentConfig,
                    selectedScenarioIndex: 0,
                },
                () => {
                    history.push(route);
                }
            );
        };
        this.handleDevToolsToggle = () => {
            const selected = !this.state.devToolsVisible;
            this.maxViewerHeight = selected
                ? this.maxViewerHeight / 2
                : this.maxViewerHeight * 2;
            this.setState(
                {
                    devToolsVisible: selected,
                },
                this.setViewerToFullSize
            );
        };
        this.handlePivotUpdate = activeTab => {
            this.setState({
                activePivotTab: activeTab,
            });
            if (activeTab === "code") {
                window.setTimeout(() => {
                    this.updateMonacoEditor();
                });
            }
        };
        const locationPathname = get(this.props, "location.pathname", "");
        const componentName = this.getComponentNameSpinalCaseByPath(locationPathname);
        const componentConfig = get(
            componentConfigs,
            `${camelCase(componentName)}Config`
        );
        const selectedScenarioIndex = 0;
        if (window.Worker) {
            this.fastMessageSystem.add({
                onMessage: this.handleMessageSystem,
            });
        }
        window.onpopstate = this.handleWindowPopState;
        window.onresize = rafThrottle(this.handleWindowResize);
        this.setupMonacoEditor(monaco);
        this.state = {
            viewerWidth: 0,
            viewerHeight: 0,
            componentName,
            componentConfig,
            selectedScenarioIndex,
            locationPathname,
            transparentBackground: false,
            devToolsVisible: true,
            direction: Direction.ltr,
            theme: StandardLuminance.DarkMode,
            previewReady: false,
            activeDictionaryId: componentLinkedDataId,
            dataDictionary: this.getScenarioData(componentConfig, selectedScenarioIndex),
            activePivotTab: "code",
            mobileFormVisible: false,
            mobileNavigationVisible: false,
            lastMappedDataDictionaryToMonacoEditorHTMLValue: "",
        };
    }
    render() {
        if (typeof this.state.componentName === "undefined") {
            return (
                <div>
                    <h1>404 - This page does not exist</h1>
                    <a href={"/"}>Go to a valid page</a>
                </div>
            );
        }
        return (
            <div className={this.getContainerClassNames()}>
                <div className={this.paneStartClassNames}>
                    <Logo
                        className={this.logoClassNames}
                        logo={FASTInlineLogo}
                        title={"Component Explorer"}
                    />
                    <NavigationMenu
                        className={this.navigationClassNames}
                        menu={menu}
                        expanded={true}
                        activeLocation={this.state.locationPathname}
                        onLocationUpdate={this.handleUpdateRoute}
                    />
                </div>
                <div className={this.canvasClassNames}>
                    {this.renderCanvasOverlay()}
                    <div className={this.menuBarClassNames}>
                        <div className={this.mobileMenuBarClassNames}>
                            {this.renderMobileNavigationTrigger()}
                            <Logo logo={FASTInlineLogo} />
                            {this.renderMobileFormTrigger()}
                        </div>
                        <div className={this.canvasMenuBarClassNames}>
                            <div className={this.menuItemRegionClassNames}>
                                {this.renderScenarioSelect()}
                            </div>
                            <div className={this.menuItemRegionClassNames}>
                                <TransparencyToggle
                                    id={"transparency-toggle"}
                                    transparency={this.state.transparentBackground}
                                    onUpdateTransparency={this.handleUpdateTransparency}
                                    disabled={!this.state.previewReady}
                                />
                                <DirectionSwitch
                                    id={"direction-switch"}
                                    direction={this.state.direction}
                                    onUpdateDirection={this.handleUpdateDirection}
                                    disabled={!this.state.previewReady}
                                />
                                <ThemeSelector
                                    id={"theme-selector"}
                                    theme={this.state.theme}
                                    onUpdateTheme={this.handleUpdateTheme}
                                    disabled={!this.state.previewReady}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={classNames(this.canvasContentClassNames, [
                            "canvas-content__dev-tools-hidden",
                            !this.state.devToolsVisible,
                        ])}
                    >
                        <div
                            ref={this.viewerContainerRef}
                            className={this.viewerClassNames}
                            style={{
                                padding: `${this.viewerContentAreaPadding}px`,
                            }}
                        >
                            <ModularViewer
                                iframeSrc={"/preview"}
                                width={this.state.viewerWidth}
                                height={this.state.viewerHeight}
                                onUpdateHeight={this.handleUpdateHeight}
                                onUpdateWidth={this.handleUpdateWidth}
                                responsive={true}
                                messageSystem={this.fastMessageSystem}
                            />
                            {renderDevToolToggle(
                                this.state.devToolsVisible,
                                this.handleDevToolsToggle
                            )}
                        </div>
                        <div className={"dev-tools"}>
                            {renderDevToolsTabs({
                                codeRenderCallback: e => {
                                    this.webComponentEditorContainerRef = e;
                                },
                                tabUpdateCallback: e => {
                                    this.handlePivotUpdate(e.detail.id);
                                },
                                guidanceTabPanelContent: this.state.componentConfig
                                    .guidance,
                                definitionTabPanelContent: JSON.stringify(
                                    this.state.componentConfig.definition,
                                    null,
                                    2
                                ),
                                schemaTabPanelContent: JSON.stringify(
                                    this.state.componentConfig.schema,
                                    null,
                                    2
                                ),
                            })}
                        </div>
                    </div>
                </div>
                <div className={this.paneEndClassNames}>
                    <ModularForm
                        messageSystem={this.fastMessageSystem}
                        categories={componentCategories}
                    />
                </div>
                <Footer />
            </div>
        );
    }
    componentDidMount() {
        this.handleWindowResize();
    }
    renderScenarioSelect() {
        const scenarioOptions = get(
            componentConfigs[`${camelCase(this.state.componentName)}Config`],
            "scenarios"
        );
        if (Array.isArray(scenarioOptions)) {
            return renderScenarioSelect(
                this.state.selectedScenarioIndex,
                scenarioOptions,
                this.handleUpdateScenario
            );
        }
    }
    getComponentNameSpinalCaseByPath(path) {
        const paths = path.split("/");
        return paths[paths.length - 1];
    }
    getScenarioData(componentConfig, index) {
        // cloning when the scenario data is fetched as there appears to be
        // a mutation happening in one of the Form
        const dataDictionary =
            typeof index === "number"
                ? componentConfig.scenarios[index].dataDictionary
                : componentConfig.scenarios[0].dataDictionary;
        return dataDictionary;
    }
}
Explorer.displayName = "Explorer";
export default Explorer;
