import { memoize } from "lodash-es";
import rafThrottle from "raf-throttle";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import React from "react";
import {
    CustomMessageIncomingOutgoing,
    DataType,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import { HTMLRenderOriginatorId } from "@microsoft/fast-tooling/dist/esm/web-components/html-render/html-render";
import {
    ControlConfig,
    ControlType,
    defaultDevices,
    Display,
    LinkedDataControl,
    ModularNavigation,
    ModularViewer,
    StandardControlPlugin,
    ViewerCustomAction,
} from "@microsoft/fast-tooling-react";
import {
    ControlContext,
    ControlOnChangeConfig,
} from "@microsoft/fast-tooling-react/dist/form/templates/types";
import {
    AccentColorPicker,
    Dimension,
    DirectionSwitch,
    Editor,
    fastComponentExtendedSchemas,
    Logo,
    nativeElementExtendedSchemas,
    textSchema,
    ThemeSelector,
} from "@microsoft/site-utilities";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { monacoAdapterId } from "@microsoft/fast-tooling/dist/esm/message-system-service/monaco-adapter.service";
import { DesignSystem } from "@microsoft/fast-foundation";
import {
    baseLayerLuminance,
    fastBadge,
    fastCheckbox,
    fastNumberField,
    fastOption,
    fastSelect,
    fastSlider,
    fastSliderLabel,
    fastTab,
    fastTabPanel,
    fastTabs,
    fastTextField,
    fillColor,
    StandardLuminance,
    SwatchRGB,
} from "@microsoft/fast-components";
import { fastToolingColorPicker } from "@microsoft/fast-tooling/dist/esm/web-components";
import { CreatorState, FormId, ProjectFile } from "./creator.props";
import { linkedDataExamples } from "./configs";
import { divTag } from "./configs/library.native.tags";
import { ProjectFileTransfer } from "./components";
import { previewReady } from "./preview";
import { Footer } from "./site-footer";
import {
    renderDeviceSelect,
    renderDevToolToggle,
    renderFormTabs,
} from "./web-components";
import { Device } from "./web-components/devices";
import fastDesignSystemSchema from "./configs/library.fast.design-system.schema.json";

DesignSystem.getOrCreate().register(
    fastBadge(),
    fastCheckbox(),
    fastNumberField(),
    fastOption(),
    fastSelect(),
    fastSlider(),
    fastSliderLabel(),
    fastTabs(),
    fastTab(),
    fastTabPanel(),
    fastTextField(),
    fastToolingColorPicker({ prefix: "fast-tooling" })
);
baseLayerLuminance.setValueFor(document.body, StandardLuminance.DarkMode);
fillColor.setValueFor(
    document.body,
    SwatchRGB.create(
        StandardLuminance.DarkMode,
        StandardLuminance.DarkMode,
        StandardLuminance.DarkMode
    )
);

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("@microsoft/site-utilities/statics/assets/fast-inline-logo.svg");
const schemaDictionary: SchemaDictionary = {
    ...fastComponentExtendedSchemas,
    ...nativeElementExtendedSchemas,
    [fastDesignSystemSchema.id]: fastDesignSystemSchema,
    [textSchema.id]: textSchema,
};

export const previewAccentColor: string = "PREVIEW::ACCENTCOLOR";
export const defaultElementDataId: string = "root";

class Creator extends Editor<{}, CreatorState> {
    public static displayName: string = "Creator";

    public viewerContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    public editorContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private windowResizing: number;
    private devices: Device[];
    private linkedDataControl = new StandardControlPlugin({
        type: ControlType.linkedData,
        context: ControlContext.fill,
        control: (config: ControlConfig): React.ReactNode => {
            return (
                <LinkedDataControl
                    {...config}
                    onChange={this.handleAddLinkedData(config.onChange)}
                />
            );
        },
    });

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

    constructor(props: {}) {
        super(props);

        const designSystemLinkedDataId: string = "design-system";

        this.devices = this.getDevices();

        if ((window as any).Worker) {
            this.fastMessageSystem.add({ onMessage: this.handleMessageSystem });
            this.fastDesignMessageSystem.add({
                onMessage: this.handleDesignSystemMessageSystem,
            });
        }

        window.onresize = rafThrottle(this.handleWindowResize);
        window.addEventListener("message", this.handleWindowMessage);

        this.setupMonacoEditor(monaco);

        this.state = {
            xCoord: 0,
            yCoord: 0,
            viewerWidth: 0,
            viewerHeight: 0,
            deviceId: this.devices[0].id,
            theme: StandardLuminance.LightMode,
            direction: Direction.ltr,
            accentColor: "",
            activeDictionaryId: defaultElementDataId,
            previewReady: false,
            devToolsVisible: true,
            mobileFormVisible: false,
            mobileNavigationVisible: false,
            activeFormId: FormId.component,
            designSystemDataDictionary: [
                {
                    [designSystemLinkedDataId]: {
                        schemaId: "fastDesignTokens",
                        data: {
                            "accent-base-color": "#DA1A5F",
                            direction: Direction.ltr,
                            theme: StandardLuminance.LightMode,
                        },
                    },
                },
                designSystemLinkedDataId,
            ],
            dataDictionary: [
                {
                    [defaultElementDataId]: {
                        schemaId: divTag,
                        data: {},
                    },
                },
                defaultElementDataId,
            ],
            transparentBackground: false,
            lastMappedDataDictionaryToMonacoEditorHTMLValue: "",
        };
    }

    public render(): React.ReactNode {
        const accentColor: string = (this.state.designSystemDataDictionary[0][
            "design-system"
        ].data as any)["accent-base-color"];
        const direction: Direction = (this.state.designSystemDataDictionary[0][
            "design-system"
        ].data as any)["direction"];
        return (
            <div
                className={this.getContainerClassNames()}
                style={{ gridTemplateColumns: "260px auto 280px" }}
            >
                <div className={this.paneStartClassNames}>
                    <Logo
                        className={this.logoClassNames}
                        logo={FASTInlineLogo}
                        title={"Creator"}
                        version={"ALPHA"}
                    />
                    <div style={{ height: "calc(100% - 48px)" }}>
                        <ModularNavigation
                            messageSystem={this.fastMessageSystem}
                            types={[DataType.object]}
                        />
                    </div>
                    <ProjectFileTransfer
                        projectFile={this.state}
                        onUpdateProjectFile={this.handleUpdateProjectFile}
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
                        <fast-design-system-provider background-color="#333">
                            <div className={this.canvasMenuBarClassNames}>
                                {renderDeviceSelect(
                                    this.state.deviceId,
                                    this.handleUpdateDevice,
                                    !this.state.previewReady
                                )}
                                <Dimension
                                    width={this.state.viewerWidth}
                                    height={this.state.viewerHeight}
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
                                        direction={direction}
                                        onUpdateDirection={this.handleUpdateDirection}
                                        disabled={!this.state.previewReady}
                                    />
                                    <AccentColorPicker
                                        id={"accent-color-picker"}
                                        accentBaseColor={
                                            accentColor !== undefined
                                                ? accentColor
                                                : "#DA1A5F"
                                        }
                                        onAccentColorPickerChange={
                                            this.handleAccentColorPickerChange
                                        }
                                        disabled={!this.state.previewReady}
                                    />
                                </div>
                            </div>
                        </fast-design-system-provider>
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
                                messageSystem={this.fastMessageSystem}
                                width={this.state.viewerWidth}
                                height={this.state.viewerHeight}
                                onUpdateHeight={this.onUpdateHeight}
                                onUpdateWidth={this.onUpdateWidth}
                                responsive={true}
                            />
                        </div>
                        <div className={"dev-tools"}>
                            <div
                                ref={this.editorContainerRef}
                                style={{ height: "100%", paddingTop: "24px" }}
                            />
                            {renderDevToolToggle(
                                this.state.devToolsVisible,
                                this.handleDevToolsToggle
                            )}
                        </div>
                    </div>
                </div>
                <div className={this.paneEndClassNames}>
                    {renderFormTabs(
                        this.state.activeFormId,
                        this.fastMessageSystem,
                        this.fastDesignMessageSystem,
                        this.linkedDataControl,
                        this.handleFormVisibility,
                        this.updateDesignSystemDataDictionaryState
                    )}
                </div>
                <Footer />
            </div>
        );
    }

    private handleFormVisibility = (formId): void => {
        this.setState({
            activeFormId: formId,
        });
    };

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
        if (
            e.data.type === MessageSystemType.custom &&
            e.data.action === ViewerCustomAction.response
        ) {
            if (e.data.value === previewReady) {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.state.dataDictionary,
                    schemaDictionary,
                });
                this.fastDesignMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.state.designSystemDataDictionary,
                    schemaDictionary,
                });
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.custom,
                    originatorId: "design-system",
                    data: this.state.designSystemDataDictionary[0]["design-system"].data,
                } as CustomMessageIncomingOutgoing<any>);
                updatedState.previewReady = true;
                this.updateEditorContent(this.state.dataDictionary);
            } else {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId:
                        e.data.value === "" ? this.state.dataDictionary[1] : e.data.value,
                    activeNavigationConfigId: "",
                    options: {
                        originatorId: HTMLRenderOriginatorId,
                    },
                });
            }
        }

        if (
            e.data.type === MessageSystemType.data ||
            e.data.type === MessageSystemType.initialize
        ) {
            updatedState.dataDictionary = e.data.dataDictionary;

            if (!e.data.options || e.data.options.originatorId !== monacoAdapterId) {
                this.updateEditorContent(e.data.dataDictionary);
            }
        }

        this.setState(updatedState as CreatorState);
    };

    private handleDesignSystemMessageSystem = (e: MessageEvent): void => {
        if (e.data.type === MessageSystemType.data) {
            this.updateDesignSystemDataDictionaryState(e.data.data);
        }
    };

    private handleWindowMessage = (e: MessageEvent): void => {
        if (e.data) {
            try {
                const messageData = JSON.parse(e.data);

                if (messageData.type === "dataDictionary" && messageData.data) {
                    this.fastMessageSystem.postMessage({
                        type: MessageSystemType.initialize,
                        data: messageData.data,
                        schemaDictionary,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    private handleUpdateProjectFile = (projectFile: ProjectFile): void => {
        this.setState(projectFile, () =>
            this.fastMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                data: projectFile.dataDictionary,
                schemaDictionary,
            })
        );
    };

    private handleWindowResize = (): void => {
        if (this.editorContainerRef.current) {
            if (this.windowResizing) {
                clearTimeout(this.windowResizing);
            }

            this.windowResizing = window.setTimeout(() => {
                this.setState({
                    viewerWidth: 0,
                    viewerHeight: 0,
                });

                this.setViewerToFullSize();
                this.updateMonacoEditor();
            });
        }
    };

    public componentDidMount(): void {
        this.setViewerToFullSize();
        this.updateMonacoEditor();
    }

    private updateMonacoEditor = (): void => {
        this.createMonacoEditor(monaco);

        if (this.editorContainerRef.current && this.editor) {
            this.editor.layout();
        }
    };

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
        let viewerHeight: number = this.state.viewerHeight;
        let viewerWidth: number = this.state.viewerWidth;

        if (device) {
            viewerHeight =
                device.display === Display.responsive
                    ? this.state.viewerHeight
                    : (device.height as number);
            viewerWidth =
                device.display === Display.responsive
                    ? this.state.viewerWidth
                    : (device.width as number);
        }

        this.setState({
            deviceId,
            viewerHeight,
            viewerWidth,
        });
    };

    private handleUpdateOrientation = (): void => {
        this.setState({
            viewerWidth: this.state.viewerHeight,
            viewerHeight: this.state.viewerWidth,
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

    public onUpdateHeight = (viewerHeight: number): void => {
        this.handleUpdateHeight(viewerHeight);
        this.setResponsiveDeviceId();
    };

    public onUpdateWidth = (viewerWidth: number): void => {
        this.handleUpdateWidth(viewerWidth);
        this.setResponsiveDeviceId();
    };

    private updateDesignSystemDataDictionaryState = (newData: {
        [key: string]: unknown;
    }): void => {
        this.setState(
            {
                designSystemDataDictionary: [
                    {
                        ["design-system"]: {
                            schemaId: this.state.designSystemDataDictionary[0][
                                "design-system"
                            ].schemaId,
                            data: {
                                ...(this.state.designSystemDataDictionary[0][
                                    "design-system"
                                ] as any).data,
                                ...newData,
                            },
                        },
                    },
                    "design-system",
                ],
            },
            () => {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.custom,
                    originatorId: "design-system",
                    data: this.state.designSystemDataDictionary[0]["design-system"].data,
                } as CustomMessageIncomingOutgoing<any>);
                this.fastDesignMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.state.designSystemDataDictionary,
                    schemaDictionary,
                });
            }
        );
    };

    /**
     * Event handler for accent color input changes
     */
    private handleAccentColorPickerChange = (
        e: React.FormEvent<HTMLInputElement>
    ): void => {
        const value: string = e.currentTarget.value;
        this.updateDesignSystemDataDictionaryState({ "accent-base-color": value });
    };

    /**
     * Event handler for theme changes
     */
    public handleUpdateTheme = (): void => {
        const updatedTheme: StandardLuminance =
            this.state.theme === StandardLuminance.DarkMode
                ? StandardLuminance.LightMode
                : StandardLuminance.DarkMode;

        this.setState({
            theme: updatedTheme,
        });

        this.updateDesignSystemDataDictionaryState({
            theme: updatedTheme,
        });
    };

    /**
     * Event handler for direction changes
     */
    public handleUpdateDirection = (): void => {
        const updatedDirection: Direction =
            (this.state.designSystemDataDictionary[0]["design-system"].data as any)[
                "direction"
            ] === Direction.ltr
                ? Direction.rtl
                : Direction.ltr;

        this.updateDesignSystemDataDictionaryState({ direction: updatedDirection });
    };

    /**
     * Handle the visibility of the dev tools
     * which contains the code editor
     */
    private handleDevToolsToggle = (): void => {
        this.setState(
            {
                devToolsVisible: !this.state.devToolsVisible,
            },
            () => {
                this.setViewerToFullSize();
                this.updateMonacoEditor();
            }
        );
    };
}

export default Creator;
