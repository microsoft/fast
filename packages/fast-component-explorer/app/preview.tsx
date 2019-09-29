import React from "react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import style from "./preview.style";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ViewerContent } from "@microsoft/fast-tooling-react";
import { childOptions } from "./config";
import initializedPlugins from "./utilities/plugins"; // TODO: add this to Viewer Content
import { Background } from "@microsoft/fast-components-react-msft";
import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { get } from "lodash-es";

/* tslint:disable-next-line */
export interface PreviewState extends DesignSystem {}

/**
 * The preview component exists on a route inside an iframe
 * This allows for an isolated view of any component or components.
 */
class Preview extends Foundation<{}, {}, PreviewState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            ...DesignSystemDefaults,
        };
    }

    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={this.state}>
                <Background
                    className={get(this.props, "managedClasses.preview")}
                    dir={this.state.direction}
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
            /* tslint:disable-next-line */
        } catch (e) {}
    };
}

export default manageJss(style)(Preview as React.ComponentType);
