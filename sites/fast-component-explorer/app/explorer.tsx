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
import {
    DataDictionary,
    MessageSystem,
    MessageSystemType,
    monacoAdapterId,
} from "@microsoft/fast-tooling";
import {
    componentCategories,
    DirectionSwitch,
    Editor,
    Logo,
    ThemeSelector,
    TransparencyToggle,
} from "@microsoft/site-utilities";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { ListboxOption } from "@microsoft/fast-foundation";
import { ComponentViewConfig, Scenario } from "./fast-components/configs/data.props";
import * as componentConfigs from "./fast-components/configs";
import { history, menu, schemaDictionary } from "./config";
import { ExplorerProps, ExplorerState } from "./explorer.props";
import { previewReady } from "./preview";
import { Footer } from "./site-footer";
import {
    renderDevToolsTabs,
    renderDevToolToggle,
    renderScenarioSelect,
} from "./web-components";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("@microsoft/site-utilities/statics/assets/fast-inline-logo.svg");
let componentLinkedDataId: string = "root";

class Explorer extends Editor<ExplorerProps, ExplorerState> {
    public static displayName: string = "Explorer";
    public webComponentEditorContainerRef: HTMLElement;
    public editorContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    public viewerContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private windowResizing: number;

    constructor(props: ExplorerProps) {
        super(props);

        const locationPathname: string = get(this.props, "location.pathname", "");
        const componentName: string = this.getComponentNameSpinalCaseByPath(
            locationPathname
        );
        const componentConfig: any = get(
            componentConfigs,
            `${camelCase(componentName)}Config`
        );
        const selectedScenarioIndex: number = 0;

        if ((window as any).Worker) {
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

    public render(): React.ReactNode {
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
                                messageSystem={this.fastMessageSystem as MessageSystem}
                            />
                            {renderDevToolToggle(
                                this.state.devToolsVisible,
                                this.handleDevToolsToggle
                            )}
                        </div>
                        <div className={"dev-tools"}>
                            {renderDevToolsTabs({
                                codeRenderCallback: (e: HTMLElement) => {
                                    this.webComponentEditorContainerRef = e;
                                },
                                tabUpdateCallback: (
                                    e: React.ChangeEvent<HTMLElement>
                                ) => {
                                    this.handlePivotUpdate((e as any).detail.id);
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

    public componentDidMount(): void {
        this.handleWindowResize();
    }

    private handleWindowPopState = (): void => {
        if (window.location.pathname !== this.state.locationPathname) {
            this.handleUpdateRoute(window.location.pathname);
        }
    };

    private handleWindowResize = (): void => {
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

    private updateMonacoEditor = (): void => {
        this.createMonacoEditor(monaco, this.webComponentEditorContainerRef);

        if (
            this.webComponentEditorContainerRef &&
            this.editor &&
            this.state.activePivotTab === "code"
        ) {
            this.editor.layout();
        }
    };

    private handleMessageSystem = (e: MessageEvent): void => {
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

    private renderScenarioSelect(): React.ReactNode {
        const scenarioOptions: Array<Scenario> = get(
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

    private getComponentNameSpinalCaseByPath(path: string): string {
        const paths: string[] = path.split("/");
        return paths[paths.length - 1];
    }

    private getScenarioData(
        componentConfig: ComponentViewConfig,
        index?: number
    ): DataDictionary<unknown> {
        // cloning when the scenario data is fetched as there appears to be
        // a mutation happening in one of the Form
        const dataDictionary: DataDictionary<unknown> =
            typeof index === "number"
                ? componentConfig.scenarios[index].dataDictionary
                : componentConfig.scenarios[0].dataDictionary;

        return dataDictionary;
    }

    private handleUpdateScenario = (
        newValue: string | string[],
        selectedItems: ListboxOption[]
    ): void => {
        const selectedScenarioIndex: number = parseInt(selectedItems[0].value, 10);

        this.setState(
            {
                selectedScenarioIndex,
            },
            () => {
                if ((window as any).Worker && this.fastMessageSystem) {
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

    private handleUpdateRoute = (route: string): void => {
        const componentName: string = this.getComponentNameSpinalCaseByPath(route);
        const componentConfig: any = get(
            componentConfigs,
            `${camelCase(componentName)}Config`
        );

        if ((window as any).Worker && this.fastMessageSystem) {
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

    private handleDevToolsToggle = (): void => {
        const selected: boolean = !this.state.devToolsVisible;
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

    private handlePivotUpdate = (activeTab: string): void => {
        this.setState({
            activePivotTab: activeTab,
        });

        if (activeTab === "code") {
            window.setTimeout(() => {
                this.updateMonacoEditor();
            });
        }
    };
}

export default Explorer;
