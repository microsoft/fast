import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import {
    DataDictionary,
    DataMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemOutgoing,
    MessageSystemType,
    NavigationMessageOutgoing,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import { HTMLRenderOriginatorId } from "@microsoft/fast-tooling/dist/esm/web-components/html-render/html-render";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
import {
    fastComponentDefinitions,
    nativeElementDefinitions,
} from "@microsoft/site-utilities";
import { Direction } from "@microsoft/fast-web-utilities";
import * as FASTComponents from "@microsoft/fast-components";
import { fastDesignSystemDefaults } from "@microsoft/fast-components/src/fast-design-system";
import { createColorPalette } from "@microsoft/fast-components/src/color/create-color-palette";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { HTMLRenderReact } from "./web-components";

// Prevent tree shaking
FASTComponents;

const style: HTMLStyleElement = document.createElement("style");
style.innerText =
    "body, html { width:100%; height:100%; overflow-x:initial; } #root {height:100%} ";
document.head.appendChild(style);

export const previewReady: string = "PREVIEW::READY";

export interface PreviewState {
    activeDictionaryId: string;
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    theme: FASTComponents.StandardLuminance;
    designSystemDataDictionary: DataDictionary<unknown>;
    htmlRenderMessageSystem: MessageSystem;
    htmlRenderReady: boolean;
}

class Preview extends Foundation<{}, {}, PreviewState> {
    private ref: React.RefObject<HTMLDivElement>;
    private renderRef: React.RefObject<HTMLRenderReact>;
    private activeDictionaryItemWrapperRef: React.RefObject<HTMLDivElement>;
    private htmlRenderMessageSystemWorker = new FASTMessageSystemWorker();

    constructor(props: {}) {
        super(props);
        const designSystemLinkedDataId: string = "design-system";

        this.ref = React.createRef();
        this.renderRef = React.createRef();
        this.activeDictionaryItemWrapperRef = React.createRef();

        this.state = {
            activeDictionaryId: "",
            dataDictionary: void 0,
            schemaDictionary: {},
            theme: FASTComponents.StandardLuminance.LightMode,
            designSystemDataDictionary: [
                {
                    [designSystemLinkedDataId]: {
                        schemaId: "fast-design-system-provider",
                        data: {
                            "use-defaults": true,
                            "accent-base-color": fastDesignSystemDefaults.accentBaseColor,
                            direction: Direction.ltr,
                            "background-color": FASTComponents.neutralLayerL1(
                                Object.assign({}, fastDesignSystemDefaults, {
                                    baseLayerLuminance:
                                        FASTComponents.StandardLuminance.LightMode,
                                })
                            ),
                        },
                    },
                },
                designSystemLinkedDataId,
            ],
            htmlRenderMessageSystem: new MessageSystem({
                webWorker: this.htmlRenderMessageSystemWorker,
            }),
            htmlRenderReady: false,
        };
        this.state.htmlRenderMessageSystem.add({
            onMessage: this.handleHtmlMessageSystem,
        });

        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            const direction: Direction = (this.state.designSystemDataDictionary[0][
                "design-system"
            ].data as any)["direction"];

            return (
                <React.Fragment>
                    <div className="preview" dir={direction} ref={this.ref}>
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

    public componentDidMount(): void {
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
    private attachMappedComponents(): void {
        if (this.renderRef.current !== null && !this.state.htmlRenderReady) {
            (this.renderRef.current
                .renderRef as any).messageSystem = this.state.htmlRenderMessageSystem;
            (this.renderRef.current.renderRef as any).markupDefinitions = {
                ...fastComponentDefinitions,
                ...nativeElementDefinitions,
            };
            this.setState({ htmlRenderReady: true });
        }

        if (this.state.dataDictionary !== undefined && this.renderRef.current !== null) {
            const designSystemProvider: any = this.renderRef.current.designRef;
            [...designSystemProvider.attributes].forEach(attr =>
                designSystemProvider.removeAttribute(attr.name)
            );

            Object.entries(
                this.state.designSystemDataDictionary[0]["design-system"].data as any
            ).forEach(([attribute, value]: [string, any]) => {
                designSystemProvider.setAttribute(attribute, value);
            });

            const accentColor: string = (this.state.designSystemDataDictionary[0][
                "design-system"
            ].data as any)["accent-base-color"];

            const generatedAccentPalette = createColorPalette(
                parseColorHexRGB(accentColor)
            );
            (designSystemProvider as FASTComponents.FASTDesignSystemProvider).accentPalette = generatedAccentPalette;

            designSystemProvider.setAttribute(
                "style",
                "background: var(--background-color); height: 100%;"
            );
        }
    }

    private attachComponentsAndInit(): void
    {
        this.attachMappedComponents();
        if (this.state.dataDictionary !== undefined)
        {
            this.state.htmlRenderMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary: this.state.dataDictionary,
                schemaDictionary: this.state.schemaDictionary,
            });
            if(this.state.activeDictionaryId)
            {
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

    private attachComponentsAndData(): void
    {
        this.attachMappedComponents();
    }

    private handleNavigation(): void {
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

    private updateDOM(messageData: MessageSystemOutgoing): () => void {
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

    private handleMessage = (message: MessageEvent): void => {
        if (message.origin === location.origin) {
            let messageData: unknown;

            try {
                messageData = JSON.parse(message.data);
            } catch (e) {
                return;
            }

            if (messageData !== undefined &&
                (!(messageData as any).options ||
                ((messageData as any).options as any).originatorId !==
                    "preview")) {
                switch ((messageData as MessageSystemOutgoing).type) {
                    case MessageSystemType.initialize:
                        this.setState(
                            {
                                dataDictionary: (messageData as InitializeMessageOutgoing)
                                    .dataDictionary,
                                schemaDictionary: (messageData as InitializeMessageOutgoing)
                                    .schemaDictionary,
                                activeDictionaryId: (messageData as InitializeMessageOutgoing)
                                    .activeDictionaryId,
                            },
                            this.updateDOM(messageData as MessageSystemOutgoing)
                        );
                        break;
                    case MessageSystemType.data:
                        this.setState(
                            {
                                dataDictionary: (messageData as DataMessageOutgoing)
                                    .dataDictionary,
                            },
                            this.updateDOM(messageData as MessageSystemOutgoing)
                        );
                        break;
                    case MessageSystemType.navigation:
                        if (
                            !(messageData as any).options ||
                            ((messageData as any).options as any).originatorId !==
                                HTMLRenderOriginatorId
                        )
                            this.setState(
                                {
                                    activeDictionaryId: (messageData as NavigationMessageOutgoing)
                                        .activeDictionaryId,
                                },
                                this.updateDOM(messageData as MessageSystemOutgoing)
                            );
                        break;
                    case MessageSystemType.custom:
                        if ((messageData as any).originatorId === "design-system") {
                            this.setState(
                                {
                                    designSystemDataDictionary: [
                                        {
                                            ["design-system"]: {
                                                schemaId: this.state
                                                    .designSystemDataDictionary[0][
                                                    "design-system"
                                                ].schemaId,
                                                data: {
                                                    ...(messageData as any).data,
                                                },
                                            },
                                        },
                                        "design-system",
                                    ],
                                },
                                this.updateDOM(messageData as MessageSystemOutgoing)
                            );
                        }
                        break;
                }
            }
        }
    };

    private handleHtmlMessageSystem = (message: MessageEvent): void => {

        if (message.data) {
            if (
                message.data.type === MessageSystemType.navigation &&
                message.data.action === MessageSystemNavigationTypeAction.update &&
                message.data.options &&
                message.data.options.originatorId === HTMLRenderOriginatorId
            ) {
                this.setState({
                    activeDictionaryId: message.data.activeDictionaryId
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
            )
            {
                window.postMessage(
                    {
                        type: MessageSystemType.custom,
                        action: ViewerCustomAction.call,
                        data: message.data.data
                    },
                    "*"
                );

            }
        }
    };
}

export default Preview as React.ComponentType;
