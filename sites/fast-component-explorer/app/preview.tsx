import React from "react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import Foundation from "@microsoft/fast-components-foundation-react";
import { ViewerContent } from "@microsoft/fast-tooling-react";
import { Background } from "@microsoft/fast-components-react-msft";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    PreviewHandledProps,
    PreviewProps,
    PreviewState,
    PreviewUnhandledProps,
} from "./preview.props";
import initializedPlugins from "./utilities/plugins"; // TODO: add this to Viewer Content
import { childOptions } from "./config";
import style from "./preview.style";

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
            ...DesignSystemDefaults,
        };
    }

    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={this.state}>
                <Background
                    className={classNames(this.props.managedClasses.preview)}
                    dir={this.state.direction}
                    drawBackground={false}
                >
                    <ViewerContent
                        components={childOptions}
                        plugins={initializedPlugins}
                    />
                </Background>
            </DesignSystemProvider>
        );
    }

    public componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    }

    private handleMessage = (message: MessageEvent): void => {
        try {
            const state: PreviewState = JSON.parse(message.data);

            this.setState(state);
            /* eslint-disable-next-line no-empty */
        } catch (e) {}
    };
}

export default manageJss(style)(Preview as React.ComponentType);
