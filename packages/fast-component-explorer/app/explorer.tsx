import {
    ComponentProps,
    ExplorerHandledProps,
    ExplorerProps,
    ExplorerState,
    Theme,
    ThemeName,
} from "./explorer.props";
import { CodePreviewChildOption } from "@microsoft/fast-tooling-react/dist/data-utilities/mapping";
import { camelCase, get, memoize, merge } from "lodash-es";
import {
    Canvas,
    CanvasClassNamesContract,
    Container,
    Pane,
    PaneResizeDirection,
    Row,
    RowResizeDirection,
} from "@microsoft/fast-layouts-react";
import {
    defaultDevices,
    Form,
    mapDataToCodePreview,
    NavigationMenu,
    Viewer,
} from "@microsoft/fast-tooling-react";
import manageJss, {
    ComponentStyleSheet,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import ReactDOM from "react-dom";
import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
    designUnit,
    height,
    horizontalSpacing,
    neutralLayerL1,
    neutralLayerL2,
    neutralLayerL3,
} from "@microsoft/fast-components-styles-msft";
import {
    LabelClassNameContract,
    ListboxItemProps,
    TabsItem,
} from "@microsoft/fast-components-react-base";
import style from "./explorer.style";
import {
    Background,
    DarkModeBackgrounds,
    Label,
    LightModeBackgrounds,
    Pivot,
    PivotClassNameContract,
    Select,
    SelectOption,
    Toggle,
    ToggleClassNameContract,
} from "@microsoft/fast-components-react-msft";
import { ViewerManagedClasses } from "@microsoft/fast-tooling-react/dist/viewer/viewer/viewer.props";
import {
    FormChildOptionItem,
    FormClassNameContract,
} from "@microsoft/fast-tooling-react/dist/form/form";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import syntaxHighlighterStyles from "./syntax-highlighting-style";
import { childOptions, history, menu } from "./config";
import * as componentViewConfigs from "./utilities/configs";
import { Scenario } from "./utilities/configs/data.props";
import { MemoizedFunction, uniqueId } from "lodash";
import { Direction, format } from "@microsoft/fast-web-utilities";
import {
    ColorHSL,
    ColorRGBA64,
    hslToRGB,
    parseColor,
    rgbToHSL,
} from "@microsoft/fast-colors";
import { toPx } from "@microsoft/fast-jss-utilities";

const dark: string = "#111111";
const light: string = "#FFFFFF";

class Explorer extends Foundation<ExplorerHandledProps, {}, ExplorerState> {
    public static displayName: string = "Explorer";

    protected handledProps: HandledProps<ExplorerHandledProps> = {
        managedClasses: void 0,
    };

    private canvasStyleOverrides: ComponentStyleSheet<
        CanvasClassNamesContract,
        DesignSystem
    > = {
        canvas: {
            display: "flex",
            flexDirection: "column",
        },
    };

    private viewerStyleOverrides: ComponentStyleSheet<
        ViewerManagedClasses,
        DesignSystem
    > = {
        viewer: {
            height: "calc(100% - 80px)",
        },
    };

    private formStyleOverrides: ComponentStyleSheet<
        Partial<FormClassNameContract>,
        DesignSystem
    > = {
        form: {
            height: "unset",
            background: "unset",
        },
    };

    private navigationMenuStyleOverrides: any = {
        navigationMenu: {
            background: "unset",
        },
    };

    private pivotStyleOverrides: ComponentStyleSheet<
        Partial<PivotClassNameContract>,
        DesignSystem
    > = {
        pivot: {
            height: "100%",
        },
        pivot_tabPanels: {
            overflow: "auto",
            padding: (designSystem: DesignSystem): string => {
                return format("0 {0}", horizontalSpacing()(designSystem));
            },
            height: (designSystem: DesignSystem): string => {
                return format("calc(100% - {0})", height()(designSystem));
            },
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
            margin: (designSystem: DesignSystem): string => {
                return format(
                    "0 {0} 0 {1}",
                    toPx(designUnit)(designSystem),
                    horizontalSpacing()(designSystem)
                );
            },
        },
    };

    private resolveSchemaById: ((id: string) => any) & MemoizedFunction;

    constructor(props: ExplorerProps) {
        super(props);

        const locationPathname: string = get(this.props, "location.pathname", "");

        this.resolveSchemaById = memoize(this.getSchemaById);

        this.state = {
            dataLocation: "",
            width: defaultDevices[0].width ? defaultDevices[0].width : 500,
            height: defaultDevices[0].height ? defaultDevices[0].height : 500,
            scenario: this.getScenarioData(
                this.getComponentNameSpinalCaseByPath(locationPathname)
            ),
            locationPathname,
            theme: ThemeName.light,
            viewConfig: DesignSystemDefaults,
        };
    }

    public render(): React.ReactNode {
        if (typeof get(this.state, "scenario.id") === "undefined") {
            return (
                <div>
                    <h1>404 - This page does not exist</h1>
                    <a href={"/"}>Go to a valid page</a>
                </div>
            );
        }

        return (
            <Background value={neutralLayerL1}>
                <Container className={get(this.props, "managedClasses.explorer")}>
                    <Row style={{ flex: "1" }}>
                        <Pane
                            className={get(
                                this.props,
                                "managedClasses.explorer_navigationPanel"
                            )}
                            resizable={true}
                            resizeFrom={PaneResizeDirection.east}
                        >
                            <Background value={neutralLayerL3} drawBackground={false}>
                                <div
                                    className={get(
                                        this.props,
                                        "managedClasses.explorer_paneTitleContainer"
                                    )}
                                >
                                    <Label>Component Explorer</Label>
                                </div>
                                <NavigationMenu
                                    menu={menu}
                                    expanded={true}
                                    onLocationUpdate={this.handleUpdateRoute}
                                    jssStyleSheet={this.navigationMenuStyleOverrides}
                                />
                            </Background>
                        </Pane>
                        <Canvas jssStyleSheet={this.canvasStyleOverrides}>
                            <Row fill={true}>
                                <div
                                    className={get(
                                        this.props,
                                        "managedClasses.explorer_viewerRegion"
                                    )}
                                >
                                    <Background
                                        value={neutralLayerL2}
                                        className={get(
                                            this.props,
                                            "managedClasses.explorer_toolbar"
                                        )}
                                    >
                                        {this.renderScenarioSelect()}
                                        {this.renderThemeToggle()}
                                        {this.renderDirectionToggle()}
                                        {this.renderAccentColorPicker()}
                                    </Background>
                                    {this.renderViewer()}
                                </div>
                            </Row>
                            <Row
                                resizable={true}
                                resizeFrom={RowResizeDirection.north}
                                initialHeight={400}
                            >
                                <Background
                                    value={neutralLayerL2}
                                    className={get(
                                        this.props,
                                        "managedClasses.explorer_devToolsPanel"
                                    )}
                                >
                                    <Pivot
                                        label={"documentation"}
                                        items={this.renderPivotItems()}
                                        jssStyleSheet={this.pivotStyleOverrides}
                                    />
                                </Background>
                            </Row>
                        </Canvas>
                        <Pane
                            className={get(
                                this.props,
                                "managedClasses.explorer_propertiesPanel"
                            )}
                            resizable={true}
                            resizeFrom={PaneResizeDirection.west}
                        >
                            <Background value={neutralLayerL3}>
                                <div
                                    className={get(
                                        this.props,
                                        "managedClasses.explorer_paneTitleContainer"
                                    )}
                                >
                                    <Label>Properties</Label>
                                </div>
                                {this.renderForm()}
                            </Background>
                        </Pane>
                    </Row>
                </Container>
            </Background>
        );
    }

    private renderViewer(): React.ReactNode {
        return (
            <Viewer
                iframeSrc={"/preview"}
                iframePostMessage={this.state.viewConfig}
                width={this.state.width}
                height={this.state.height}
                onUpdateHeight={this.handleUpdateHeight}
                onUpdateWidth={this.handleUpdateWidth}
                viewerContentProps={this.state.scenario}
                responsive={true}
                jssStyleSheet={this.viewerStyleOverrides}
            />
        );
    }

    private renderForm(): React.ReactNode {
        const schema: any = this.resolveSchemaById(get(this.state.scenario, "id"));

        if (typeof schema !== "undefined") {
            return (
                <Form
                    data={get(this.state.scenario, "props")}
                    onChange={this.handleUpdateData}
                    schema={schema}
                    location={{
                        onChange: this.handleUpdateLocation,
                        dataLocation: this.state.dataLocation,
                    }}
                    childOptions={childOptions}
                    jssStyleSheet={this.formStyleOverrides}
                />
            );
        }
    }

    private renderAccentColorPicker(): React.ReactNode {
        const id: string = uniqueId("accent-color-picker");
        return (
            <div
                className={get(this.props, "managedClasses.explorer_viewerControlRegion")}
            >
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    Accent color
                </Label>
                <input
                    type={"color"}
                    id={id}
                    className={get(this.props, "managedClasses.explorer_colorPicker")}
                    value={this.state.viewConfig.accentBaseColor}
                    onChange={this.handleAccentColorPickerChange}
                />
            </div>
        );
    }

    private renderDirectionToggle(): React.ReactNode {
        const id: string = uniqueId("direction");
        return (
            <div
                className={get(this.props, "managedClasses.explorer_viewerControlRegion")}
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
                className={get(this.props, "managedClasses.explorer_viewerControlRegion")}
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

    private renderPivotItems(): TabsItem[] {
        return [
            {
                tab: (className: string): React.ReactNode => "Code Preview",
                content: (className: string): React.ReactNode => {
                    return (
                        <div className={className}>
                            <SyntaxHighlighter
                                language="jsx"
                                style={syntaxHighlighterStyles}
                            >
                                {this.getCodePreview()}
                            </SyntaxHighlighter>
                        </div>
                    );
                },
                id: "codePreview",
            },
            {
                tab: (className: string): React.ReactNode => "Guidance",
                content: (className: string): React.ReactNode => {
                    const componentName: string = this.getComponentNameSpinalCaseByPath(
                        this.state.locationPathname
                    );
                    const Guidance: React.ComponentClass = get(
                        componentViewConfigs,
                        `${camelCase(componentName)}Config.guidance`,
                        null
                    );

                    return (
                        <div className={className}>
                            <Guidance />
                        </div>
                    );
                },
                id: "guidance",
            },
            {
                tab: (className: string): React.ReactNode => "Schema",
                content: (className: string): React.ReactNode => {
                    const schema: any = this.resolveSchemaById(
                        get(this.state.scenario, "id")
                    );

                    if (typeof schema !== "undefined") {
                        return (
                            <div className={className}>
                                <pre>{JSON.stringify(schema, null, 2)}</pre>
                            </div>
                        );
                    }
                },
                id: "schema",
            },
        ];
    }

    private renderScenarioSelect(): React.ReactNode {
        const componentName: string = this.getComponentNameSpinalCaseByPath(
            this.state.locationPathname
        );
        const scenarioOptions: Array<Scenario<any>> = get(
            componentViewConfigs[`${camelCase(componentName)}Config`],
            "scenarios"
        );

        if (Array.isArray(scenarioOptions)) {
            return (
                <Select
                    onValueChange={this.handleUpdateScenario}
                    defaultSelection={[scenarioOptions[0].displayName]}
                >
                    {this.renderScenarioOptions(scenarioOptions)}
                </Select>
            );
        }
    }

    private renderScenarioOptions(
        scenarioOptions: Array<Scenario<any>>
    ): React.ReactNode {
        return scenarioOptions.map((scenarioOption: Scenario<any>, index: number) => {
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

    private getSchemaById(id: string): any | void {
        const childOption: FormChildOptionItem | void = childOptions.find(
            (componentOption: any): any => {
                return get(componentOption, "schema.id") === id;
            }
        );

        if (typeof childOption !== "undefined") {
            return get(childOption, "schema");
        }
    }

    private getCodePreview(): string | null {
        return typeof this.state.scenario !== "undefined" &&
            Array.isArray(childOptions) &&
            childOptions.length > 0
            ? mapDataToCodePreview({
                  data: this.state.scenario,
                  childOptions: childOptions as CodePreviewChildOption[],
              })
            : null;
    }

    private getScenarioData<T>(
        componentName: string,
        index?: number
    ): ComponentProps<T> | void {
        // cloning when the scenario data is fetched as there appears to be
        // a mutation happening in one of the Form
        return {
            id: get(
                componentViewConfigs[`${camelCase(componentName)}Config`],
                "schema.id"
            ),
            props:
                typeof index === "number"
                    ? get(
                          componentViewConfigs,
                          `${camelCase(componentName)}Config.scenarios[${index}].data`,
                          {}
                      )
                    : get(
                          componentViewConfigs,
                          `${camelCase(componentName)}Config.scenarios[0].data`,
                          {}
                      ),
        };
    }

    private handleUpdateDirection = (): void => {
        this.setState({
            viewConfig: Object.assign({}, this.state.viewConfig, {
                direction:
                    this.state.viewConfig.direction === Direction.ltr
                        ? Direction.rtl
                        : Direction.ltr,
            }),
        });
    };

    private handleUpdateScenario = (
        newValue: string | string[],
        selectedItems: ListboxItemProps[],
        displayString: string
    ): void => {
        this.setState({
            scenario: this.getScenarioData(
                this.getComponentNameSpinalCaseByPath(this.state.locationPathname),
                parseInt(selectedItems[0].value, 10)
            ),
        });
    };

    private handleUpdateData = (data: any): void => {
        this.setState({
            scenario: {
                id: get(this.state.scenario, "id"),
                props: data,
            },
        });
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

    private handleUpdateLocation = (dataLocation: string): void => {
        this.setState({
            dataLocation,
        });
    };

    private handleUpdateRoute = (route: string): void => {
        this.setState(
            {
                locationPathname: route,
                scenario: this.getScenarioData(
                    this.getComponentNameSpinalCaseByPath(route)
                ),
            },
            () => {
                history.push(route);
            }
        );
    };

    private handleUpdateTheme = (): void => {
        const isLightTheme: boolean = this.state.theme === ThemeName.light;
        const updatedThemeColor: string = isLightTheme ? dark : light;
        this.setState({
            theme: isLightTheme ? ThemeName.dark : ThemeName.light,
            viewConfig: merge({}, this.state.viewConfig, {
                backgroundColor: updatedThemeColor,
            }),
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
            const palette: any = createColorPalette(accentPaletteSource);
            this.setState({
                viewConfig: merge({}, this.state.viewConfig, {
                    accentBaseColor: value.toUpperCase(),
                    accentPalette: palette,
                }),
            });
        }
    };
}

export default manageJss(style)(Explorer);
