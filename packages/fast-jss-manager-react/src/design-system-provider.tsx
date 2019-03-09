/**
 * The DesignSystemProvider is a react component designed to provide design-system configurations to the
 * JSSManager. The provider accepts a single prop that it will make available to all child components through
 * react contexts. If given a design-language, the JSSManager will make the design-language object available
 * to all JSS rules defined as a function
 */
import * as React from "react";
import { designSystemContext, Provider } from "./context";
import { merge } from "lodash-es";

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
    { designSystem: T }
> {
    /**
     * We need to store a copy of the context object
     * because React doesn't give good tools to know
     * when the context has changed.
     */
    private currentContext: T;
    private currentPropsDesignSystem: T;
    private currentDesignSystem: T;

    constructor(props: DesignSystemProviderProps<T>, context: T) {
        super(props);

        this.currentContext = context;
        this.currentPropsDesignSystem = props.designSystem;

        this.currentDesignSystem = this.createDesignSystem();
    }

    public render(): React.ReactNode {
        let shouldUpdate: boolean = false;

        if (this.context !== this.currentContext) {
            // React doesn't give us good tools to tell when this.context
            this.currentContext = this.context;
            shouldUpdate = true;
        }

        if (this.props.designSystem !== this.currentPropsDesignSystem) {
            this.currentPropsDesignSystem = this.props.designSystem;
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            this.currentDesignSystem = this.createDesignSystem();
        }

        return (
            <Provider value={this.currentDesignSystem}>{this.props.children}</Provider>
        );
    }

    /**
     * Merges locally stored context with designSystem props.
     * Returns a new object
     */
    private createDesignSystem(): T {
        return merge({}, this.currentContext, this.currentPropsDesignSystem);
    }
}

DesignSystemProvider.contextType = designSystemContext;
