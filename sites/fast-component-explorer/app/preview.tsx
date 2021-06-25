import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import {
    DataMessageOutgoing,
    htmlMapper,
    htmlResolver,
    InitializeMessageOutgoing,
    mapDataDictionary,
    MessageSystemOutgoing,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import {
    allComponents,
    baseLayerLuminance,
    direction,
    fillColor,
    SwatchRGB,
} from "@microsoft/fast-components";
import {
    WebComponentDefinition,
    WebComponentDefinitionTag,
} from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import {
    fastComponentDefinitions,
    nativeElementDefinitions,
    previewBackgroundTransparency,
    previewDirection,
    previewTheme,
} from "@microsoft/site-utilities";
import { DesignSystem } from "@microsoft/fast-foundation";
import {
    PreviewProps,
    PreviewState,
    PreviewUnhandledProps,
    StandardLuminance,
} from "./preview.props";
import style from "./preview.style";

DesignSystem.getOrCreate().register(
    Object.values(allComponents).map((component: () => any) => {
        return component();
    })
);

export const previewReady: string = "PREVIEW::READY";

/**
 * The preview component exists on a route inside an iframe
 * This allows for an isolated view of any component or components.
 */
class Preview extends Foundation<{}, PreviewUnhandledProps, PreviewState> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props: PreviewProps) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            dataDictionary: void 0,
            schemaDictionary: {},
            transparentBackground: false,
            direction: Direction.ltr,
            theme: StandardLuminance.DarkMode,
        };

        document.body.setAttribute(
            "style",
            `background-color: var(${fillColor.cssCustomProperty})`
        );
        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            return (
                <div>
                    <style>{style}</style>
                    <div
                        className={classNames("preview", [
                            "preview__transparent",
                            this.state.transparentBackground,
                        ])}
                        dir={this.state.direction}
                    >
                        <div ref={this.ref} />
                    </div>
                </div>
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

    private handleMessage = (message: MessageEvent): void => {
        if (message.origin === location.origin) {
            let messageData: unknown;

            try {
                messageData = JSON.parse(message.data);

                /* eslint-disable-next-line no-empty */
            } catch (e) {}

            if (messageData !== undefined) {
                switch ((messageData as MessageSystemOutgoing).type) {
                    case MessageSystemType.initialize:
                        this.setState(
                            {
                                dataDictionary: (messageData as InitializeMessageOutgoing)
                                    .dataDictionary,
                                schemaDictionary: (messageData as InitializeMessageOutgoing)
                                    .schemaDictionary,
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
                    case MessageSystemType.custom:
                        if ((messageData as any).id === previewBackgroundTransparency) {
                            this.setState(
                                {
                                    transparentBackground: (messageData as any).value,
                                },
                                this.attachMappedComponents
                            );
                        } else if ((messageData as any).id === previewDirection) {
                            this.setState(
                                {
                                    direction: (messageData as any).value,
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

    private attachMappedComponents(): void {
        if (this.state.dataDictionary !== undefined && this.ref.current !== null) {
            const root = document.createElement("div");
            const innerDiv = document.createElement("div");
            this.ref.current.innerHTML = "";

            innerDiv.setAttribute("style", "padding: 20px;");

            root.setAttribute("style", "min-height: 100vh; min-width: 100vw;");

            direction.withDefault(this.state.direction);
            baseLayerLuminance.withDefault(this.state.theme);
            fillColor.withDefault(
                SwatchRGB.create(this.state.theme, this.state.theme, this.state.theme)
            );

            root.appendChild(innerDiv);

            innerDiv.appendChild(
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
            this.ref.current.append(root);
        }
    }
}

export default Preview as React.ComponentType;
