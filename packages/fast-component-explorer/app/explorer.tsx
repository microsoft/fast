import {
    ComponentProps,
    ExplorerHandledProps,
    ExplorerProps,
    ExplorerState,
} from "./explorer.props";
import { CodePreviewChildOption } from "@microsoft/fast-tooling-react/dist/data-utilities/mapping";
import { camelCase, get, memoize } from "lodash-es";
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
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { TabsItem } from "@microsoft/fast-components-react-base";
import style from "./explorer.style";
import {
    Background,
    DarkModeBackgrounds,
    LightModeBackgrounds,
    Pivot,
    PivotClassNameContract,
} from "@microsoft/fast-components-react-msft";
import { ViewerManagedClasses } from "@microsoft/fast-tooling-react/dist/viewer/viewer/viewer.props";
import {
    FormChildOptionItem,
    FormClassNameContract,
} from "@microsoft/fast-tooling-react/dist/form/form";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import syntaxHighlighterStyles from "./syntax-highlighting-style";
import { childOptions, history, menu } from "./config";
import * as componentViewConfigs from "./utilities/configs";
import { Scenario } from "./utilities/configs/data.props";
import { MemoizedFunction } from "lodash";
import { Direction } from "@microsoft/fast-web-utilities";

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
            padding: "0 12px",
            height: "calc(100% - 32px)",
        },
    };

    private resolveSchemaById: ((id: string) => any) & MemoizedFunction;

    constructor(props: ExplorerProps) {
        super(props);

        this.resolveSchemaById = memoize(this.getSchemaById);
        this.state = {
            dataLocation: "",
            width: defaultDevices[0].width ? defaultDevices[0].width : 500,
            height: defaultDevices[0].height ? defaultDevices[0].height : 500,
            scenario: this.getScenarioData(),
            viewConfig: {
                direction: Direction.ltr,
            },
        };
    }

    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={DesignSystemDefaults}>
                <Background value={this.backgrounds.L1}>
                    <Container className={get(this.props, "managedClasses.explorer")}>
                        <Row style={{ flex: "1" }}>
                            <Pane>
                                <NavigationMenu
                                    menu={menu}
                                    expanded={true}
                                    onLocationUpdate={this.handleUpdateRoute}
                                />
                            </Pane>
                            <Canvas jssStyleSheet={this.canvasStyleOverrides}>
                                <Row fill={true}>
                                    <div style={{ width: "100%" }}>
                                        <div style={{ padding: "7px 10px" }}>
                                            {this.renderScenarioSelect()}
                                            {this.renderDirectionToggle()}
                                        </div>
                                        {this.renderViewer()}
                                    </div>
                                </Row>
                                <Row
                                    resizable={true}
                                    resizeFrom={RowResizeDirection.north}
                                    initialHeight={400}
                                >
                                    <Background
                                        value={this.backgrounds.L4}
                                        style={{ width: "100%" }}
                                    >
                                        <Pivot
                                            label={"documentation"}
                                            items={this.renderPivotItems()}
                                            jssStyleSheet={this.pivotStyleOverrides}
                                        />
                                    </Background>
                                </Row>
                            </Canvas>
                            <Pane resizable={true} resizeFrom={PaneResizeDirection.west}>
                                <div
                                    style={{
                                        overflow: "auto",
                                        minHeight: "100%",
                                        background: "#212121",
                                    }}
                                >
                                    {this.renderForm()}
                                </div>
                            </Pane>
                        </Row>
                    </Container>
                </Background>
            </DesignSystemProvider>
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

    private renderDirectionToggle(): React.ReactNode {
        return (
            <button onClick={this.handleUpdateDirection}>
                {this.state.viewConfig.direction}
            </button>
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
                    const paths: string[] = this.getPaths();
                    const currentComponentIndex: number = paths.length - 1;
                    const Guidance: React.ComponentClass = get(
                        componentViewConfigs,
                        `${camelCase(paths[currentComponentIndex])}Config.guidance`,
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
        const paths: string[] = this.getPaths();
        const scenarioOptions: Array<Scenario<any>> = get(
            componentViewConfigs[`${camelCase(paths[paths.length - 1])}Config`],
            "scenarios"
        );

        if (Array.isArray(scenarioOptions)) {
            return (
                <select onChange={this.handleUpdateScenario}>
                    {this.renderScenarioOptions(scenarioOptions)}
                </select>
            );
        }
    }

    private renderScenarioOptions(
        scenarioOptions: Array<Scenario<any>>
    ): React.ReactNode {
        return scenarioOptions.map((scenarioOption: Scenario<any>, index: number) => {
            return (
                <option key={scenarioOption.displayName} value={index}>
                    {scenarioOption.displayName}
                </option>
            );
        });
    }

    private getPaths(): string[] {
        return get(this.props, "location.pathname", "").split("/");
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

    private getScenarioData<T>(index?: number): ComponentProps<T> | void {
        const paths: string[] = this.getPaths();
        const currentComponentIndex: number = paths.length - 1;

        // cloning when the scenario data is fetched as there appears to be
        // a mutation happening in one of the Form
        return {
            id: get(
                componentViewConfigs[`${camelCase(paths[currentComponentIndex])}Config`],
                "schema.id"
            ),
            props:
                typeof index === "number"
                    ? get(
                          componentViewConfigs,
                          `${camelCase(
                              paths[currentComponentIndex]
                          )}Config.scenarios[${index}].data`,
                          {}
                      )
                    : get(
                          componentViewConfigs,
                          `${camelCase(
                              paths[currentComponentIndex]
                          )}Config.scenarios[0].data`,
                          {}
                      ),
        };
    }

    private handleUpdateDirection = (): void => {
        this.setState({
            // The viewConfig only contains the direction,
            // if more items are added to the viewConfig use merge
            viewConfig: {
                direction:
                    this.state.viewConfig.direction === Direction.ltr
                        ? Direction.rtl
                        : Direction.ltr,
            },
        });
    };

    private handleUpdateScenario = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            scenario: this.getScenarioData(parseInt(e.target.value, 10)),
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

    private handleUpdateHeight = (height: number): void => {
        this.setState({
            height,
        });
    };

    private handleUpdateWidth = (width: number): void => {
        this.setState({
            width,
        });
    };

    private handleUpdateLocation = (dataLocation: string): void => {
        this.setState({
            dataLocation,
        });
    };

    private handleUpdateRoute = (route: string): void => {
        history.push(route);
    };

    private get backgrounds(): typeof DarkModeBackgrounds | typeof LightModeBackgrounds {
        return DarkModeBackgrounds;
    }
}

export default manageJss(style)(Explorer);
