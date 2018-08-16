/**
 * The DesignSystemProvider is a react component designed to provide design-system configurations to the
 * JSSManager. The provider accepts a single prop that it will make available to all child components through
 * react contexts. If given a design-language, the JSSManager will make the design-language object available
 * to all JSS rules defined as a function
 */
import * as React from "react";
import * as propTypes from "prop-types";

/**
 * Describes the props that the DesignSystemProvider uses. It accepts a single prop "designSystem"
 * that gets exposed to all downstream components of the DesignSystemProvider
 */
export interface IDesignSystemProviderProps<T> {
    designSystem?: T;
}

class DesignSystemProvider<T> extends React.Component<IDesignSystemProviderProps<T>, {}> {
    // TODO: How can we type these to be generics but also static properties
    public static contextTypes: any = {
        designSystem: propTypes.any
    };

    public static childContextTypes: any = {
        designSystem: propTypes.any
    };

    public getChildContext(): IDesignSystemProviderProps<T> {
        const designSystem: T = this.props.designSystem;
        const contextualDesignSystem: T = this.context.designSystem;
        const context: T = Object.assign({}, contextualDesignSystem, designSystem);

        return { designSystem: context };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }
}

export default DesignSystemProvider;
