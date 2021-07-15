var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import {
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import { HTMLRenderOriginatorId } from "@microsoft/fast-tooling/dist/esm/web-components/html-render/html-render";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
import {
    fastComponentDefinitions,
    nativeElementDefinitions,
} from "@microsoft/site-utilities";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import {
    mapFASTComponentsDesignSystem,
    setupFASTComponentDesignSystem,
} from "../configs/library.fast.design-system.mapping";
import { elementLibraries } from "../configs";
import {
    creatorOriginatorId,
    CustomMessageSystemActions,
    designTokensLinkedDataId,
    DisplayMode,
    displayModeMessageInteractive,
    displayModeMessagePreview,
    previewOriginatorId,
} from "../utilities";
import { HTMLRenderReact } from "./web-components";
const style = document.createElement("style");
style.innerText =
    "body, html { width:100%; height:100%; overflow-x:initial; } #root {height:100%} ";
document.head.appendChild(style);
export const previewReady = "PREVIEW::READY";
class Preview extends Foundation {
    constructor(props) {
        super(props);
        this.htmlRenderMessageSystemWorker = new FASTMessageSystemWorker();
        this.handleMessage = message =>
            __awaiter(this, void 0, void 0, function* () {
                if (message.origin === location.origin) {
                    let messageData;
                    try {
                        messageData = JSON.parse(message.data);
                    } catch (e) {
                        return;
                    }
                    if (
                        messageData !== undefined &&
                        (!messageData.options ||
                            messageData.options.originatorId !== "preview")
                    ) {
                        switch (messageData.type) {
                            case MessageSystemType.initialize:
                                this.setState(
                                    {
                                        dataDictionary: messageData.dataDictionary,
                                        schemaDictionary: messageData.schemaDictionary,
                                        activeDictionaryId:
                                            messageData.activeDictionaryId,
                                    },
                                    this.updateDOM(messageData)
                                );
                                break;
                            case MessageSystemType.data:
                                this.setState(
                                    {
                                        dataDictionary: messageData.dataDictionary,
                                    },
                                    this.updateDOM(messageData)
                                );
                                break;
                            case MessageSystemType.navigation:
                                if (
                                    !messageData.options ||
                                    messageData.options.originatorId !==
                                        HTMLRenderOriginatorId
                                )
                                    this.setState(
                                        {
                                            activeDictionaryId:
                                                messageData.activeDictionaryId,
                                        },
                                        this.updateDOM(messageData)
                                    );
                                break;
                            case MessageSystemType.schemaDictionary:
                                this.setState({
                                    schemaDictionary: messageData.schemaDictionary,
                                });
                                break;
                            case MessageSystemType.custom:
                                if (
                                    messageData.originatorId === designTokensLinkedDataId
                                ) {
                                    const updatedDesignSystemDataDictionary =
                                        this.state.designSystemDataDictionary &&
                                        this.state.designSystemDataDictionary[0][
                                            designTokensLinkedDataId
                                        ].data
                                            ? [
                                                  {
                                                      [designTokensLinkedDataId]: {
                                                          schemaId: this.state
                                                              .designSystemDataDictionary[0][
                                                              designTokensLinkedDataId
                                                          ].schemaId,
                                                          data: Object.assign(
                                                              {},
                                                              messageData.data
                                                          ),
                                                      },
                                                  },
                                                  designTokensLinkedDataId,
                                              ]
                                            : [
                                                  {
                                                      [designTokensLinkedDataId]: {
                                                          schemaId: "fastDesignTokens",
                                                          data: Object.assign(
                                                              {},
                                                              messageData.data
                                                          ),
                                                      },
                                                  },
                                                  designTokensLinkedDataId,
                                              ];
                                    this.setState(
                                        {
                                            designSystemDataDictionary: updatedDesignSystemDataDictionary,
                                        },
                                        this.updateDOM(messageData)
                                    );
                                } else if (
                                    messageData.data &&
                                    messageData.data.action ===
                                        CustomMessageSystemActions.libraryAdd
                                ) {
                                    // Import the web component library
                                    yield elementLibraries[messageData.data.id].import();
                                    // Register elements from the web component library
                                    elementLibraries[messageData.data.id].register();
                                    window.postMessage(
                                        {
                                            type: MessageSystemType.custom,
                                            action: ViewerCustomAction.call,
                                            options: {
                                                originatorId: previewOriginatorId,
                                            },
                                            data: {
                                                action:
                                                    CustomMessageSystemActions.libraryAdded,
                                                id: messageData.data.id,
                                            },
                                        },
                                        "*"
                                    );
                                } else if (
                                    messageData.options &&
                                    messageData.options.originatorId ===
                                        creatorOriginatorId
                                ) {
                                    const action = messageData.options.action.split("::");
                                    if (action[0] === "displayMode") {
                                        const mode =
                                            action[1] === "preview"
                                                ? DisplayMode.preview
                                                : DisplayMode.interactive;
                                        this.setState({ displayMode: mode });
                                        this.state.htmlRenderMessageSystem.postMessage({
                                            type: MessageSystemType.custom,
                                            options: {
                                                originatorId: creatorOriginatorId,
                                                action:
                                                    mode === DisplayMode.preview
                                                        ? displayModeMessagePreview
                                                        : displayModeMessageInteractive,
                                            },
                                        });
                                    }
                                }
                                break;
                        }
                    }
                }
            });
        this.handleHtmlMessageSystem = message => {
            if (message.data) {
                if (
                    message.data.type === MessageSystemType.navigation &&
                    message.data.action === MessageSystemNavigationTypeAction.update &&
                    message.data.options &&
                    message.data.options.originatorId === HTMLRenderOriginatorId
                ) {
                    this.setState({
                        activeDictionaryId: message.data.activeDictionaryId,
                    });
                    window.postMessage(
                        {
                            type: MessageSystemType.custom,
                            action: ViewerCustomAction.call,
                            value: message.data.activeDictionaryId,
                        },
                        "*"
                    );
                } else if (
                    message.data.type === MessageSystemType.data &&
                    message.data.action === MessageSystemNavigationTypeAction.update &&
                    message.data.options &&
                    message.data.options.originatorId === HTMLRenderOriginatorId
                ) {
                    window.postMessage(
                        {
                            type: MessageSystemType.custom,
                            action: ViewerCustomAction.call,
                            data: message.data.data,
                        },
                        "*"
                    );
                }
            }
        };
        this.ref = React.createRef();
        this.renderRef = React.createRef();
        this.activeDictionaryItemWrapperRef = React.createRef();
        this.state = {
            activeDictionaryId: "",
            dataDictionary: void 0,
            schemaDictionary: {},
            designSystemDataDictionary: void 0,
            htmlRenderMessageSystem: new MessageSystem({
                webWorker: this.htmlRenderMessageSystemWorker,
            }),
            htmlRenderReady: false,
            displayMode: DisplayMode.interactive,
        };
        setupFASTComponentDesignSystem(document.body);
        this.state.htmlRenderMessageSystem.add({
            onMessage: this.handleHtmlMessageSystem,
        });
        window.addEventListener("message", this.handleMessage);
    }
    render() {
        if (this.state.dataDictionary !== undefined) {
            const directionValue =
                this.state.designSystemDataDictionary &&
                this.state.designSystemDataDictionary[0][designTokensLinkedDataId].data &&
                this.state.designSystemDataDictionary[0][designTokensLinkedDataId].data[
                    "direction"
                ]
                    ? this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                          .data["direction"]
                    : Direction.ltr;
            return (
                <React.Fragment>
                    <div
                        className={classNames("preview", [
                            "previewMode",
                            this.state.displayMode === DisplayMode.preview,
                        ])}
                        dir={directionValue}
                        ref={this.ref}
                    >
                        <HTMLRenderReact ref={this.renderRef} />
                        <div />
                    </div>
                    <div ref={this.activeDictionaryItemWrapperRef}>
                        <div />
                    </div>
                </React.Fragment>
            );
        }
        return null;
    }
    componentDidMount() {
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                value: previewReady,
            },
            "*"
        );
    }
    /**
     * Sets up the DOM with quick exit cases
     * if another request is performed.
     */
    attachMappedComponents() {
        if (this.renderRef.current !== null && !this.state.htmlRenderReady) {
            this.renderRef.current.renderRef.messageSystem = this.state.htmlRenderMessageSystem;
            this.renderRef.current.renderRef.markupDefinitions = Object.assign(
                Object.assign({}, fastComponentDefinitions),
                nativeElementDefinitions
            );
            this.setState({ htmlRenderReady: true });
        }
        if (this.state.dataDictionary !== undefined && this.renderRef.current !== null) {
            if (
                this.state.designSystemDataDictionary &&
                this.state.designSystemDataDictionary[0][designTokensLinkedDataId].data
            ) {
                mapFASTComponentsDesignSystem(
                    document.body,
                    this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                        .data
                );
            }
        }
    }
    attachComponentsAndInit() {
        this.attachMappedComponents();
        if (this.state.dataDictionary !== undefined) {
            this.state.htmlRenderMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary: this.state.dataDictionary,
                schemaDictionary: this.state.schemaDictionary,
            });
            if (this.state.activeDictionaryId) {
                this.state.htmlRenderMessageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: this.state.activeDictionaryId,
                    options: {
                        originatorId: "preview",
                    },
                    activeNavigationConfigId: "",
                });
            }
        }
    }
    handleNavigation() {
        if (this.renderRef.current !== null) {
            this.state.htmlRenderMessageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: this.state.activeDictionaryId,
                options: {
                    originatorId: "preview",
                },
                activeNavigationConfigId: "",
            });
        }
    }
    updateDOM(messageData) {
        switch (messageData.type) {
            case MessageSystemType.initialize:
            case MessageSystemType.custom:
            case MessageSystemType.data:
                return this.attachComponentsAndInit;
            case MessageSystemType.navigation:
                return this.handleNavigation;
        }
        return this.attachMappedComponents;
    }
}
export default Preview;
