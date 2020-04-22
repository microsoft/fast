import { camelCase, get } from "lodash-es";
import {
    Canvas,
    CanvasClassNamesContract,
    Container,
    Pane,
    PaneResizeDirection,
    Row,
    RowResizeDirection,
} from "@microsoft/fast-layouts-react";
import { Form, NavigationMenu, Viewer } from "@microsoft/fast-tooling-react";
import manageJss, { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import ReactDOM from "react-dom";
import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
    designSystemSchema,
    designUnit,
    horizontalSpacing,
    neutralDividerRest,
    neutralLayerL1,
    neutralLayerL2,
    neutralLayerL3,
    outlineWidth,
} from "@microsoft/fast-components-styles-msft";
import {
    LabelClassNameContract,
    ListboxItemProps,
    TabsItem,
    TypographySize,
} from "@microsoft/fast-components-react-base";
import {
    ActionToggle,
    ActionToggleAppearance,
    ActionToggleClassNameContract,
    ActionToggleProps,
    Background,
    Heading,
    HeadingSize,
    Label,
    Pivot,
    PivotClassNameContract,
    Select,
    SelectClassNameContract,
    SelectOption,
    Toggle,
    ToggleClassNameContract,
    Typography,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import { format, multiply, toPx } from "@microsoft/fast-jss-utilities";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import {
    AjvMapper,
    DataDictionary,
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { ComponentViewConfig, Scenario } from "./utilities/configs/data.props";
import * as componentViewConfigsWithoutCustomConfig from "./utilities/configs";
import { history, menu, schemaDictionary } from "./config";
import style, { ExplorerClassNameContract } from "./explorer.style";
import { downChevron, upChevron } from "./icons/chevrons";
import {
    ExplorerHandledProps,
    ExplorerProps,
    ExplorerState,
    ExplorerUnhandledProps,
    ThemeName,
} from "./explorer.props";
import { previewReady } from "./preview";

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

const dark: string = `#333333`;
const light: string = "#FFFFFF";
export const designSystemLinkedDataId: string = "designSystem";
const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: void | MessageSystem;

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

    private canvasStyleOverrides: ComponentStyleSheet<
        CanvasClassNamesContract,
        DesignSystem
    > = {
        canvas: {
            display: "flex",
            flexDirection: "column",
        },
    };

    private checker: string =
        "url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMiAyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xIDJWMGgxdjFIMHYxaDF6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xIDJWMEgwdjFoMnYxSDF6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xNSIvPjwvc3ZnPg==')";

    private pivotStyleOverrides: ComponentStyleSheet<
        Partial<PivotClassNameContract>,
        DesignSystem
    > = {
        pivot: {
            boxSizing: "border-box",
        },
        pivot_tabList: {
            padding: format("{0} {1}", toPx(designUnit), toPx(multiply(designUnit, 2))),
        },
        pivot_activeIndicator: {
            top: "23px",
        },
        pivot_tabPanelContent: {
            padding: format("{0} {1}", toPx(designUnit), toPx(multiply(designUnit, 2))),
        },
        pivot_tabPanels: {
            borderTop: format<DesignSystem>(
                "{0} solid {1}",
                neutralDividerRest,
                toPx(outlineWidth)
            ),
        },
    };

    private devToolsToggleStyles: ComponentStyleSheet<
        ActionToggleClassNameContract,
        DesignSystem
    > = {
        actionToggle: {
            position: "absolute",
            top: toPx(designUnit),
            right: toPx(multiply(designUnit, 2)),
        },
    };

    private toggleStyleOverrides: ComponentStyleSheet<
        Partial<ToggleClassNameContract>,
        DesignSystem
    > = {
        toggle_toggleButton: {
            display: "flex",
        },
    };

    private labelStyleOverrides: ComponentStyleSheet<
        Partial<LabelClassNameContract>,
        DesignSystem
    > = {
        label: {
            margin: format("0 {0} 0 {1}", toPx(designUnit), horizontalSpacing()),
        },
    };

    private selectStyleOverrides: ComponentStyleSheet<
        Partial<SelectClassNameContract>,
        DesignSystem
    > = {
        select: {
            marginRight: "auto",
            zIndex: "1",
        },
    };

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
                dataDictionary: this.getScenarioData(
                    componentConfig,
                    selectedScenarioIndex
                ),
                schemaDictionary,
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
            theme: ThemeName.light,
            designSystem: DesignSystemDefaults,
            transparentBackground: false,
            devToolsVisible: true,
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

        const {
            explorer,
            explorer_devToolsPanel,
            explorer_navigationPanel,
            explorer_paneTitleContainer,
            explorer_propertiesPanel,
            explorer_toolbar,
            explorer_viewerRegion,
        }: Partial<ExplorerClassNameContract> = this.props.managedClasses;

        return (
            <Background value={neutralLayerL1}>
                <Container className={classNames(explorer)}>
                    <Row style={{ flex: "1" }}>
                        <Pane
                            className={classNames(explorer_navigationPanel)}
                            resizable={true}
                            resizeFrom={PaneResizeDirection.east}
                        >
                            <Background value={neutralLayerL3} drawBackground={false}>
                                <div className={classNames(explorer_paneTitleContainer)}>
                                    <Heading size={HeadingSize._6}>FAST Explorer</Heading>
                                </div>
                                <NavigationMenu
                                    menu={menu}
                                    expanded={true}
                                    activeLocation={this.state.locationPathname}
                                    onLocationUpdate={this.handleUpdateRoute}
                                />
                            </Background>
                        </Pane>
                        <Canvas jssStyleSheet={this.canvasStyleOverrides}>
                            <Row fill={true}>
                                <div style={{ overflow: "auto", width: "100%" }}>
                                    <Background
                                        value={neutralLayerL2}
                                        className={classNames(explorer_toolbar)}
                                    >
                                        {this.renderScenarioSelect()}
                                        {this.renderTransparencyToggle()}
                                        {this.renderThemeToggle()}
                                        {this.renderDirectionToggle()}
                                        {this.renderAccentColorPicker()}
                                    </Background>
                                    <div
                                        ref={this.viewerContainerRef}
                                        className={classNames(explorer_viewerRegion)}
                                    >
                                        <div
                                            style={{
                                                padding: toPx(
                                                    this.viewerContentAreaPadding
                                                ),
                                                minWidth: "fit-content",
                                            }}
                                        >
                                            <Viewer
                                                iframeSrc={"/preview"}
                                                width={this.state.width}
                                                height={this.state.height}
                                                onUpdateHeight={this.handleUpdateHeight}
                                                onUpdateWidth={this.handleUpdateWidth}
                                                responsive={true}
                                                messageSystem={
                                                    fastMessageSystem as MessageSystem
                                                }
                                            />
                                        </div>
                                    </div>
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
                                    className={classNames(explorer_devToolsPanel)}
                                >
                                    <Pivot
                                        label={"documentation"}
                                        items={this.renderPivotItems()}
                                        jssStyleSheet={this.pivotStyleOverrides}
                                    />
                                    <ActionToggle
                                        appearance={ActionToggleAppearance.stealth}
                                        selectedLabel={"Development tools expanded"}
                                        selectedGlyph={downChevron}
                                        unselectedLabel={"Development tools collapsed"}
                                        unselectedGlyph={upChevron}
                                        selected={this.state.devToolsVisible}
                                        jssStyleSheet={this.devToolsToggleStyles}
                                        onToggle={this.handleDevToolsToggle}
                                    />
                                </Background>
                            </Row>
                        </Canvas>
                        <Pane
                            className={classNames(explorer_propertiesPanel)}
                            resizable={true}
                            resizeFrom={PaneResizeDirection.west}
                        >
                            <Background value={neutralLayerL3} drawBackground={false}>
                                <Pivot
                                    label={"properties"}
                                    items={this.renderPropertyItems()}
                                    jssStyleSheet={this.pivotStyleOverrides}
                                />
                                <Form messageSystem={fastMessageSystem} />
                            </Background>
                        </Pane>
                    </Row>
                </Container>
            </Background>
        );
    }

    public componentDidMount(): void {
        this.setViewerToFullSize();
    }

    private handleMessageSystem = (e: MessageEvent): void => {
        if (e.data.type === MessageSystemType.custom && e.data.action === previewReady) {
            // TODO: investigate why this is not firing
        }
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
                    height,
                });
            }
        }
    }

    private renderAccentColorPicker(): React.ReactNode {
        const id: string = uniqueId("accent-color-picker");
        const {
            explorer_colorPicker,
            explorer_viewerControlRegion,
        }: Partial<ExplorerClassNameContract> = this.props.managedClasses;

        return (
            <div className={classNames(explorer_viewerControlRegion)}>
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    Accent color
                </Label>
                <input
                    type={"color"}
                    id={id}
                    className={classNames(explorer_colorPicker)}
                    value={this.state.designSystem.accentBaseColor}
                    onChange={this.handleAccentColorPickerChange}
                />
            </div>
        );
    }

    private renderDirectionToggle(): React.ReactNode {
        const id: string = uniqueId("direction");
        return (
            <div
                className={classNames(
                    this.props.managedClasses.explorer_viewerControlRegion
                )}
            >
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    RTL
                </Label>
                <Toggle
                    jssStyleSheet={this.toggleStyleOverrides}
                    inputId={id}
                    onClick={this.handleUpdateDirection}
                    selectedMessage={""}
                    unselectedMessage={""}
                    statusMessageId={"direction"}
                />
            </div>
        );
    }

    private renderThemeToggle(): React.ReactNode {
        const id: string = uniqueId("theme");
        return (
            <div
                className={classNames(
                    this.props.managedClasses.explorer_viewerControlRegion
                )}
            >
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    Dark mode
                </Label>
                <Toggle
                    jssStyleSheet={this.toggleStyleOverrides}
                    inputId={id}
                    onClick={this.handleUpdateTheme}
                    selectedMessage={""}
                    unselectedMessage={""}
                    statusMessageId={"theme"}
                />
            </div>
        );
    }

    private renderTransparencyToggle(): React.ReactNode {
        const id: string = uniqueId("transparency");
        return (
            <div
                className={classNames(
                    this.props.managedClasses.explorer_viewerControlRegion
                )}
            >
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    Transparent
                </Label>
                <Toggle
                    jssStyleSheet={this.toggleStyleOverrides}
                    inputId={id}
                    onClick={this.handleUpdateTransparency}
                    selectedMessage={""}
                    unselectedMessage={""}
                    statusMessageId={"transparency"}
                />
            </div>
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

    private renderPropertyItems(): TabsItem[] {
        return [
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handlePropertiesClick}
                        >
                            Properties
                        </Typography>
                    );
                },
                content: (): React.ReactNode => {
                    return null;
                },
                id: "properties",
            },
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handleDesignSystemClick}
                        >
                            Design system
                        </Typography>
                    );
                },
                content: (): React.ReactNode => {
                    return null;
                },
                id: "designSystem",
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
                    jssStyleSheet={this.selectStyleOverrides}
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

    private handleDesignSystemClick = (): void => {
        if ((window as any).Worker && fastMessageSystem) {
            fastMessageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: designSystemLinkedDataId,
                activeNavigationConfigId: "",
            });
        }
    };

    private handlePropertiesClick = (): void => {
        if ((window as any).Worker && fastMessageSystem) {
            fastMessageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: this.getScenarioData(
                    this.state.componentConfig,
                    this.state.selectedScenarioIndex
                )[1],
                activeNavigationConfigId: "",
            });
        }
    };

    private handleUpdateDirection = (): void => {
        this.setState({
            designSystem: {
                ...this.state.designSystem,
                direction:
                    this.state.designSystem.direction === Direction.ltr
                        ? Direction.rtl
                        : Direction.ltr,
            },
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
        const isLightMode: boolean = this.state.theme === ThemeName.light;
        const updatedThemeColor: string = isLightMode ? dark : light;
        const updatedLuminance: number = isLightMode
            ? StandardLuminance.DarkMode
            : StandardLuminance.LightMode;
        this.setState({
            theme: isLightMode ? ThemeName.dark : ThemeName.light,
            designSystem: {
                ...this.state.designSystem,
                baseLayerLuminance: updatedLuminance,
                backgroundColor: updatedThemeColor,
            },
        });
    };

    private handleUpdateTransparency = (): void => {
        this.setState({
            transparentBackground: !this.state.transparentBackground,
        });
    };

    /**
     * Event handler for all color input changes
     */
    private handleAccentColorPickerChange = (
        e: React.FormEvent<HTMLInputElement>
    ): void => {
        const value: string = e.currentTarget.value;
        const accentPaletteSource: ColorRGBA64 | null = parseColor(value);
        if (accentPaletteSource !== null) {
            const palette: string[] = createColorPalette(accentPaletteSource);
            this.setState({
                designSystem: {
                    ...this.state.designSystem,
                    accentBaseColor: value.toUpperCase(),
                    accentPalette: palette,
                },
            });
        }
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
