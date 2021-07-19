import React from "react";
import ReactDOM from "react-dom";
import { html_beautify } from "vscode-html-languageservice/lib/esm/beautify/beautify-html";
import { mapDataDictionaryToMonacoEditorHTML } from "@microsoft/fast-tooling/dist/esm/data-utilities/monaco";
import {
    AjvMapper,
    CustomMessage,
    DataDictionary,
    MessageSystem,
    MessageSystemType,
    MonacoAdapter,
    MonacoAdapterAction,
    MonacoAdapterActionCallbackConfig,
} from "@microsoft/fast-tooling";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
// This is only used as a typescript reference, the actual monaco import must
// be passed from the derived class or it will cause import issues
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { StandardLuminance } from "@microsoft/fast-components";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { schemaDictionary } from "../../schemas";
import { EditorState } from "./editor.props";

export const previewBackgroundTransparency: string = "PREVIEW::TRANSPARENCY";
export const previewDirection: string = "PREVIEW::DIRECTION";
export const previewTheme: string = "PREVIEW::THEME";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
const fastDesignMessageSystemWorker = new FASTMessageSystemWorker();

abstract class Editor<P, S extends EditorState> extends React.Component<P, S> {
    public editor: monaco.editor.IStandaloneCodeEditor;
    public abstract editorContainerRef: React.RefObject<HTMLDivElement>;
    public abstract viewerContainerRef: React.RefObject<HTMLDivElement>;
    public viewerContentAreaPadding: number = 20;
    public maxViewerHeight: number = 0;
    public maxViewerWidth: number = 0;
    public fastMessageSystem: MessageSystem;
    public fastDesignMessageSystem: MessageSystem;
    // This is the current monaco editor models string value
    public monacoValue: string[];
    public paneStartClassNames: string = "pane pane__start";
    public paneEndClassNames: string = "pane pane__end";
    public viewerClassNames: string = "preview";
    public canvasContentClassNames: string = "canvas-content";
    public menuItemRegionClassNames: string = "menu-item-region";
    public canvasMenuBarClassNames: string = "canvas-menu-bar";
    public mobileMenuBarClassNames: string = "mobile-menu-bar";
    public logoClassNames: string = "logo";
    public navigationClassNames: string = "navigation";
    public canvasClassNames: string = "canvas";
    public menuBarClassNames: string = "menu-bar";
    private adapter: MonacoAdapter;
    private monacoEditorModel: monaco.editor.ITextModel;
    private firstRun: boolean = true;

    constructor(props: P) {
        super(props);

        if ((window as any).Worker) {
            this.fastMessageSystem = new MessageSystem({
                webWorker: fastMessageSystemWorker,
            });
            this.fastDesignMessageSystem = new MessageSystem({
                webWorker: fastDesignMessageSystemWorker,
            });
            new AjvMapper({
                messageSystem: this.fastDesignMessageSystem,
            });
            new AjvMapper({
                messageSystem: this.fastMessageSystem,
            });
        }

        this.monacoValue = [];

        this.adapter = new MonacoAdapter({
            messageSystem: this.fastMessageSystem,
            actions: [
                new MonacoAdapterAction({
                    id: "monaco.setValue",
                    action: (config: MonacoAdapterActionCallbackConfig): void => {
                        // trigger an update to the monaco value that
                        // also updates the DataDictionary which fires a
                        // postMessage to the MessageSystem if the udpate
                        // is coming from Monaco and not a data dictionary update
                        config.updateMonacoModelValue(
                            this.monacoValue,
                            this.state.lastMappedDataDictionaryToMonacoEditorHTMLValue ===
                                this.monacoValue[0]
                        );
                    },
                }),
            ],
        });
    }

    public setupMonacoEditor = (monacoRef: any): void => {
        monacoRef.editor.onDidCreateModel((listener: monaco.editor.ITextModel) => {
            this.monacoEditorModel = monacoRef.editor.getModel(
                listener.uri
            ) as monaco.editor.ITextModel;

            this.monacoEditorModel.onDidChangeContent(
                (e: monaco.editor.IModelContentChangedEvent) => {
                    /**
                     * Sets the value to be used by monaco
                     */
                    if (this.state.previewReady) {
                        const modelValue = this.monacoEditorModel.getValue();
                        this.monacoValue = Array.isArray(modelValue)
                            ? modelValue
                            : [modelValue];

                        if (!this.firstRun) {
                            this.adapter.action("monaco.setValue").run();
                        }

                        this.firstRun = false;
                    }
                }
            );
        });
    };

    public createMonacoEditor = (
        monacoRef: any,
        alternateContainerRef?: HTMLElement
    ): void => {
        if ((alternateContainerRef || this.editorContainerRef.current) && !this.editor) {
            this.editor = monacoRef.editor.create(
                alternateContainerRef
                    ? alternateContainerRef
                    : this.editorContainerRef.current,
                {
                    value: "",
                    language: "html",
                    formatOnPaste: true,
                    lineNumbers: "off",
                    theme: "vs-dark",
                    wordWrap: "on",
                    wordWrapColumn: 80,
                    wordWrapMinified: true,
                    wrappingIndent: "same",
                    minimap: {
                        showSlider: "mouseover",
                    },
                }
            );

            this.updateEditorContent(this.state.dataDictionary);
        }
    };

    public updateEditorContent(dataDictionary: DataDictionary<unknown>): void {
        if (this.editor) {
            const lastMappedDataDictionaryToMonacoEditorHTMLValue = html_beautify(
                mapDataDictionaryToMonacoEditorHTML(dataDictionary, schemaDictionary)
            );

            this.setState(
                {
                    lastMappedDataDictionaryToMonacoEditorHTMLValue,
                },
                () => {
                    this.editor.setValue(lastMappedDataDictionaryToMonacoEditorHTMLValue);
                }
            );
        }
    }

    public setViewerToFullSize(alternateContainerRef?: HTMLElement): void {
        const viewerContainer: HTMLElement | null = alternateContainerRef
            ? alternateContainerRef
            : this.viewerContainerRef.current;

        if (viewerContainer) {
            /* eslint-disable-next-line react/no-find-dom-node */
            const viewerNode: Element | Text | null = ReactDOM.findDOMNode(
                viewerContainer
            );

            if (viewerNode instanceof Element) {
                // 24 is height of view label
                this.maxViewerHeight =
                    viewerNode.clientHeight - this.viewerContentAreaPadding * 2 - 24;
                this.maxViewerWidth =
                    viewerNode.clientWidth - this.viewerContentAreaPadding * 2;

                this.setState({
                    viewerWidth: this.maxViewerWidth,
                    viewerHeight: this.maxViewerHeight,
                });
            }
        }
    }

    public getContainerClassNames(): string {
        return classNames(
            "container",
            ["container__form-visible", this.state.mobileFormVisible],
            ["container__navigation-visible", this.state.mobileNavigationVisible]
        );
    }

    public getCanvasOverlayClassNames(): string {
        return classNames("canvas-overlay", [
            "canvas-overlay__active",
            this.state.mobileFormVisible || this.state.mobileNavigationVisible,
        ]);
    }

    public handleCanvasOverlayTrigger = (): void => {
        this.setState({
            mobileFormVisible: false,
            mobileNavigationVisible: false,
        });
    };

    public handleMobileNavigationTrigger = (): void => {
        this.setState({
            mobileNavigationVisible: true,
        });
    };

    public handleMobileFormTrigger = (): void => {
        this.setState({
            mobileFormVisible: true,
        });
    };

    public handleUpdateTheme = (): void => {
        const updatedTheme: StandardLuminance =
            this.state.theme === StandardLuminance.DarkMode
                ? StandardLuminance.LightMode
                : StandardLuminance.DarkMode;

        this.setState({
            theme: updatedTheme,
        });

        this.fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.response,
            id: previewTheme,
            value: updatedTheme,
        } as CustomMessage<{}, {}>);
    };

    public handleUpdateDirection = (): void => {
        const updatedDirection: Direction =
            this.state.direction === Direction.ltr ? Direction.rtl : Direction.ltr;
        this.setState({
            direction: updatedDirection,
        });

        this.fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.response,
            id: previewDirection,
            value: updatedDirection,
        } as CustomMessage<{}, {}>);
    };

    public handleUpdateTransparency = (): void => {
        this.setState({
            transparentBackground: !this.state.transparentBackground,
        });

        this.fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.response,
            id: previewBackgroundTransparency,
            value: !this.state.transparentBackground,
        } as CustomMessage<{}, {}>);
    };

    public handleUpdateHeight = (updatedHeight: number): void => {
        this.setState({
            viewerHeight:
                updatedHeight > this.maxViewerHeight
                    ? this.maxViewerHeight
                    : updatedHeight,
        });
    };

    public handleUpdateWidth = (updatedWidth: number): void => {
        this.setState({
            viewerWidth:
                updatedWidth > this.maxViewerWidth ? this.maxViewerWidth : updatedWidth,
        });
    };

    public renderCanvasOverlay(): React.ReactNode {
        return (
            <div
                className={this.getCanvasOverlayClassNames()}
                onClick={this.handleCanvasOverlayTrigger}
            ></div>
        );
    }

    public renderMobileNavigationTrigger(): React.ReactNode {
        return (
            <button
                className={"mobile-pane-trigger"}
                onClick={this.handleMobileNavigationTrigger}
            >
                <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="16" height="1" rx="0.5" fill="white" />
                    <rect y="7" width="16" height="1" rx="0.5" fill="white" />
                    <rect y="14" width="16" height="1" rx="0.5" fill="white" />
                </svg>
            </button>
        );
    }

    public renderMobileFormTrigger(): React.ReactNode {
        return (
            <button
                className={"mobile-pane-trigger"}
                onClick={this.handleMobileFormTrigger}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16.5253 1.47498C17.6898 2.63953 17.6898 4.52764 16.5253 5.69219L6.55167 15.6658C6.32095 15.8965 6.034 16.0631 5.71919 16.1489L1.45612 17.3116C0.989558 17.4388 0.56145 17.0107 0.688694 16.5441L1.85135 12.2811C1.93721 11.9663 2.10373 11.6793 2.33446 11.4486L12.3081 1.47498C13.4726 0.310424 15.3607 0.310424 16.5253 1.47498ZM11.5001 4.05073L3.21834 12.3325C3.14143 12.4094 3.08592 12.505 3.05731 12.61L2.18243 15.8178L5.3903 14.943C5.49523 14.9143 5.59088 14.8588 5.66779 14.7819L13.9493 6.4999L11.5001 4.05073ZM13.1919 2.35886L12.3835 3.16656L14.8326 5.61656L15.6414 4.80831C16.3178 4.13191 16.3178 3.03526 15.6414 2.35886C14.965 1.68246 13.8683 1.68246 13.1919 2.35886Z"
                        fill="white"
                    />
                </svg>
            </button>
        );
    }
}

export { Editor, EditorState };
