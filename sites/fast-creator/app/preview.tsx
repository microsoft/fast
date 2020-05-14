import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
    DataDictionary,
    DataMessageOutgoing,
    InitializeMessageOutgoing,
    mapDataDictionary,
    MessageSystemNavigationTypeAction,
    MessageSystemOutgoing,
    MessageSystemType,
    NavigationMessageOutgoing,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import { reactMapper, ViewerCustomAction } from "@microsoft/fast-tooling-react";
import { Background } from "@microsoft/fast-components-react-msft";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { reactResolver } from "./utilities";
import { componentDictionary } from "./msft-components/dictionary";
import style from "./preview.style";
import { designSystemLinkedDataId } from "./creator";

export const previewReady: string = "PREVIEW::READY";

export interface PreviewState {
    activeDictionaryId: string;
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    theme: StandardLuminance;
}

class Preview extends Foundation<{}, {}, PreviewState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            activeDictionaryId: "",
            dataDictionary: void 0,
            schemaDictionary: {},
            theme: StandardLuminance.LightMode,
        };

        window.addEventListener("message", this.handleMessage);
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
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                value: previewReady,
            },
            "*"
        );
    }

    private renderMappedComponents(): React.ReactNode {
        if (this.state.dataDictionary !== undefined) {
            return mapDataDictionary({
                dataDictionary: this.state.dataDictionary,
                schemaDictionary: this.state.schemaDictionary,
                mapper: reactMapper(componentDictionary),
                resolver: reactResolver(
                    this.state.activeDictionaryId,
                    this.handleUpdateDictionaryId
                ),
            });
        }

        return null;
    }

    private handleMessage = (message: MessageEvent): void => {
        let messageData: unknown;

        try {
            messageData = JSON.parse(message.data);
        } catch (e) {
            return;
        }

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
                case MessageSystemType.navigation:
                    this.setState({
                        activeDictionaryId: (messageData as NavigationMessageOutgoing)
                            .activeDictionaryId,
                    });
                    break;
            }
        }
    };

    private handleUpdateDictionaryId = (dictionaryId: string): void => {
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                value: {
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: dictionaryId,
                    activeNavigationConfigId: "",
                },
            },
            "*"
        );
    };
}

export default manageJss(style)(Preview as React.ComponentType);
