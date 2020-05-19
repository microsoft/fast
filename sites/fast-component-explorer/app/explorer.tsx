import { camelCase, get } from "lodash-es";
import {
    Container,
    Pane,
    PaneResizeDirection,
    Row,
    RowResizeDirection,
} from "@microsoft/fast-layouts-react";
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
    createColorPalette,
    DesignSystemDefaults,
    designSystemSchema,
    neutralLayerL1,
    neutralLayerL2,
    neutralLayerL3,
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
    ActionTrigger,
    Background,
    Heading,
    HeadingSize,
    Pivot,
    Select,
    SelectOption,
    Typography,
} from "@microsoft/fast-components-react-msft";
import { Direction } from "@microsoft/fast-web-utilities";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import {
    AjvMapper,
    CustomMessageIncomingOutgoing,
    DataDictionary,
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import {
    AccentColorPicker,
    DirectionSwitch,
    dotDotDotGlyph,
    downChevron,
    ThemeSelector,
    TransparencyToggle,
    upChevron,
} from "@microsoft/site-utilities";
import { ComponentViewConfig, Scenario } from "./utilities/configs/data.props";
import * as componentViewConfigsWithoutCustomConfig from "./utilities/configs";
import { history, menu, schemaDictionary } from "./config";
import style from "./explorer.style";
import {
    ExplorerHandledProps,
    ExplorerProps,
    ExplorerState,
    ExplorerUnhandledProps,
} from "./explorer.props";
import { previewReady } from "./preview";

export const backgroundTransparency: string = "PREVIEW::TRANSPARENCY";
let componentLinkedDataId: string = "root";
let componentNavigationConfigId: string = "";

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

export const designSystemLinkedDataId: string = "designSystem";
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

    constructor(props: ExplorerProps) {
        super(props);

        const locationPathname: string = get(this.props, "location.pathname", "");
        const componentName: string = this.getComponentNameSpinalCaseByPath(
            locationPathname
        );
        const componentConfig: any = get(
            setViewConfigsWithCustomConfig(componentViewConfigsWithoutCustomConfig),
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

        this.state = {
            width: 0,
            height: 0,
            componentName,
            componentConfig,
            selectedScenarioIndex,
            locationPathname,
            theme: StandardLuminance.LightMode,
            designSystem: DesignSystemDefaults,
            transparentBackground: false,
            devToolsVisible: true,
            accentColor: "#0078D4",
            direction: Direction.ltr,
            previewReady: false,
            activeDictionaryId: componentLinkedDataId,
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
                        <Pane resizable={true} resizeFrom={PaneResizeDirection.east}>
                            <Background
                                value={neutralLayerL3}
                                drawBackground={true}
                                style={{
                                    display: "flex",
                                    height: "32px",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0 8px",
                                }}
                            >
                                <Heading size={HeadingSize._6}>FAST Explorer</Heading>
                            </Background>
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
                            <Row style={{ overflow: "visible", zIndex: 1 }}>
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
                                    <TransparencyToggle
                                        id={"transparency-toggle"}
                                        transparency={this.state.transparentBackground}
                                        onUpdateTransparency={
                                            this.handleUpdateTransparency
                                        }
                                        disabled={!this.state.previewReady}
                                    />
                                    <ThemeSelector
                                        id={"theme-selector"}
                                        theme={this.state.theme}
                                        onUpdateTheme={this.handleUpdateTheme}
                                        disabled={!this.state.previewReady}
                                    />
                                    <DirectionSwitch
                                        id={"direction-switch"}
                                        direction={this.state.direction}
                                        onUpdateDirection={this.handleUpdateDirection}
                                        disabled={!this.state.previewReady}
                                    />
                                    <AccentColorPicker
                                        id={"accent-color-picker"}
                                        accentBaseColor={this.state.accentColor}
                                        onAccentColorPickerChange={
                                            this.handleAccentColorPickerChange
                                        }
                                        disabled={!this.state.previewReady}
                                    />
                                    <ActionTrigger
                                        glyph={dotDotDotGlyph}
                                        style={{
                                            marginLeft: 4,
                                            width: "24px",
                                            padding: "0",
                                        }}
                                        onClick={this.handleShowDesignSystemEditor}
                                        disabled={!this.state.previewReady}
                                    />
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
                                collapsedHeight={32}
                                collapsed={!this.state.devToolsVisible}
                            >
                                <Background
                                    value={neutralLayerL2}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        overflow: "auto",
                                    }}
                                >
                                    <Pivot
                                        label={"documentation"}
                                        items={this.renderPivotItems()}
                                    />
                                    <ActionToggle
                                        appearance={ActionToggleAppearance.stealth}
                                        selectedLabel={"Development tools expanded"}
                                        selectedGlyph={downChevron}
                                        unselectedLabel={"Development tools collapsed"}
                                        unselectedGlyph={upChevron}
                                        selected={this.state.devToolsVisible}
                                        onToggle={this.handleDevToolsToggle}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                        }}
                                    />
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
    }

    private handleShowDesignSystemEditor = (): void => {
        const isDesignSystem: boolean =
            this.state.activeDictionaryId === designSystemLinkedDataId;
        const activeDictionaryId: string = isDesignSystem
            ? componentLinkedDataId
            : designSystemLinkedDataId;

        this.setState({
            activeDictionaryId,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId,
            activeNavigationConfigId: isDesignSystem ? "" : componentNavigationConfigId,
        });
    };

    private handleMessageSystem = (e: MessageEvent): void => {
        const updatedState: Partial<ExplorerState> = {};

        if (
            e.data.type === MessageSystemType.navigation &&
            e.data.activeDictionaryId !== designSystemLinkedDataId
        ) {
            componentLinkedDataId = e.data.activeDictionaryId;
            componentNavigationConfigId = e.data.activeNavigationConfigId;
        }

        if (
            e.data.type === MessageSystemType.custom &&
            e.data.action === ViewerCustomAction.response
        ) {
            if (e.data.value === previewReady) {
                fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.getScenarioData(
                        this.state.componentConfig,
                        this.state.selectedScenarioIndex
                    ),
                    schemaDictionary,
                });
                updatedState.previewReady = true;
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
            setViewConfigsWithCustomConfig(componentViewConfigsWithoutCustomConfig)[
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
        dataDictionary[0][designSystemLinkedDataId] = {
            schemaId: designSystemSchema.id,
            data:
                this.state && this.state.designSystem
                    ? this.state.designSystem
                    : DesignSystemDefaults,
        };

        return dataDictionary;
    }

    private handleUpdateDirection = (): void => {
        const updatedDirection: Direction =
            this.state.direction === Direction.ltr ? Direction.rtl : Direction.ltr;
        this.setState({
            direction: updatedDirection,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            dictionaryId: designSystemLinkedDataId,
            dataLocation: "direction",
            data: updatedDirection,
        });
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
            setViewConfigsWithCustomConfig(componentViewConfigsWithoutCustomConfig),
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

    private handleUpdateTheme = (): void => {
        const updatedTheme: StandardLuminance =
            this.state.theme === StandardLuminance.LightMode
                ? StandardLuminance.DarkMode
                : StandardLuminance.LightMode;

        this.setState({
            theme: updatedTheme,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            dictionaryId: designSystemLinkedDataId,
            dataLocation: "baseLayerLuminance",
            data: updatedTheme,
        });
    };

    private handleUpdateTransparency = (): void => {
        this.setState({
            transparentBackground: !this.state.transparentBackground,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.response,
            id: backgroundTransparency,
            value: !this.state.transparentBackground,
        } as CustomMessageIncomingOutgoing);
    };

    /**
     * Event handler for all color input changes
     */
    private handleAccentColorPickerChange = (
        e: React.FormEvent<HTMLInputElement>
    ): void => {
        const value: string = e.currentTarget.value;

        this.setState({
            accentColor: value,
        });

        const parsed: ColorRGBA64 | null = parseColor(value);
        const colorPalette = parsed !== null ? createColorPalette(parsed) : null;

        fastMessageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            dictionaryId: designSystemLinkedDataId,
            dataLocation: "accentColor",
            data: value,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            dictionaryId: designSystemLinkedDataId,
            dataLocation: "accentPalette",
            data: colorPalette,
        });
    };

    private handleDevToolsToggle = (
        e: React.MouseEvent<HTMLButtonElement>,
        props: ActionToggleProps
    ): void => {
        console.log("handle dev tools toggle");
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
