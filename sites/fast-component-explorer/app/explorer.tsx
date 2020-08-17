import { camelCase, get } from "lodash-es";
import { Container, Pane, Row, RowResizeDirection } from "@microsoft/fast-layouts-react";
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
import { Direction } from "@microsoft/fast-web-utilities";
import {
    AjvMapper,
    CustomMessageIncomingOutgoing,
    DataDictionary,
    MessageSystem,
    MessageSystemType,
} from "@microsoft/fast-tooling";
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
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("@microsoft/site-utilities/statics/assets/fast-inline-logo.svg");
export const previewBackgroundTransparency: string = "PREVIEW::TRANSPARENCY";
export const previewDirection: string = "PREVIEW::DIRECTION";
export const previewTheme: string = "PREVIEW::THEME";
let componentLinkedDataId: string = "root";

interface ObjectOfComponentViewConfigs {
    [key: string]: ComponentViewConfig;
}

// Prepends the custom scenario to each components list fo scenarios
function setViewConfigsWithCustomConfig(
    viewConfigs: ObjectOfComponentViewConfigs
): ObjectOfComponentViewConfigs {
    const componentViewConfigs: ObjectOfComponentViewConfigs = {};

    Object.keys(viewConfigs).forEach((viewConfigKey: string): void => {
        componentViewConfigs[viewConfigKey] = Object.assign(
            {},
            viewConfigs[viewConfigKey],
            {
                scenarios: [
                    {
                        displayName: "Custom",
                        dataDictionary:
                            viewConfigs[viewConfigKey].scenarios[0].dataDictionary,
                    },
                ].concat(viewConfigs[viewConfigKey].scenarios),
            }
        );
    });

    return componentViewConfigs;
}

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
    private editor: monaco.editor.IStandaloneCodeEditor;
    private editorContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    constructor(props: ExplorerProps) {
        super(props);

        const locationPathname: string = get(this.props, "location.pathname", "");
        const componentName: string = this.getComponentNameSpinalCaseByPath(
            locationPathname
        );
        const componentConfig: any = get(
            setViewConfigsWithCustomConfig(componentConfigs),
            `${camelCase(componentName)}Config`
        );
        const selectedScenarioIndex: number = 1;

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

        window.onpopstate = this.handlePopState;

        monaco.editor.onDidCreateModel((listener: monaco.editor.ITextModel) => {
            (monaco.editor.getModel(
                listener.uri
            ) as monaco.editor.ITextModel).onDidChangeContent(
                (event: monaco.editor.IModelContentChangedEvent) => {
                    this.editor
                        .getAction("editor.action.formatDocument")
                        .run()
                        .then((value: void) => {
                            if (event.changes.length > 1) {
                                this.editor.updateOptions({
                                    readOnly: true,
                                });
                            }
                        });
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
            <Background value={neutralLayerL1}>
                <Container>
                    <Row style={{ flex: "1" }}>
                        <Pane width={260}>
                            <Logo
                                backgroundColor={"#181818"}
                                logo={FASTInlineLogo}
                                title={"Component Explorer"}
                            />
                            <NavigationMenu
                                menu={menu}
                                expanded={true}
                                activeLocation={this.state.locationPathname}
                                onLocationUpdate={this.handleUpdateRoute}
                            />
                        </Pane>
                        <div
                            style={{
                                display: "flex",
                                flex: 1,
                                flexDirection: "column",
                            }}
                        >
                            <Row style={{ overflow: "visible", zIndex: 1 }} height={46}>
                                <Background
                                    value={neutralLayerL2}
                                    drawBackground={true}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "0 8px",
                                    }}
                                >
                                    {this.renderScenarioSelect()}
                                    <div style={{ display: "flex" }}>
                                        <TransparencyToggle
                                            id={"transparency-toggle"}
                                            transparency={
                                                this.state.transparentBackground
                                            }
                                            onUpdateTransparency={
                                                this.handleUpdateTransparency
                                            }
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
                            </Row>
                            <Row fill={true}>
                                <div
                                    ref={this.viewerContainerRef}
                                    style={{
                                        padding: `${this.viewerContentAreaPadding}px`,
                                        width: "100%",
                                        height: "100%",
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
                            </Row>
                            <Row
                                resizable={true}
                                resizeFrom={RowResizeDirection.north}
                                initialHeight={400}
                                collapsedHeight={36}
                                collapsed={!this.state.devToolsVisible}
                            >
                                <Background
                                    value={neutralLayerL1}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >
                                    <div
                                        style={{
                                            marginTop: "12px",
                                            position: "relative",
                                            height: "100%",
                                        }}
                                    >
                                        <Pivot
                                            label={"documentation"}
                                            items={this.renderPivotItems()}
                                            jssStyleSheet={pivotStyleSheetOverrides}
                                        />
                                        <ActionToggle
                                            appearance={ActionToggleAppearance.stealth}
                                            selectedLabel={"Development tools expanded"}
                                            selectedGlyph={downChevron}
                                            unselectedLabel={
                                                "Development tools collapsed"
                                            }
                                            unselectedGlyph={upChevron}
                                            selected={this.state.devToolsVisible}
                                            onToggle={this.handleDevToolsToggle}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                            }}
                                        />
                                    </div>
                                </Background>
                            </Row>
                        </div>
                        <Pane>
                            <ModularForm messageSystem={fastMessageSystem} />
                        </Pane>
                    </Row>
                </Container>
            </Background>
        );
    }

    public componentDidMount(): void {
        this.setViewerToFullSize();

        if (this.editorContainerRef.current) {
            this.editor = monaco.editor.create(this.editorContainerRef.current, {
                value: "",
                language: "html",
                formatOnType: true,
                formatOnPaste: true,
                lineNumbers: "off",
                theme: "vs-dark",
                wordWrap: "on",
                wordWrapColumn: 80,
                wordWrapMinified: true,
                automaticLayout: true,
                wrappingIndent: "same",
                minimap: {
                    showSlider: "mouseover",
                },
                readOnly: true,
            });
        }
    }

    private updateEditorContent(dataDictionary: DataDictionary<unknown>): void {
        if (this.editor) {
            this.editor.updateOptions({
                readOnly: false,
            });
            this.editor.setValue(
                mapDataDictionaryToMonacoEditorHTML(dataDictionary, schemaDictionary)
            );
        }
    }

    private handlePopState = (): void => {
        if (window.location.pathname !== this.state.locationPathname) {
            this.handleUpdateRoute(window.location.pathname);
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
            this.updateEditorContent(this.state.dataDictionary);
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
                const height: number =
                    viewerNode.clientHeight - this.viewerContentAreaPadding * 2;
                const width: number =
                    viewerNode.clientWidth - this.viewerContentAreaPadding * 2;
                this.setState({
                    width,
                    height: height - 24, // 24 is height of view label
                });
            }
        }
    }

    private renderPivotItems(): TabsItem[] {
        return [
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
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
                            style={{ height: "340px" }}
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
            setViewConfigsWithCustomConfig(componentConfigs)[
                `${camelCase(this.state.componentName)}Config`
            ],
            "scenarios"
        );

        if (Array.isArray(scenarioOptions)) {
            return (
                <Select
                    onValueChange={this.handleUpdateScenario}
                    defaultSelection={[scenarioOptions[1].displayName]}
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
                        data: this.getScenarioData(
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
        this.setState({
            height: updatedHeight,
        });
    };

    private handleUpdateWidth = (updatedWidth: number): void => {
        this.setState({
            width: updatedWidth,
        });
    };

    private handleUpdateRoute = (route: string): void => {
        const componentName: string = this.getComponentNameSpinalCaseByPath(route);
        const componentConfig: any = get(
            setViewConfigsWithCustomConfig(componentConfigs),
            `${camelCase(componentName)}Config`
        );

        if ((window as any).Worker && fastMessageSystem) {
            fastMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary: this.getScenarioData(componentConfig, 1),
                schemaDictionary,
            });
        }

        this.setState(
            {
                locationPathname: route,
                componentName,
                componentConfig,
                selectedScenarioIndex: 1,
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
