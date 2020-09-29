import { camelCase, get } from "lodash-es";
import rafThrottle from "raf-throttle";
import {
    ModularForm,
    ModularViewer,
    NavigationMenu,
    ViewerCustomAction,
} from "@microsoft/fast-tooling-react";
import manageJss from "@microsoft/fast-jss-manager-react";
import ReactDOM from "react-dom";
import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    neutralLayerL1,
    neutralLayerL2,
    StandardLuminance,
} from "@microsoft/fast-components-styles-msft";
import {
    ListboxItemProps,
    TabsItem,
    TypographySize,
} from "@microsoft/fast-components-react-base";
import {
    ActionToggle,
    ActionToggleAppearance,
    ActionToggleProps,
    Background,
    Pivot,
    Select,
    SelectOption,
    Typography,
} from "@microsoft/fast-components-react-msft";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import {
    AjvMapper,
    CustomMessageIncomingOutgoing,
    DataDictionary,
    MessageSystem,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import { MonacoAdapter } from "@microsoft/fast-tooling/dist/message-system-service/monaco-adapter.service";
import {
    MonacoAdapterAction,
    MonacoAdapterActionCallbackConfig,
} from "@microsoft/fast-tooling/dist/message-system-service/monaco-adapter.service-action";
import { mapDataDictionaryToMonacoEditorHTML } from "@microsoft/fast-tooling/dist/data-utilities/monaco";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import {
    DirectionSwitch,
    downChevron,
    Logo,
    ThemeSelector,
    TransparencyToggle,
    upChevron,
} from "@microsoft/site-utilities";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { html_beautify } from "vscode-html-languageservice/lib/esm/beautify/beautify-html";
import { ComponentViewConfig, Scenario } from "./fast-components/configs/data.props";
import * as componentConfigs from "./fast-components/configs";
import { history, menu, schemaDictionary } from "./config";
import style, { pivotStyleSheetOverrides } from "./explorer.style";
import {
    ExplorerHandledProps,
    ExplorerProps,
    ExplorerState,
    ExplorerUnhandledProps,
} from "./explorer.props";
import { previewReady } from "./preview";
import { Footer } from "./site-footer";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("@microsoft/site-utilities/statics/assets/fast-inline-logo.svg");
export const previewBackgroundTransparency: string = "PREVIEW::TRANSPARENCY";
export const previewDirection: string = "PREVIEW::DIRECTION";
export const previewTheme: string = "PREVIEW::THEME";
let componentLinkedDataId: string = "root";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

class Explorer extends Foundation<
    ExplorerHandledProps,
    ExplorerUnhandledProps,
    ExplorerState
> {
    public static displayName: string = "Explorer";

    protected handledProps: HandledProps<ExplorerHandledProps> = {
        managedClasses: void 0,
    };

    private viewerContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private viewerContentAreaPadding: number = 20;
    private maxViewerHeight: number = 0;
    private maxViewerWidth: number = 0;
    private windowResizing: number;
    private editor: monaco.editor.IStandaloneCodeEditor;
    private editorContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private adapter: MonacoAdapter;
    private monacoValue: string[];
    private monacoEditorModel: monaco.editor.ITextModel;
    private firstRun: boolean = true;

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
            fastMessageSystem = new MessageSystem({
                webWorker: fastMessageSystemWorker,
            });
            new AjvMapper({
                messageSystem: fastMessageSystem,
            });
            fastMessageSystem.add({
                onMessage: this.handleMessageSystem,
            });
        }

        window.onpopstate = this.handleWindowPopState;
        window.onresize = rafThrottle(this.handleWindowResize);

        this.monacoValue = [];

        this.adapter = new MonacoAdapter({
            messageSystem: fastMessageSystem,
            actions: [
                new MonacoAdapterAction({
                    id: "monaco.setValue",
                    action: (config: MonacoAdapterActionCallbackConfig): void => {
                        // trigger an update to the monaco value that
                        // also updates the DataDictionary which fires a
                        // postMessage to the MessageSystem
                        config.updateMonacoModelValue(this.monacoValue);
                    },
                }),
            ],
        });

        monaco.editor.onDidCreateModel((listener: monaco.editor.ITextModel) => {
            this.monacoEditorModel = monaco.editor.getModel(
                listener.uri
            ) as monaco.editor.ITextModel;

            this.monacoEditorModel.onDidChangeContent(
                (e: monaco.editor.IModelContentChangedEvent) => {
                    /**
                     * Sets the value to be used by monaco
                     */
                    if (this.state.previewReady) {
                        const modelValue = this.monacoEditorModel.getValue();
                        this.monacoValue = Array.isArray(modelValue)
                            ? modelValue
                            : [modelValue];

                        if (!this.firstRun) {
                            this.adapter.action("monaco.setValue").run();
                        }

                        this.firstRun = false;
                    }
                }
            );
        });

        this.state = {
            width: 0,
            height: 0,
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
                <div className={"pane pane__start"}>
                    <Logo
                        className={"logo"}
                        logo={FASTInlineLogo}
                        title={"Component Explorer"}
                    />
                    <NavigationMenu
                        className={"navigation"}
                        menu={menu}
                        expanded={true}
                        activeLocation={this.state.locationPathname}
                        onLocationUpdate={this.handleUpdateRoute}
                    />
                </div>
                <div className={"canvas"}>
                    <div
                        className={classNames("canvas-overlay", [
                            "canvas-overlay__active",
                            this.state.mobileFormVisible ||
                                this.state.mobileNavigationVisible,
                        ])}
                        onClick={this.handleCanvasOverlayTrigger}
                    ></div>
                    <div className={"menu-bar"}>
                        <Background
                            value={neutralLayerL2}
                            drawBackground={true}
                            className="mobile-menu-bar"
                        >
                            {this.renderMobileNavigationTrigger()}
                            <Logo
                                backgroundColor={neutralLayerL2}
                                logo={FASTInlineLogo}
                            />
                            {this.renderMobileFormTrigger()}
                        </Background>
                        <Background
                            value={neutralLayerL2}
                            drawBackground={true}
                            className={"canvas-menu-bar"}
                        >
                            <div className={"menu-item-region"}>
                                {this.renderScenarioSelect()}
                            </div>
                            <div className={"menu-item-region"}>
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
                        </Background>
                    </div>
                    <div
                        className={classNames("canvas-content", [
                            "canvas-content__dev-tools-hidden",
                            !this.state.devToolsVisible,
                        ])}
                    >
                        <div
                            ref={this.viewerContainerRef}
                            className={"preview"}
                            style={{
                                padding: `${this.viewerContentAreaPadding}px`,
                            }}
                        >
                            <ModularViewer
                                iframeSrc={"/preview"}
                                width={this.state.width}
                                height={this.state.height}
                                onUpdateHeight={this.handleUpdateHeight}
                                onUpdateWidth={this.handleUpdateWidth}
                                responsive={true}
                                messageSystem={fastMessageSystem as MessageSystem}
                            />
                        </div>
                        <Background value={neutralLayerL1} className={"dev-tools"}>
                            <Pivot
                                label={"documentation"}
                                items={this.renderPivotItems()}
                                jssStyleSheet={pivotStyleSheetOverrides}
                                onUpdate={this.handlePivotUpdate}
                            />
                            <ActionToggle
                                appearance={ActionToggleAppearance.stealth}
                                selectedLabel={"Development tools expanded"}
                                selectedGlyph={downChevron}
                                unselectedLabel={"Development tools collapsed"}
                                unselectedGlyph={upChevron}
                                selected={this.state.devToolsVisible}
                                onToggle={this.handleDevToolsToggle}
                                className={"dev-tools-trigger"}
                            />
                        </Background>
                    </div>
                </div>
                <div className={"pane pane__end"}>
                    <ModularForm messageSystem={fastMessageSystem} />
                </div>
                <Footer />
            </div>
        );
    }

    public componentDidMount(): void {
        this.setViewerToFullSize();
        this.createMonacoEditor();
    }

    private getContainerClassNames(): string {
        return classNames(
            "container",
            ["container__form-visible", this.state.mobileFormVisible],
            ["container__navigation-visible", this.state.mobileNavigationVisible]
        );
    }

    private updateEditorContent(dataDictionary: DataDictionary<unknown>): void {
        if (this.editor) {
            this.editor.setValue(
                html_beautify(
                    mapDataDictionaryToMonacoEditorHTML(dataDictionary, schemaDictionary)
                )
            );
        }
    }

    private handleCanvasOverlayTrigger = (): void => {
        this.setState({
            mobileFormVisible: false,
            mobileNavigationVisible: false,
        });
    };

    private handleWindowPopState = (): void => {
        if (window.location.pathname !== this.state.locationPathname) {
            this.handleUpdateRoute(window.location.pathname);
        }
    };

    private handleWindowResize = (): void => {
        if (this.editorContainerRef.current) {
            if (this.windowResizing) {
                clearTimeout(this.windowResizing);
            }

            this.windowResizing = window.setTimeout(() => {
                this.setState({
                    width: 0,
                    height: 0,
                });

                this.setViewerToFullSize();

                if (this.state.activePivotTab === "code") {
                    this.createMonacoEditor();
                }
            });
        }
    };

    private createMonacoEditor = (): void => {
        if (this.editorContainerRef.current) {
            if (this.editor && this.state.activePivotTab === "code") {
                this.editor.layout();
            } else if (!this.editor) {
                this.editor = monaco.editor.create(this.editorContainerRef.current, {
                    value: "",
                    language: "html",
                    formatOnPaste: true,
                    lineNumbers: "off",
                    theme: "vs-dark",
                    wordWrap: "on",
                    wordWrapColumn: 80,
                    wordWrapMinified: true,
                    wrappingIndent: "same",
                    minimap: {
                        showSlider: "mouseover",
                    },
                });

                this.updateEditorContent(this.state.dataDictionary);
            }
        }
    };

    private handleMessageSystem = (e: MessageEvent): void => {
        const updatedState: Partial<ExplorerState> = {};

        if (e.data.type === MessageSystemType.navigation) {
            componentLinkedDataId = e.data.activeDictionaryId;
        }

        if (
            e.data.type === MessageSystemType.custom &&
            e.data.action === ViewerCustomAction.response
        ) {
            if (e.data.value === previewReady) {
                fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.state.dataDictionary,
                    schemaDictionary,
                });
                updatedState.previewReady = true;
                this.updateEditorContent(this.state.dataDictionary);
            }
        }

        if (
            e.data.type === MessageSystemType.data ||
            e.data.type === MessageSystemType.initialize
        ) {
            updatedState.dataDictionary = e.data.dataDictionary;

            if (!e.data.options || e.data.options.from !== "monaco-adapter") {
                this.updateEditorContent(e.data.dataDictionary);
            }
        }

        this.setState(updatedState as ExplorerState);
    };

    private setViewerToFullSize(): void {
        const viewerContainer: HTMLDivElement | null = this.viewerContainerRef.current;

        if (viewerContainer) {
            /* eslint-disable-next-line react/no-find-dom-node */
            const viewerNode: Element | Text | null = ReactDOM.findDOMNode(
                viewerContainer
            );

            if (viewerNode instanceof Element) {
                // 24 is height of view label
                this.maxViewerHeight =
                    viewerNode.clientHeight - this.viewerContentAreaPadding * 2 - 24;
                this.maxViewerWidth =
                    viewerNode.clientWidth - this.viewerContentAreaPadding * 2;

                this.setState({
                    width: this.maxViewerWidth,
                    height: this.maxViewerHeight,
                });
            }
        }
    }

    private handleMobileNavigationTrigger = (): void => {
        this.setState({
            mobileNavigationVisible: true,
        });
    };

    private handleMobileFormTrigger = (): void => {
        this.setState({
            mobileFormVisible: true,
        });
    };

    private renderMobileNavigationTrigger(): React.ReactNode {
        return (
            <button
                className={"mobile-pane-trigger"}
                onClick={this.handleMobileNavigationTrigger}
            >
                <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="16" height="1" rx="0.5" fill="white" />
                    <rect y="7" width="16" height="1" rx="0.5" fill="white" />
                    <rect y="14" width="16" height="1" rx="0.5" fill="white" />
                </svg>
            </button>
        );
    }

    private renderMobileFormTrigger(): React.ReactNode {
        return (
            <button
                className={"mobile-pane-trigger"}
                onClick={this.handleMobileFormTrigger}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16.5253 1.47498C17.6898 2.63953 17.6898 4.52764 16.5253 5.69219L6.55167 15.6658C6.32095 15.8965 6.034 16.0631 5.71919 16.1489L1.45612 17.3116C0.989558 17.4388 0.56145 17.0107 0.688694 16.5441L1.85135 12.2811C1.93721 11.9663 2.10373 11.6793 2.33446 11.4486L12.3081 1.47498C13.4726 0.310424 15.3607 0.310424 16.5253 1.47498ZM11.5001 4.05073L3.21834 12.3325C3.14143 12.4094 3.08592 12.505 3.05731 12.61L2.18243 15.8178L5.3903 14.943C5.49523 14.9143 5.59088 14.8588 5.66779 14.7819L13.9493 6.4999L11.5001 4.05073ZM13.1919 2.35886L12.3835 3.16656L14.8326 5.61656L15.6414 4.80831C16.3178 4.13191 16.3178 3.03526 15.6414 2.35886C14.965 1.68246 13.8683 1.68246 13.1919 2.35886Z"
                        fill="white"
                    />
                </svg>
            </button>
        );
    }

    private renderPivotItems(): TabsItem[] {
        return [
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            id={"code"}
                            onClick={this.handleDevToolsTabTriggerClick}
                        >
                            Code
                        </Typography>
                    );
                },
                content: (className: string): React.ReactNode => {
                    return (
                        <div
                            ref={this.editorContainerRef}
                            className={className}
                            style={{ height: "100%" }}
                        />
                    );
                },
                id: "code",
            },
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handleDevToolsTabTriggerClick}
                        >
                            Guidance
                        </Typography>
                    );
                },
                content: (className: string): React.ReactNode => {
                    return (
                        <div className={className}>
                            <this.state.componentConfig.guidance />
                        </div>
                    );
                },
                id: "guidance",
            },
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handleDevToolsTabTriggerClick}
                        >
                            Definition
                        </Typography>
                    );
                },
                content: (className: string): React.ReactNode => {
                    if (typeof this.state.componentConfig.definition !== "undefined") {
                        return (
                            <div className={className}>
                                <pre>
                                    {JSON.stringify(
                                        this.state.componentConfig.definition,
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        );
                    }

                    return null;
                },
                id: "definition",
            },
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handleDevToolsTabTriggerClick}
                        >
                            Schema
                        </Typography>
                    );
                },
                content: (className: string): React.ReactNode => {
                    if (typeof this.state.componentConfig.schema !== "undefined") {
                        return (
                            <div className={className}>
                                <pre>
                                    {JSON.stringify(
                                        this.state.componentConfig.schema,
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        );
                    }

                    return null;
                },
                id: "schema",
            },
        ];
    }

    private renderScenarioSelect(): React.ReactNode {
        const scenarioOptions: Array<Scenario> = get(
            componentConfigs[`${camelCase(this.state.componentName)}Config`],
            "scenarios"
        );

        if (Array.isArray(scenarioOptions)) {
            return (
                <Select
                    onValueChange={this.handleUpdateScenario}
                    defaultSelection={[scenarioOptions[0].displayName]}
                    selectedItems={[
                        scenarioOptions[this.state.selectedScenarioIndex].displayName,
                    ]}
                >
                    {this.renderScenarioOptions(scenarioOptions)}
                </Select>
            );
        }
    }

    private renderScenarioOptions(scenarioOptions: Array<Scenario>): React.ReactNode {
        return scenarioOptions.map((scenarioOption: Scenario, index: number) => {
            return (
                <SelectOption
                    key={index}
                    id={scenarioOption.displayName}
                    displayString={scenarioOption.displayName}
                    value={`${index}`}
                />
            );
        });
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

    private handleUpdateTheme = (): void => {
        const updatedTheme: StandardLuminance =
            this.state.theme === StandardLuminance.DarkMode
                ? StandardLuminance.LightMode
                : StandardLuminance.DarkMode;

        this.setState({
            theme: updatedTheme,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.response,
            id: previewTheme,
            value: updatedTheme,
        } as CustomMessageIncomingOutgoing);
    };

    private handleUpdateDirection = (): void => {
        const updatedDirection: Direction =
            this.state.direction === Direction.ltr ? Direction.rtl : Direction.ltr;
        this.setState({
            direction: updatedDirection,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.response,
            id: previewDirection,
            value: updatedDirection,
        } as CustomMessageIncomingOutgoing);
    };

    private handleUpdateScenario = (
        newValue: string | string[],
        selectedItems: ListboxItemProps[]
    ): void => {
        const selectedScenarioIndex: number = parseInt(selectedItems[0].value, 10);

        this.setState(
            {
                selectedScenarioIndex,
            },
            () => {
                if ((window as any).Worker && fastMessageSystem) {
                    fastMessageSystem.postMessage({
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

    private handleUpdateHeight = (updatedHeight: number): void => {
        const maxViewerHeight = this.state.devToolsVisible
            ? this.maxViewerHeight
            : this.maxViewerHeight * 2;

        this.setState({
            height: updatedHeight > maxViewerHeight ? maxViewerHeight : updatedHeight,
        });
    };

    private handleUpdateWidth = (updatedWidth: number): void => {
        this.setState({
            width:
                updatedWidth > this.maxViewerWidth ? this.maxViewerWidth : updatedWidth,
        });
    };

    private handleUpdateRoute = (route: string): void => {
        const componentName: string = this.getComponentNameSpinalCaseByPath(route);
        const componentConfig: any = get(
            componentConfigs,
            `${camelCase(componentName)}Config`
        );

        if ((window as any).Worker && fastMessageSystem) {
            fastMessageSystem.postMessage({
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

    private handleUpdateTransparency = (): void => {
        this.setState({
            transparentBackground: !this.state.transparentBackground,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.response,
            id: previewBackgroundTransparency,
            value: !this.state.transparentBackground,
        } as CustomMessageIncomingOutgoing);
    };

    private handleDevToolsToggle = (
        e: React.MouseEvent<HTMLButtonElement>,
        props: ActionToggleProps
    ): void => {
        this.setState({
            devToolsVisible: !props.selected,
        });
    };

    private handlePivotUpdate = (activeTab: string): void => {
        this.setState({
            activePivotTab: activeTab,
        });

        if (activeTab === "code") {
            window.setTimeout(() => {
                this.createMonacoEditor();
            });
        }
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private handleDevToolsTabTriggerClick = (e: React.MouseEvent<unknown>): void => {
        if (!this.state.devToolsVisible) {
            this.setState({
                devToolsVisible: true,
            });
        }
    };
}

export default manageJss(style)(Explorer);
