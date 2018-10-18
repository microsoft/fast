/**
 * The DesignSystemProvider is a react component designed to provide design-system configurations to the
 * JSSManager. The provider accepts a single prop that it will make available to all child components through
 * react contexts. If given a design-language, the JSSManager will make the design-language object available
 * to all JSS rules defined as a function
 */
import * as React from "react";
import * as propTypes from "prop-types";
import { Consumer, Provider } from "./context";

export type DesignSystem<T> = T extends { [key: string]: unknown } ? T : never;
/**
 * Describes the props that the DesignSystemProvider uses. It accepts a single prop "designSystem"
 * that gets exposed to all downstream components of the DesignSystemProvider
 */
export interface DesignSystemProviderProps<T> {
    designSystem: DesignSystem<T>;
}

export class DesignSystemProvider<T> extends React.Component<
    DesignSystemProviderProps<T>,
    {}
> {
    public render(): React.ReactNode {
        return <Consumer>{this.renderProvider}</Consumer>;
    }

    private renderProvider = (designSystem: T): React.ReactNode => {
        return (
            <Provider value={Object.assign({}, designSystem, this.props.designSystem)}>
                {this.props.children}
            </Provider>
        );
    };
}
