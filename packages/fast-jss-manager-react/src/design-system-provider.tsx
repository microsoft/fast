/**
 * The DesignSystemProvider is a react component designed to provide design-system configurations to the
 * JSSManager. The provider accepts a single prop that it will make available to all child components through
 * react contexts. If given a design-language, the JSSManager will make the design-language object available
 * to all JSS rules defined as a function
 */
import React from "react";
import { designSystemContext, Provider } from "./context";
import {
    mergeDesignSystem,
    DesignSystemMergingFunction,
} from "@microsoft/fast-jss-manager";

export type DesignSystem<T> = T extends { [key: string]: unknown } ? T : never;
/**
 * Describes the props that the DesignSystemProvider uses. It accepts a single prop "designSystem"
 * that gets exposed to all downstream components of the DesignSystemProvider
 */
export interface DesignSystemProviderProps<T> {
    designSystem: DesignSystem<T>;
    designSystemMergingFunction?: DesignSystemMergingFunction<T>;
}

export class DesignSystemProvider<T> extends React.Component<
    DesignSystemProviderProps<T>,
    { designSystem: T }
> {
    public static contextType: React.Context<unknown> = designSystemContext;

    /**
     * We need to store a copy of the context object
     * because React doesn't give good tools to know
     * when the context has changed.
     */
    private upstreamDesignSystem: T;

    /**
     * A copy of this.props.designSystem -
     * we need to store this as a property so that we can
     * determine if designSystem props have changed in the render method.
     * We need to determine if it has changed in render as opposed to componentDidUpdate
     * to avoid a re-render
     */
    private designSystemOverrides: T;

    /**
     * The merged upstreamDesignSystem and designSystemOverrides -
     * store this so the object reference doesn't change between
     * renders if both props.designSystem and context don't change
     */
    private downstreamDesignSystem: T;

    constructor(props: DesignSystemProviderProps<T>, context: T) {
        super(props);

        this.updateDownstreamDesignSystem();
    }

    public render(): React.ReactNode {
        this.updateDownstreamDesignSystem();

        return (
            <Provider value={this.downstreamDesignSystem}>{this.props.children}</Provider>
        );
    }

    /**
     * Updates the downstreamDesignSystem if either this.props.designSystem
     * or this.context has changed
     */
    private updateDownstreamDesignSystem(): void {
        let shouldUpdate: boolean = false;

        if (this.upstreamDesignSystem !== this.context) {
            this.upstreamDesignSystem = this.context;
            shouldUpdate = true;
        }

        if (this.designSystemOverrides !== this.props.designSystem) {
            this.designSystemOverrides = this.props.designSystem;
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            this.downstreamDesignSystem = this.createDesignSystem();
        }
    }

    /**
     * Merges locally stored context with designSystem props.
     * Returns a new object
     */
    private createDesignSystem(): T {
        return typeof this.props.designSystemMergingFunction === "function"
            ? this.props.designSystemMergingFunction(
                  this.upstreamDesignSystem,
                  this.designSystemOverrides
              )
            : mergeDesignSystem(this.upstreamDesignSystem, this.designSystemOverrides);
    }
}
