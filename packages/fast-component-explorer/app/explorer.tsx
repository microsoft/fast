import {
    ComponentProps,
    ExplorerHandledProps,
    ExplorerProps,
    ExplorerState,
} from "./explorer.props";
import style from "./explorer.style";
import { camelCase, cloneDeep, get, memoize } from "lodash-es";
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
    Viewer,
    NavigationMenu,
} from "@microsoft/fast-tooling-react";
import manageJss, {
    ComponentStyleSheet,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import ReactDOM from "react-dom";
import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import designSystemDefaults, {
    DesignSystem,
} from "@microsoft/fast-components-styles-msft/dist/design-system";
import { TabsItem } from "@microsoft/fast-components-react-base";
import {
    Background,
    DarkModeBackgrounds,
    LightModeBackgrounds,
    Pivot,
} from "@microsoft/fast-components-react-msft";
import { CodePreviewChildOption } from "@microsoft/fast-tooling-react/dist/data-utilities/mapping";
import { ViewerManagedClasses } from "@microsoft/fast-tooling-react/dist/viewer/viewer/viewer.props";
import { FormClassNameContract } from "@microsoft/fast-tooling-react/dist/form/form";
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

    private resolveSchemaById: ((id: string) => any) & MemoizedFunction;

    constructor(props: ExplorerProps) {
        super(props);

        this.resolveSchemaById = memoize(this.getSchemaById);
        this.state = {
            xCoord: 0,
            yCoord: 0,
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
            <DesignSystemProvider designSystem={designSystemDefaults}>
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
                                            jssStyleSheet={{
                                                pivot: {
                                                    height: "100%",
                                                },
                                                pivot_tabPanels: {
                                                    height: "100%",
                                                    overflow: "auto",
                                                },
                                            }}
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
                                    <Form
                                        data={this.state.scenario.props}
                                        onChange={this.handleUpdateData}
                                        schema={this.resolveSchemaById(
                                            get(this.state.scenario, "id")
                                        )}
                                        location={{
                                            onChange: this.handleUpdateLocation,
                                            dataLocation: this.state.dataLocation,
                                        }}
                                        childOptions={childOptions}
                                        jssStyleSheet={this.formStyleOverrides}
                                    />
                                </div>
                            </Pane>
                        </Row>
                    </Container>
                </Background>
            </DesignSystemProvider>
        );
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
                                {mapDataToCodePreview({
                                    data: this.state.scenario,
                                    childOptions: childOptions as CodePreviewChildOption[],
                                })}
                            </SyntaxHighlighter>
                        </div>
                    );
                },
                id: "codePreview",
            },
            {
                tab: (className: string): React.ReactNode => "Guidance",
                content: (className: string): React.ReactNode => "world 2",
                id: "guidance",
            },
            {
                tab: (className: string): React.ReactNode => "Schema",
                content: (className: string): React.ReactNode => {
                    return (
                        <div className={className}>
                            <pre>
                                {JSON.stringify(
                                    this.resolveSchemaById(
                                        get(this.state.scenario, "id")
                                    ),
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    );
                },
                id: "schema",
            },
        ];
    }

    private renderScenarioSelect(): React.ReactNode {
        const paths: string[] = get(this.props, "location.pathname").split("/");
        const scenarioOptions: Scenario<any>[] =
            componentViewConfigs[`${camelCase(paths[paths.length - 1])}Config`].scenarios;

        if (Array.isArray(scenarioOptions)) {
            return (
                <select onChange={this.handleUpdateScenario}>
                    {this.renderScenarioOptions(scenarioOptions)}
                </select>
            );
        }
    }

    private renderScenarioOptions(scenarioOptions: Scenario<any>[]): React.ReactNode {
        return scenarioOptions.map((scenarioOption: Scenario<any>, index: number) => {
            return (
                <option key={scenarioOption.displayName} value={index}>
                    {scenarioOption.displayName}
                </option>
            );
        });
    }

    private getSchemaById(id: string): any {
        return get(
            childOptions.find((componentOption: any): any => {
                return componentOption.schema.id === id;
            }),
            "schema"
        );
    }

    private getScenarioData(index?: number): ComponentProps {
        const paths: string[] = get(this.props, "location.pathname").split("/");
        const currentComponentIndex: number = paths.length - 1;

        // cloning when the scenario data is fetched as there appears to be
        // a mutation happening in one of the Form
        return {
            id:
                componentViewConfigs[`${camelCase(paths[currentComponentIndex])}Config`]
                    .schema.id,
            props:
                typeof index === "number"
                    ? cloneDeep(
                          get(
                              componentViewConfigs,
                              `${camelCase(
                                  paths[currentComponentIndex]
                              )}Config.scenarios[${index}].data`,
                              {}
                          )
                      )
                    : cloneDeep(
                          get(
                              componentViewConfigs,
                              `${camelCase(
                                  paths[currentComponentIndex]
                              )}Config.scenarios[0].data`,
                              {}
                          )
                      ),
        };
    }

    private handleUpdateDirection = (): void => {
        this.setState({
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
                id: this.state.scenario.id,
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
