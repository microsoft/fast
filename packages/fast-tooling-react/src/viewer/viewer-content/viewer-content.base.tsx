import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ChildOptionItem, mapDataToComponent } from "../../data-utilities";
import {
    ViewerContentHandledProps,
    ViewerContentUnhandledProps,
} from "./viewer-content.props";
import {
    ComponentProps,
    ViewerMessage,
    ViewerMessageTarget,
    ViewerMessageType,
} from "../utilities/message-system";

export interface ViewerContentState {
    props?: ComponentProps[];
}

export class ViewerContent extends Foundation<
    ViewerContentHandledProps,
    ViewerContentUnhandledProps,
    ViewerContentState
> {
    public static displayName: string = "ViewerContent";

    protected handledProps: HandledProps<ViewerContentHandledProps> = {
        managedClasses: void 0,
        components: void 0,
    };

    constructor(props: ViewerContentHandledProps) {
        super(props);

        this.state = {
            props: [],
        };

        if (window) {
            window.addEventListener("message", this.handleMessage);
        }
    }

    public render(): JSX.Element {
        return <React.Fragment>{this.renderComponents()}</React.Fragment>;
    }

    public componentDidMount(): void {
        const initMessage: ViewerMessage = {
            target: ViewerMessageTarget.viewer,
            type: ViewerMessageType.initialize,
        };

        if (window) {
            window.postMessage(JSON.stringify(initMessage), "*");
        }
    }

    private renderComponents(): React.ReactNode {
        if (!this.state.props) {
            return null;
        }

        const props: any = Array.isArray(this.state.props)
            ? this.state.props
            : [this.state.props];

        return props.map((propsItem: ComponentProps, index: number) => {
            const mappedComponent: any = this.props.components.find(
                (component: ChildOptionItem) => {
                    return propsItem.id === component.schema.id;
                }
            );

            return (
                <mappedComponent.component
                    key={`${mappedComponent.schema.id}${index}`}
                    {...mapDataToComponent(
                        mappedComponent.schema,
                        propsItem.props,
                        this.props.components
                    )}
                />
            );
        });
    }

    private handleMessage = (e: MessageEvent): void => {
        const message: ViewerMessage =
            typeof e.data === "string" ? JSON.parse(e.data) : undefined;

        if (message && message.target === ViewerMessageTarget.viewerContent) {
            switch (message.type) {
                case ViewerMessageType.initialize:
                    this.setState({
                        props: message.props,
                    });
                    break;
                case ViewerMessageType.updateProps:
                    this.setState({
                        props: message.props,
                    });
                    break;
            }
        }
    };
}
