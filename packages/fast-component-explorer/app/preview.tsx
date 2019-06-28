import React from "react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import style from "./explorer.style";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ViewerContent } from "@microsoft/fast-tooling-react";
import { childOptions } from "./config";
import { Direction } from "@microsoft/fast-web-utilities";
import initializedPlugins from "./utilities/plugins"; // TODO: add this to Viewer Content

export interface PreviewState {
    direction: Direction;
}

/**
 * The preview component exists on a route inside an iframe
 * This allows for an isolated view of any component or components.
 */
class Preview extends Foundation<{}, {}, PreviewState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            direction: Direction.ltr,
        };
    }

    public render(): React.ReactNode {
        return (
            <div style={this.getStyle()} dir={this.state.direction}>
                <DesignSystemProvider designSystem={this.state}>
                    <ViewerContent components={childOptions} />
                </DesignSystemProvider>
            </div>
        );
    }

    public componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    }

    private handleMessage = (message: MessageEvent): void => {
        const state: PreviewState = JSON.parse(message.data);

        this.setState(state);
    };

    private getStyle(): React.CSSProperties {
        return {};
    }
}

export default manageJss(style)(Preview as React.ComponentType);
