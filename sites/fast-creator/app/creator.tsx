import { memoize, uniqueId } from "lodash-es";
import {
    ActionToggle,
    ActionToggleAppearance,
    ActionToggleProps,
    Background,
} from "@microsoft/fast-components-react-msft";
import {
    neutralLayerL1,
    neutralLayerL2,
    neutralLayerL3,
} from "@microsoft/fast-components-styles-msft";
import {
    Canvas,
    Container,
    Pane,
    PaneResizeDirection,
    Row,
    RowResizeDirection,
} from "@microsoft/fast-layouts-react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Direction } from "@microsoft/fast-web-utilities";
import React from "react";
import ReactDOM from "react-dom";
import {
    AjvMapper,
    CustomMessageIncomingOutgoing,
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import { mapDataDictionaryToMonacoEditorHTML } from "@microsoft/fast-tooling/dist/data-utilities/monaco";
import {
    ControlConfig,
    ControlType,
    defaultDevices,
    Device,
    Display,
    LinkedDataControl,
    ModularForm,
    ModularNavigation,
    ModularViewer,
    SelectDevice,
    StandardControlPlugin,
    ViewerCustomAction,
} from "@microsoft/fast-tooling-react";
import {
    ControlContext,
    ControlOnChangeConfig,
} from "@microsoft/fast-tooling-react/dist/form/templates/types";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import {
    AccentColorPicker,
    Dimension,
    DirectionSwitch,
    downChevron,
    upChevron,
    fastComponentExtendedSchemas,
    Logo,
    nativeElementExtendedSchemas,
    textSchema,
    ThemeSelector,
} from "@microsoft/site-utilities";
import { fastDesignSystemDefaults } from "@microsoft/fast-components/src/fast-design-system";
import { StandardLuminance } from "@microsoft/fast-components";
import {
    CreatorHandledProps,
    CreatorProps,
    CreatorState,
    ProjectFile,
    ProjectFileView,
} from "./creator.props";
import { divTag, linkedDataExamples } from "./configs";
import { ProjectFileTransfer } from "./components";
import { selectDeviceOverrideStyles } from "./utilities/style-overrides";
import { previewReady } from "./preview";
import * as monaco from "monaco-editor";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("@microsoft/site-utilities/statics/assets/fast-inline-logo.svg");
const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;
const schemaDictionary: SchemaDictionary = {
    ...fastComponentExtendedSchemas,
    ...nativeElementExtendedSchemas,
    [textSchema.id]: textSchema,
};

export const previewDirection: string = "PREVIEW::DIRECTION";
export const previewAccentColor: string = "PREVIEW::ACCENTCOLOR";
export const previewTheme: string = "PREVIEW::THEME";

class Creator extends Foundation<CreatorHandledProps, {}, CreatorState> {
    public static displayName: string = "Creator";

    private viewerContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    private viewerContentAreaPadding: number = 20;
    private editor: monaco.editor.IStandaloneCodeEditor;
    private editorContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    private devices: Device[];

    private handleDimensionChange: (
        cb: (value: number) => void
    ) => React.ChangeEventHandler<HTMLInputElement> = memoize(
        (cb: (value: number) => void): React.ChangeEventHandler<HTMLInputElement> => {
            return (e: React.ChangeEvent<HTMLInputElement>): void => {
                const value: number = parseInt(e.target.value, 10);

                if (!isNaN(value)) {
                    cb(value);
                }
            };
        }
    );

    constructor(props: CreatorProps) {
        super(props);

        const initialViewId: string = uniqueId("view");
        const componentLinkedDataId: string = "root";

        this.devices = this.getDevices();

        const initialView: ProjectFileView = {
            dataDictionary: [
                {
                    [componentLinkedDataId]: {
                        schemaId: divTag,
                        data: {},
                    },
                },
                componentLinkedDataId,
            ],
        };

        this.state = {
            xCoord: 0,
            yCoord: 0,
            width: 0,
            height: 0,
            deviceId: this.devices[0].id,
            activeView: initialViewId,
            theme: StandardLuminance.LightMode,
            direction: Direction.ltr,
            accentColor: fastDesignSystemDefaults.accentBaseColor,
            views: {
                [initialViewId]: initialView,
            },
            activeDictionaryId: componentLinkedDataId,
            previewReady: false,
            devToolsVisible: false,
        };

        monaco.editor.onDidCreateModel(listener => {
            (monaco.editor.getModel(
                listener.uri
            ) as monaco.editor.ITextModel).onDidChangeContent(event => {
                this.editor.getAction("editor.action.formatDocument").run();
            });
        });

        if ((window as any).Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: fastMessageSystemWorker,
            });
            new AjvMapper({
                messageSystem: fastMessageSystem,
            });
            fastMessageSystem.add({ onMessage: this.handleMessageSystem });
        }
    }

    public render(): React.ReactNode {
        return (
            <Background value={neutralLayerL1}>
                <Container style={{ overflow: "hidden" }}>
                    <Row style={{ flex: "1" }}>
                        <Pane width={260}>
                            <Logo
                                backgroundColor={neutralLayerL3}
                                logo={FASTInlineLogo}
                                title={"Creator"}
                                version={"ALPHA"}
                            />
                            <ModularNavigation messageSystem={fastMessageSystem} />
                            <ProjectFileTransfer
                                projectFile={this.state}
                                onUpdateProjectFile={this.handleUpdateProjectFile}
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
                                    <SelectDevice
                                        devices={this.devices}
                                        activeDeviceId={this.state.deviceId}
                                        onUpdateDevice={this.handleUpdateDevice}
                                        jssStyleSheet={selectDeviceOverrideStyles}
                                        disabled={!this.state.previewReady}
                                    />
                                    <Dimension
                                        width={this.state.width}
                                        height={this.state.height}
                                        onUpdateWidth={this.handleUpdateWidth}
                                        onUpdateHeight={this.handleUpdateHeight}
                                        onUpdateOrientation={this.handleUpdateOrientation}
                                        onDimensionChange={this.handleDimensionChange}
                                        disabled={!this.state.previewReady}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            marginLeft: "auto",
                                        }}
                                    >
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
                                        messageSystem={fastMessageSystem}
                                        width={this.state.width}
                                        height={this.state.height}
                                        onUpdateHeight={this.handleUpdateHeight}
                                        onUpdateWidth={this.handleUpdateWidth}
                                        responsive={true}
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
                                            padding: "24px",
                                            position: "relative",
                                            height: "100%",
                                        }}
                                    >
                                        <div
                                            ref={this.editorContainerRef}
                                            style={{ height: "340px" }}
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
                            <ModularForm
                                messageSystem={fastMessageSystem}
                                controls={[
                                    new StandardControlPlugin({
                                        type: ControlType.linkedData,
                                        context: ControlContext.fill,
                                        control: (
                                            config: ControlConfig
                                        ): React.ReactNode => {
                                            return (
                                                <LinkedDataControl
                                                    {...config}
                                                    onChange={this.handleAddLinkedData(
                                                        config.onChange
                                                    )}
                                                />
                                            );
                                        },
                                    }),
                                ]}
                            />
                        </Pane>
                    </Row>
                </Container>
            </Background>
        );
    }

    private handleAddLinkedData = (onChange): ((e: ControlOnChangeConfig) => void) => {
        return (e: ControlOnChangeConfig): void => {
            onChange({
                ...e,
                value: linkedDataExamples[e.value[0].schemaId] || e.value,
            });
        };
    };

    private handleMessageSystem = (e: MessageEvent): void => {
        const updatedState: Partial<CreatorState> = {};

        if (e.data.type === MessageSystemType.data) {
            updatedState.views = {
                ...this.state.views,
                [this.state.activeView]: {
                    dataDictionary: e.data.dataDictionary,
                },
            };
            this.editor.setValue(
                mapDataDictionaryToMonacoEditorHTML(
                    e.data.dataDictionary,
                    schemaDictionary
                )
            );
        }

        if (
            e.data.type === MessageSystemType.custom &&
            e.data.action === ViewerCustomAction.response
        ) {
            if (e.data.value === previewReady) {
                fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    data: this.state.views[this.state.activeView].dataDictionary,
                    schemaDictionary,
                });
                updatedState.previewReady = true;
                this.editor.setValue(
                    mapDataDictionaryToMonacoEditorHTML(
                        this.state.views[this.state.activeView].dataDictionary,
                        schemaDictionary
                    )
                );
            } else if (e.data.value.type === MessageSystemType.navigation) {
                fastMessageSystem.postMessage(e.data.value);
            }
        }

        if (
            e.data.type === MessageSystemType.navigation &&
            e.data.action === MessageSystemNavigationTypeAction.update
        ) {
            updatedState.activeDictionaryId = e.data.activeDictionaryId;
        }

        this.setState(updatedState as CreatorState);
    };

    private handleUpdateProjectFile = (projectFile: ProjectFile): void => {
        this.setState(projectFile, () =>
            fastMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                data: projectFile.views[projectFile.activeView].dataDictionary,
                schemaDictionary,
            })
        );
    };

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
            });

            /**
             * Stop all keyboard events from bubbling
             * this prevents typing in the Monaco editor
             */
            this.editorContainerRef.current.onkeyup = e => {
                return false;
            };
            this.editorContainerRef.current.onkeypress = e => {
                return false;
            };
            this.editorContainerRef.current.onkeydown = e => {
                return false;
            };
        }
    }

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

    private getDevices(): Device[] {
        return defaultDevices.concat({
            id: "desktop",
            displayName: "Desktop (1920x1080)",
            display: Display.fixed,
            width: 1920,
            height: 1080,
        });
    }

    private getDeviceById(id: string): Device | void {
        return this.devices.find((device: Device): boolean => {
            return device.id === id;
        });
    }

    private handleUpdateDevice = (deviceId: string): void => {
        const device: Device | void = this.getDeviceById(deviceId);
        let height: number = this.state.height;
        let width: number = this.state.width;

        if (device) {
            height =
                device.display === Display.responsive
                    ? this.state.height
                    : (device.height as number);
            width =
                device.display === Display.responsive
                    ? this.state.width
                    : (device.width as number);
        }

        this.setState({
            deviceId,
            height,
            width,
        });
    };

    private handleUpdateOrientation = (): void => {
        this.setState({
            width: this.state.height,
            height: this.state.width,
        });
    };

    private setResponsiveDeviceId(): void {
        const activeDevice: Device | void = this.getDeviceById(this.state.deviceId);

        if (activeDevice && activeDevice.display !== Display.responsive) {
            this.setState({
                deviceId: Display.responsive,
            });
        }
    }

    private handleUpdateHeight = (height: number): void => {
        this.setResponsiveDeviceId();
        this.setState({
            height,
        });
    };

    private handleUpdateWidth = (width: number): void => {
        this.setResponsiveDeviceId();
        this.setState({
            width,
        });
    };

    private handleUpdateDirection = (): void => {
        const updatedDirection: Direction =
            this.state.direction === Direction.ltr ? Direction.rtl : Direction.ltr;
        this.setState({
            direction: updatedDirection,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            id: previewDirection,
            value: updatedDirection,
        } as CustomMessageIncomingOutgoing);
    };

    private handleUpdateTheme = (): void => {
        const value: StandardLuminance =
            this.state.theme === StandardLuminance.LightMode
                ? StandardLuminance.DarkMode
                : StandardLuminance.LightMode;

        this.setState({
            theme: value,
        });

        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            id: previewTheme,
            value,
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

        fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            id: previewAccentColor,
            value,
        } as CustomMessageIncomingOutgoing);
    };

    /**
     * Handle the visibility of the dev tools
     * which contains the code editor
     */
    private handleDevToolsToggle = (
        e: React.MouseEvent<HTMLButtonElement>,
        props: ActionToggleProps
    ): void => {
        this.setState({
            devToolsVisible: !props.selected,
        });
    };
}

export default Creator;
