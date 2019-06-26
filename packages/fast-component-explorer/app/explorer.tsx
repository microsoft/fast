import { ExplorerHandledProps, ExplorerProps, ExplorerState } from "./explorer.props";
import style from "./explorer.style";
import { cloneDeep, get, set, uniqueId } from "lodash-es";
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
    Device,
    Display,
    Form,
    mapDataToCodePreview,
    Navigation,
    Orientation,
    Rotate,
    SelectDevice,
    Viewer,
    CSSEditor,
    NavigationMenu,
} from "@microsoft/fast-tooling-react";
import { CSSPropertyEditor } from "@microsoft/fast-tooling-react/dist/css-property-editor";
import manageJss, {
    ComponentStyleSheet,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import ReactDOM from "react-dom";
import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { getChildrenOptions, getInitialView } from "./utilities/views";
import designSystemDefaults, {
    DesignSystem,
} from "@microsoft/fast-components-styles-msft/dist/design-system";
import {
    Background,
    DarkModeBackgrounds,
    LightModeBackgrounds,
} from "@microsoft/fast-components-react-msft";
import { menu } from "./config";
import { CodePreviewChildOption } from "@microsoft/fast-tooling-react/dist/data-utilities/mapping";
import { ViewerManagedClasses } from "@microsoft/fast-tooling-react/dist/viewer/viewer/viewer.props";
import { FormClassNameContract } from "@microsoft/fast-tooling-react/dist/form/form";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import syntaxHighlighterStyles from "./syntax-highlighting-style";
import { merge } from "lodash-es";
import { history } from "./config";

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

    constructor(props: ExplorerProps) {
        super(props);

        const initialViewId: string = uniqueId("view");
        this.state = {
            xCoord: 0,
            yCoord: 0,
            dataLocation: "",
            width: defaultDevices[0].width ? defaultDevices[0].width : 500,
            height: defaultDevices[0].height ? defaultDevices[0].height : 500,
            deviceId: defaultDevices[0].id,
            orientation: Orientation.portrait,
            activeView: initialViewId,
            views: {
                [initialViewId]: getInitialView(),
            },
        };
    }

    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <Background value={this.backgrounds.L1}>
                    <Container className={get(this.props, "managedClasses.creator")}>
                        <Row style={{ flex: "1" }}>
                            <Pane>
                                <NavigationMenu
                                    menu={menu}
                                    expanded={true}
                                    onLocationUpdate={this.handleUpdateRoute}
                                />
                            </Pane>
                            <Pane
                                style={{
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    paddingTop: "4px",
                                    background: "#212121",
                                }}
                                resizable={true}
                                resizeFrom={PaneResizeDirection.east}
                            >
                                <Navigation
                                    data={
                                        this.state.views[this.state.activeView].data.props
                                    }
                                    schema={this.getSchemaById(
                                        this.state.views[this.state.activeView].data.id
                                    )}
                                    childOptions={getChildrenOptions()}
                                    onLocationUpdate={this.handleUpdateLocation}
                                    dataLocation={this.state.dataLocation}
                                    dragAndDropReordering={true}
                                    onChange={this.handleUpdateData}
                                />
                            </Pane>
                            <Canvas jssStyleSheet={this.canvasStyleOverrides}>
                                <Row fill={true}>
                                    <div style={{ width: "100%" }}>
                                        <div style={{ padding: "7px 10px" }}>
                                            <SelectDevice
                                                devices={defaultDevices}
                                                activeDeviceId={this.state.deviceId}
                                                onUpdateDevice={this.handleUpdateDevice}
                                            />
                                            &nbsp;
                                            <Rotate
                                                orientation={this.state.orientation}
                                                onUpdateOrientation={
                                                    this.handleUpdateOrientation
                                                }
                                            />
                                        </div>
                                        <Viewer
                                            iframeSrc={"/preview"}
                                            width={this.state.width}
                                            height={this.state.height}
                                            onUpdateHeight={this.handleUpdateHeight}
                                            onUpdateWidth={this.handleUpdateWidth}
                                            viewerContentProps={
                                                /* Bug here - we shouldn't need to cloneDeep but somewhere the state data is mutating */
                                                cloneDeep(
                                                    this.state.views[
                                                        this.state.activeView
                                                    ].data
                                                )
                                            }
                                            responsive={
                                                get(
                                                    this.getDeviceById(
                                                        this.state.deviceId
                                                    ),
                                                    "display"
                                                ) === Display.responsive
                                            }
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
                                        <SyntaxHighlighter
                                            language="jsx"
                                            style={syntaxHighlighterStyles}
                                        >
                                            {mapDataToCodePreview({
                                                data: this.state.views[
                                                    this.state.activeView
                                                ].data,
                                                childOptions: getChildrenOptions() as CodePreviewChildOption[],
                                            })}
                                        </SyntaxHighlighter>
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
                                        data={
                                            this.state.views[this.state.activeView].data
                                                .props
                                        }
                                        onChange={this.handleUpdateData}
                                        schema={this.getSchemaById(
                                            get(
                                                this.state.views[this.state.activeView],
                                                "data.id"
                                            )
                                        )}
                                        location={{
                                            onChange: this.handleUpdateLocation,
                                            dataLocation: this.state.dataLocation,
                                        }}
                                        childOptions={getChildrenOptions()}
                                        jssStyleSheet={this.formStyleOverrides}
                                    />
                                    {this.renderCSSEditingTools()}
                                </div>
                            </Pane>
                        </Row>
                    </Container>
                </Background>
            </DesignSystemProvider>
        );
    }

    private renderCSSEditingTools(): React.ReactNode {
        if (this.state.dataLocation.endsWith(".props")) {
            return (
                <React.Fragment>
                    {this.renderCSSEditor()}
                    {this.renderCSSPropertyEditor()}
                </React.Fragment>
            );
        }
    }

    private renderCSSEditor(): React.ReactNode {
        return (
            <CSSEditor
                jssStyleSheet={{ cssEditor: { height: "unset" } }}
                data={
                    get(
                        this.state.views,
                        `${this.state.activeView}.data.props.${this.state.dataLocation}.style`
                    ) as any
                }
                onChange={this.handleCSSUpdate}
            />
        );
    }

    private renderCSSPropertyEditor(): React.ReactNode {
        return (
            <div style={{ padding: "7px 10px" }}>
                <CSSPropertyEditor
                    data={
                        get(
                            this.state.views,
                            `${this.state.activeView}.data.props.${this.state.dataLocation}.style`
                        ) as any
                    }
                    onChange={this.handleCSSUpdate}
                />
            </div>
        );
    }

    private getSchemaById(id: string): any {
        return get(
            getChildrenOptions().find((componentOption: any): any => {
                return componentOption.schema.id === id;
            }),
            "schema"
        );
    }

    private getDeviceById(id: string): Device | void {
        return defaultDevices.find((device: Device): boolean => {
            return device.id === id;
        });
    }

    private handleCSSUpdate = (styles: any): void => {
        const updatedData: any = cloneDeep(
            get(this.state.views, `${this.state.activeView}.data.props`)
        );
        set(updatedData, `${this.state.dataLocation}.style`, styles);

        this.setState({
            views: {
                [this.state.activeView]: {
                    data: {
                        id: this.state.views[this.state.activeView].data.id,
                        props: updatedData,
                    },
                },
            },
        });
    };

    private handleUpdateDevice = (deviceId: string): void => {
        const device: Device | void = this.getDeviceById(deviceId);
        let height: number = this.state.height;
        let width: number = this.state.width;

        if (device) {
            height =
                device.display === Display.responsive
                    ? this.state.height
                    : device.display === Display.fixed &&
                      this.state.orientation === Orientation.portrait
                    ? (device.height as number)
                    : (device.width as number);
            width =
                device.display === Display.responsive
                    ? this.state.width
                    : device.display === Display.fixed &&
                      this.state.orientation === Orientation.portrait
                    ? (device.width as number)
                    : (device.height as number);
        }

        this.setState({
            deviceId,
            height,
            width,
        });
    };

    private handleUpdateData = (data: any): void => {
        this.setState(
            merge({}, this.state.views, {
                views: {
                    [this.state.activeView]: {
                        data: {
                            id: this.state.views[this.state.activeView].data.id,
                            props: data,
                        },
                    },
                },
            } as any)
        );
    };

    private handleUpdateOrientation = (orientation: Orientation): void => {
        this.setState({
            orientation,
            width: this.state.height,
            height: this.state.width,
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
        console.log("update to new route", route);
        history.push(route);
    };

    private get backgrounds(): typeof DarkModeBackgrounds | typeof LightModeBackgrounds {
        return DarkModeBackgrounds;
    }
}

export default manageJss(style)(Explorer);
