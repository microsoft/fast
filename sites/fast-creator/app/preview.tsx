import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import manageJss from "@microsoft/fast-jss-manager-react";
import {
    DataDictionary,
    DataMessageOutgoing,
    htmlResolver,
    InitializeMessageOutgoing,
    mapDataDictionary,
    MessageSystemOutgoing,
    MessageSystemType,
    NavigationMessageOutgoing,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import {
    WebComponentDefinition,
    WebComponentDefinitionTag,
} from "@microsoft/fast-tooling/dist/data-utilities/web-component";
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
import { previewAccentColor, previewDirection, previewTheme } from "./creator";
import { dataSetDictionaryId, htmlMapper } from "./utilities";
import style from "./preview.style";
import { createWrapper } from "./utilities/wrapper";

// Prevent tree shaking
FASTComponents;

export const previewReady: string = "PREVIEW::READY";

export interface PreviewState {
    activeDictionaryId: string;
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    theme: FASTComponents.StandardLuminance;
    direction: Direction;
    accentColor: string;
}

class Preview extends Foundation<{}, {}, PreviewState> {
    private ref: React.RefObject<HTMLDivElement>;
    private activeDictionaryItemWrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);

        this.ref = React.createRef();
        this.activeDictionaryItemWrapperRef = React.createRef();

        this.state = {
            activeDictionaryId: "",
            dataDictionary: void 0,
            schemaDictionary: {},
            theme: FASTComponents.StandardLuminance.LightMode,
            direction: Direction.ltr,
            accentColor: fastDesignSystemDefaults.accentBaseColor,
        };

        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            return (
                <React.Fragment>
                    <div dir={this.state.direction} ref={this.ref} />
                    <div ref={this.activeDictionaryItemWrapperRef} />
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

    private attachMappedComponents(): void {
        if (this.state.dataDictionary !== undefined && this.ref.current !== null) {
            const designSystemProvider = document.createElement(
                "fast-design-system-provider"
            );
            this.ref.current.innerHTML = "";

            designSystemProvider.setAttribute(
                "accent-base-color",
                this.state.accentColor
            );
            const generatedAccentPalette = createColorPalette(
                parseColorHexRGB(this.state.accentColor)
            );
            (designSystemProvider as FASTComponents.FASTDesignSystemProvider).accentPalette = generatedAccentPalette;

            designSystemProvider.setAttribute(
                "background-color",
                FASTComponents.neutralLayerL1(
                    Object.assign({}, fastDesignSystemDefaults, {
                        baseLayerLuminance: this.state.theme,
                    })
                )
            );
            designSystemProvider.setAttribute(
                "style",
                "background: var(--background-color); height: 100vh;"
            );
            designSystemProvider.setAttribute("use-defaults", "");
            designSystemProvider.appendChild(
                mapDataDictionary({
                    dataDictionary: this.state.dataDictionary,
                    schemaDictionary: this.state.schemaDictionary,
                    mapper: htmlMapper({
                        version: 1,
                        tags: Object.entries({
                            ...fastComponentDefinitions,
                            ...nativeElementDefinitions,
                        }).reduce(
                            (
                                previousValue: WebComponentDefinitionTag[],
                                currentValue: [string, WebComponentDefinition]
                            ) => {
                                if (Array.isArray(currentValue[1].tags)) {
                                    return previousValue.concat(currentValue[1].tags);
                                }

                                return previousValue;
                            },
                            []
                        ),
                    }),
                    resolver: htmlResolver,
                })
            );

            this.ref.current.append(designSystemProvider);
            this.attachActiveDictionaryIdWrapper();
        }
    }

    private attachActiveDictionaryIdWrapper(): void {
        const activeElement = this.ref.current?.querySelector(
            `[${dataSetDictionaryId}="${this.state.activeDictionaryId}"]`
        );

        if (activeElement) {
            createWrapper(this.activeDictionaryItemWrapperRef, activeElement);
        }
    }

    private handleMessage = (message: MessageEvent): void => {
        if (message.origin === location.origin) {
            let messageData: unknown;

            try {
                messageData = JSON.parse(message.data);
            } catch (e) {
                return;
            }

            if (messageData !== undefined) {
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
                            this.attachMappedComponents
                        );
                        break;
                    case MessageSystemType.data:
                        this.setState(
                            {
                                dataDictionary: (messageData as DataMessageOutgoing)
                                    .dataDictionary,
                            },
                            this.attachMappedComponents
                        );
                        break;
                    case MessageSystemType.navigation:
                        this.setState(
                            {
                                activeDictionaryId: (messageData as NavigationMessageOutgoing)
                                    .activeDictionaryId,
                            },
                            this.attachMappedComponents
                        );
                        break;
                    case MessageSystemType.custom:
                        if ((messageData as any).id === previewDirection) {
                            this.setState(
                                {
                                    direction: (messageData as any).value,
                                },
                                this.attachMappedComponents
                            );
                        } else if ((messageData as any).id === previewAccentColor) {
                            this.setState(
                                {
                                    accentColor: (messageData as any).value,
                                },
                                this.attachMappedComponents
                            );
                        } else if ((messageData as any).id === previewTheme) {
                            this.setState(
                                {
                                    theme: (messageData as any).value,
                                },
                                this.attachMappedComponents
                            );
                        }
                        break;
                }
            }
        }
    };
}

export default manageJss(style)(Preview as React.ComponentType);
