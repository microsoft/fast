import React from "react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import Foundation from "@microsoft/fast-components-foundation-react";
import { Background } from "@microsoft/fast-components-react-msft";
import {
    DataMessageOutgoing,
    InitializeMessageOutgoing,
    mapDataDictionary,
    MessageSystemOutgoing,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import {
    reactMapper,
    reactResolver,
    ViewerCustomAction,
} from "@microsoft/fast-tooling-react";
import { DesignSystem, StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { classNames } from "@microsoft/fast-web-utilities";
import { componentDictionary } from "./msft-components/dictionary";
import {
    PreviewHandledProps,
    PreviewProps,
    PreviewState,
    PreviewUnhandledProps,
} from "./preview.props";
import style from "./preview.style";
import { backgroundTransparency, designSystemLinkedDataId } from "./explorer";

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
    constructor(props: PreviewProps) {
        super(props);

        this.state = {
            dataDictionary: void 0,
            schemaDictionary: {},
            transparentBackground: false,
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
                    dir={
                        (this.state.dataDictionary[0][designSystemLinkedDataId]
                            .data as DesignSystem).direction
                    }
                >
                    <DesignSystemProvider
                        designSystem={
                            this.state.dataDictionary[0][designSystemLinkedDataId].data
                        }
                    >
                        {this.renderMappedComponents()}
                    </DesignSystemProvider>
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
                    this.setState({
                        dataDictionary: (messageData as InitializeMessageOutgoing)
                            .dataDictionary,
                        schemaDictionary: (messageData as InitializeMessageOutgoing)
                            .schemaDictionary,
                    });
                    break;
                case MessageSystemType.data:
                    this.setState({
                        dataDictionary: (messageData as DataMessageOutgoing)
                            .dataDictionary,
                    });
                    break;
                case MessageSystemType.custom:
                    if ((messageData as any).id === backgroundTransparency) {
                        this.setState({
                            transparentBackground: (messageData as any).value,
                        });
                    }

                    break;
            }
        }
    };

    private renderMappedComponents(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            const mappedComponents = mapDataDictionary({
                dataDictionary: this.state.dataDictionary,
                schemaDictionary: this.state.schemaDictionary,
                mapper: reactMapper(componentDictionary),
                resolver: reactResolver,
            });

            if (
                (this.state.dataDictionary[0][designSystemLinkedDataId]
                    .data as DesignSystem).baseLayerLuminance ===
                StandardLuminance.DarkMode
            ) {
                return (
                    <Background
                        className={this.props.managedClasses.preview_componentRegion}
                    >
                        {mappedComponents}
                    </Background>
                );
            }

            return (
                <div className={this.props.managedClasses.preview_componentRegion}>
                    {mappedComponents}
                </div>
            );
        }

        return null;
    }
}

export default manageJss(style)(Preview as React.ComponentType);
