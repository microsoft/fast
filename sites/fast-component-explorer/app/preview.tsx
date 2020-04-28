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
import { reactMapper, reactResolver } from "@microsoft/fast-tooling-react";
import { DesignSystem, StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { componentDictionary } from "./msft-components/dictionary";
import {
    PreviewHandledProps,
    PreviewProps,
    PreviewState,
    PreviewUnhandledProps,
} from "./preview.props";
import style from "./preview.style";
import { designSystemLinkedDataId } from "./explorer";

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
            theme: StandardLuminance.LightMode,
        };
    }

    public render(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            return (
                <DesignSystemProvider
                    designSystem={
                        this.state.dataDictionary[0][designSystemLinkedDataId].data
                    }
                >
                    <Background
                        dir={
                            (this.state.dataDictionary[0][designSystemLinkedDataId]
                                .data as DesignSystem).direction
                        }
                    >
                        {this.renderMappedComponents()}
                    </Background>
                </DesignSystemProvider>
            );
        }

        return null;
    }

    public componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: previewReady,
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
            }
        }
    };

    private renderMappedComponents(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            return mapDataDictionary({
                dataDictionary: this.state.dataDictionary,
                schemaDictionary: this.state.schemaDictionary,
                mapper: reactMapper(componentDictionary),
                resolver: reactResolver,
            });
        }

        return null;
    }
}

export default manageJss(style)(Preview as React.ComponentType);
