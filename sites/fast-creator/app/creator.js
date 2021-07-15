import { memoize } from "lodash-es";
import rafThrottle from "raf-throttle";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import React from "react";
import {
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import { HTMLRenderOriginatorId } from "@microsoft/fast-tooling/dist/esm/web-components/html-render/html-render";
import {
    ControlType,
    defaultDevices,
    Display,
    LinkedDataControl,
    ModularViewer,
    StandardControlPlugin,
    ViewerCustomAction,
} from "@microsoft/fast-tooling-react";
import { ControlContext } from "@microsoft/fast-tooling-react/dist/form/templates/types";
import {
    AccentColorPicker,
    Dimension,
    DirectionSwitch,
    Editor,
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
import { FormId, NavigationId } from "./creator.props";
import { elementLibraries, elementLibraryContents } from "./configs";
import { divTag } from "./configs/library.native.tags";
import { ProjectFileTransfer } from "./components";
import { previewReady } from "./preview/preview";
import { Footer } from "./site-footer";
import {
    renderDeviceSelect,
    renderDevToolToggle,
    renderFormTabs,
    renderNavigationTabs,
    renderPreviewSwitch,
} from "./web-components";
import fastDesignTokensSchema from "./configs/library.fast.design-tokens.schema.json";
import {
    creatorOriginatorId,
    CustomMessageSystemActions,
    designTokensLinkedDataId,
    DisplayMode,
    displayModeMessageInteractive,
    displayModeMessagePreview,
    previewOriginatorId,
    rootOriginatorId,
} from "./utilities";
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
const schemaDictionary = Object.assign(Object.assign({}, nativeElementExtendedSchemas), {
    [fastDesignTokensSchema.id]: fastDesignTokensSchema,
    [textSchema.id]: textSchema,
});
export const previewAccentColor = "PREVIEW::ACCENTCOLOR";
export const defaultElementDataId = "root";
class Creator extends Editor {
    constructor(props) {
        super(props);
        this.viewerContainerRef = React.createRef();
        this.editorContainerRef = React.createRef();
        this.linkedDataControl = new StandardControlPlugin({
            type: ControlType.linkedData,
            context: ControlContext.fill,
            control: config => {
                return (
                    <LinkedDataControl
                        {...config}
                        onChange={this.handleAddLinkedData(config.onChange)}
                    />
                );
            },
        });
        this.handleDimensionChange = memoize(cb => {
            return e => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                    cb(value);
                }
            };
        });
        this.handleNavigationVisibility = navigationId => {
            this.setState({
                activeNavigationId: navigationId,
            });
        };
        this.handleFormVisibility = formId => {
            this.setState({
                activeFormId: formId,
            });
        };
        this.handleAddLibrary = libraryId => {
            this.fastMessageSystem.postMessage({
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                options: {
                    originatorId: rootOriginatorId,
                },
                data: {
                    action: CustomMessageSystemActions.libraryAdd,
                    id: libraryId,
                },
            });
        };
        this.handleLibraryAdded = libraryId => {
            this.setState(
                {
                    addedLibraries: this.state.addedLibraries.concat([libraryId]),
                },
                () => {
                    this.fastMessageSystem.postMessage({
                        type: MessageSystemType.schemaDictionary,
                        action: MessageSystemSchemaDictionaryTypeAction.add,
                        schemas: Object.values(
                            elementLibraries[libraryId].componentDictionary
                        ).map(componentDictionaryItem => {
                            return componentDictionaryItem.schema;
                        }),
                    });
                }
            );
        };
        this.handleAddLinkedData = onChange => {
            return e => {
                Object.entries(elementLibraryContents).forEach(
                    ([elementLibraryId, schemaIds]) => {
                        if (schemaIds.includes(e.value[0].schemaId)) {
                            onChange(
                                Object.assign(Object.assign({}, e), {
                                    value:
                                        [
                                            elementLibraries[elementLibraryId]
                                                .componentDictionary[e.value[0].schemaId]
                                                .example,
                                        ] || e.value,
                                })
                            );
                        }
                    }
                );
            };
        };
        this.handleMessageSystem = e => {
            const updatedState = {};
            if (
                e.data.type === MessageSystemType.custom &&
                e.data.action === ViewerCustomAction.response
            ) {
                if (
                    e.data &&
                    e.data.options &&
                    e.data.options.originatorId === previewOriginatorId
                ) {
                    this.handleLibraryAdded(e.data.data.id);
                } else if (e.data.value && e.data.value === previewReady) {
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
                        originatorId: designTokensLinkedDataId,
                        data: this.state.designSystemDataDictionary[0][
                            designTokensLinkedDataId
                        ].data,
                    });
                    updatedState.previewReady = true;
                    this.updateEditorContent(this.state.dataDictionary);
                } else if (e.data.value) {
                    this.fastMessageSystem.postMessage({
                        type: MessageSystemType.navigation,
                        action: MessageSystemNavigationTypeAction.update,
                        activeDictionaryId:
                            e.data.value === ""
                                ? this.state.dataDictionary[1]
                                : e.data.value,
                        activeNavigationConfigId: "",
                        options: {
                            originatorId: HTMLRenderOriginatorId,
                        },
                    });
                } else if (e.data.data) {
                    this.fastMessageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        data: e.data.data,
                        dataLocation: "",
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
            this.setState(updatedState);
        };
        this.handleDesignSystemMessageSystem = e => {
            if (e.data.type === MessageSystemType.data) {
                this.updateDesignSystemDataDictionaryState(e.data.data);
            }
        };
        this.handleWindowMessage = e => {
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
        this.handleUpdateProjectFile = projectFile => {
            this.setState(projectFile, () =>
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    data: projectFile.dataDictionary,
                    schemaDictionary,
                })
            );
        };
        this.handleWindowResize = () => {
            if (this.editorContainerRef.current) {
                if (this.windowResizing) {
                    clearTimeout(this.windowResizing);
                }
                this.windowResizing = window.setTimeout(() => {
                    const device = this.getDeviceById(this.state.deviceId);
                    if (device && device.display === Display.responsive) {
                        this.setState({
                            viewerWidth: 0,
                            viewerHeight: 0,
                        });
                        this.setViewerToFullSize();
                    }
                    this.updateMonacoEditor();
                });
            }
        };
        this.updateMonacoEditor = () => {
            this.createMonacoEditor(monaco);
            if (this.editorContainerRef.current && this.editor) {
                this.editor.layout();
            }
        };
        this.handleUpdateDevice = deviceId => {
            const device = this.getDeviceById(deviceId);
            if (device) {
                if (
                    device.display === Display.responsive &&
                    this.state.deviceId !== Display.responsive
                ) {
                    // if we are changing from a fixed device to response then trigger a window resize event
                    // to reset the size of the viewer.
                    this.setState(
                        {
                            deviceId,
                        },
                        () => {
                            this.handleWindowResize();
                        }
                    );
                } else {
                    const viewerHeight = device.height;
                    const viewerWidth = device.width;
                    this.setState({
                        deviceId,
                        viewerHeight,
                        viewerWidth,
                    });
                }
            }
        };
        this.handleUpdateOrientation = () => {
            this.setState({
                viewerWidth: this.state.viewerHeight,
                viewerHeight: this.state.viewerWidth,
            });
        };
        this.onUpdateHeight = viewerHeight => {
            this.setResponsiveDeviceId();
            this.handleUpdateHeight(viewerHeight);
        };
        this.onUpdateWidth = viewerWidth => {
            this.setResponsiveDeviceId();
            this.handleUpdateWidth(viewerWidth);
        };
        this.updateDesignSystemDataDictionaryState = newData => {
            this.setState(
                {
                    designSystemDataDictionary: [
                        {
                            [designTokensLinkedDataId]: {
                                schemaId: this.state.designSystemDataDictionary[0][
                                    designTokensLinkedDataId
                                ].schemaId,
                                data: Object.assign(
                                    Object.assign(
                                        {},
                                        this.state.designSystemDataDictionary[0][
                                            designTokensLinkedDataId
                                        ].data
                                    ),
                                    newData
                                ),
                            },
                        },
                        designTokensLinkedDataId,
                    ],
                },
                () => {
                    this.fastMessageSystem.postMessage({
                        type: MessageSystemType.custom,
                        originatorId: designTokensLinkedDataId,
                        data: this.state.designSystemDataDictionary[0][
                            designTokensLinkedDataId
                        ].data,
                    });
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
        this.handleAccentColorPickerChange = e => {
            const value = e.currentTarget.value;
            this.updateDesignSystemDataDictionaryState({ "accent-base-color": value });
        };
        /**
         * Event handler for theme changes
         */
        this.handleUpdateTheme = () => {
            const updatedTheme =
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
        this.handleUpdateDirection = () => {
            const updatedDirection =
                this.state.designSystemDataDictionary[0][designTokensLinkedDataId].data[
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
        this.handleDevToolsToggle = () => {
            this.setState(
                {
                    devToolsVisible: !this.state.devToolsVisible,
                },
                () => {
                    const device = this.getDeviceById(this.state.deviceId);
                    if (device && device.display === Display.responsive) {
                        this.setViewerToFullSize();
                    }
                    this.updateMonacoEditor();
                }
            );
        };
        /**
         * Handle the preview mode switch change event
         * @param newState - The new state of the switch
         */
        this.handlePreviewModeSwitch = newState => {
            this.setState(
                {
                    displayMode: newState ? DisplayMode.preview : DisplayMode.interactive,
                },
                () => {
                    // Send message
                    this.fastMessageSystem.postMessage({
                        type: MessageSystemType.custom,
                        options: {
                            originatorId: creatorOriginatorId,
                            action: newState
                                ? displayModeMessagePreview
                                : displayModeMessageInteractive,
                        },
                    });
                    this.handleWindowResize();
                }
            );
        };
        this.devices = this.getDevices();
        if (window.Worker) {
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
            activeNavigationId: NavigationId.navigation,
            addedLibraries: [],
            designSystemDataDictionary: [
                {
                    [designTokensLinkedDataId]: {
                        schemaId: "fastDesignTokens",
                        data: {
                            "accent-base-color": "#DA1A5F",
                            direction: Direction.ltr,
                            theme: StandardLuminance.LightMode,
                        },
                    },
                },
                designTokensLinkedDataId,
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
            displayMode: DisplayMode.interactive,
        };
    }
    render() {
        const accentColor = this.state.designSystemDataDictionary[0][
            designTokensLinkedDataId
        ].data["accent-base-color"];
        const direction = this.state.designSystemDataDictionary[0][
            designTokensLinkedDataId
        ].data["direction"];
        return (
            <div
                className={this.getContainerClassNames()}
                style={{
                    gridTemplateColumns:
                        this.state.displayMode === DisplayMode.interactive
                            ? "260px auto 280px"
                            : "0px auto 0px",
                }}
            >
                <div className={this.paneStartClassNames}>
                    <Logo
                        className={this.logoClassNames}
                        logo={FASTInlineLogo}
                        title={"Creator"}
                        version={"ALPHA"}
                    />
                    <div style={{ height: "calc(100% - 48px)" }}>
                        {renderNavigationTabs(
                            this.state.activeNavigationId,
                            this.fastMessageSystem,
                            this.state.addedLibraries,
                            this.handleAddLibrary,
                            this.handleNavigationVisibility
                        )}
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
                        <div className={this.canvasMenuBarClassNames}>
                            {renderDeviceSelect(
                                this.state.deviceId,
                                this.handleUpdateDevice,
                                !this.state.previewReady
                            )}
                            <Dimension
                                width={this.state.viewerWidth}
                                height={this.state.viewerHeight}
                                onUpdateWidth={this.onUpdateWidth}
                                onUpdateHeight={this.onUpdateHeight}
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
                                {renderPreviewSwitch(
                                    this.state.displayMode === DisplayMode.preview,
                                    this.handlePreviewModeSwitch,
                                    !this.state.previewReady
                                )}
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
                    </div>
                    <div
                        className={classNames(
                            this.canvasContentClassNames,
                            [
                                "canvas-content__dev-tools-hidden",
                                !this.state.devToolsVisible,
                            ],
                            [
                                "canvas-content__preview",
                                this.state.displayMode === DisplayMode.preview,
                            ]
                        )}
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
                                preview={this.state.displayMode === DisplayMode.preview}
                            />
                        </div>
                        <div
                            className={classNames("dev-tools", [
                                "preview",
                                this.state.displayMode === DisplayMode.preview,
                            ])}
                        >
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
    componentDidMount() {
        this.setViewerToFullSize();
        this.updateMonacoEditor();
    }
    getDevices() {
        return defaultDevices.concat({
            id: "desktop",
            displayName: "Desktop (1920x1080)",
            display: Display.fixed,
            width: 1920,
            height: 1080,
        });
    }
    getDeviceById(id) {
        return this.devices.find(device => {
            return device.id === id;
        });
    }
    setResponsiveDeviceId() {
        const activeDevice = this.getDeviceById(this.state.deviceId);
        if (activeDevice && activeDevice.display !== Display.responsive) {
            this.setState({
                deviceId: Display.responsive,
            });
        }
    }
}
Creator.displayName = "Creator";
export default Creator;
