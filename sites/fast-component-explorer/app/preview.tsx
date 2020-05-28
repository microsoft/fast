import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
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
import * as FASTComponents from "@microsoft/fast-components";
import { fastDesignSystemDefaults } from "@microsoft/fast-components/dist/esm/fast-design-system";
import {
    WebComponentDefinition,
    WebComponentDefinitionTag,
} from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import {
    neutralLayerL1,
    StandardLuminance,
} from "@microsoft/fast-components-styles-msft";
import * as componentDefinitions from "./fast-components/configs/component-definitions";
import {
    PreviewHandledProps,
    PreviewProps,
    PreviewState,
    PreviewUnhandledProps,
} from "./preview.props";
import style from "./preview.style";
import {
    previewBackgroundTransparency,
    previewDirection,
    previewTheme,
} from "./explorer";
import { nativeElementTags } from "./utilities";

// Prevent tree shaking
FASTComponents;

export const previewReady: string = "PREVIEW::READY";

/**
 * The preview component exists on a route inside an iframe
 * This allows for an isolated view of any component or components.
 */
class Preview extends Foundation<
    PreviewHandledProps,
    PreviewUnhandledProps,
    PreviewState
> {
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

        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            return (
                <div
                    className={classNames(this.props.managedClasses.preview, [
                        this.props.managedClasses.preview__transparent,
                        this.state.transparentBackground,
                    ])}
                    dir={this.state.direction}
                >
                    <div ref={this.ref} />
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
    };

    private attachMappedComponents(): void {
        if (this.state.dataDictionary !== undefined && this.ref.current !== null) {
            const designSystemProvider = document.createElement(
                "fast-design-system-provider"
            );
            this.ref.current.innerHTML = "";

            designSystemProvider.setAttribute("use-defaults", "");
            designSystemProvider.setAttribute(
                "background-color",
                neutralLayerL1(
                    Object.assign({}, fastDesignSystemDefaults, {
                        baseLayerLuminance: this.state.theme,
                    })
                )
            );
            if (!this.state.transparentBackground) {
                designSystemProvider.setAttribute(
                    "style",
                    "background: var(--background-color); height: 100vh;"
                );
            }

            designSystemProvider.appendChild(
                mapDataDictionary({
                    dataDictionary: this.state.dataDictionary,
                    schemaDictionary: this.state.schemaDictionary,
                    mapper: htmlMapper({
                        version: 1,
                        tags: Object.entries(componentDefinitions)
                            .reduce(
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
                            )
                            .concat(nativeElementTags),
                    }),
                    resolver: htmlResolver,
                })
            );
            this.ref.current.append(designSystemProvider);
        }
    }
}

export default manageJss(style)(Preview as React.ComponentType);
