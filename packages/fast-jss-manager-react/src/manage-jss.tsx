/**
 * manageJss is a higher-order function that returns a higher-order component.
 * The HOC that is returned is responsible for managing JSS stylesheets for components
 * registered with manageJss.
 */
import * as React from "react";
import jss, { stylesheetManager } from "./jss";
import { isEmptyObject } from "./utilities/object";
import { SheetsManager, StyleSheet } from "jss";
import { IDesignSystemProviderProps } from "./design-system-provider";
import * as propTypes from "prop-types";
import { ClassNames, ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager";
import { isEqual, merge, omit, uniqueId } from "lodash-es";

// hoist-non-react-statics does not seem to be a properly formatted ES6 module, so we need to require it instead
// Disable rule disallowing require statements
/* tslint:disable-next-line */
const hoistNonReactStatics: any = require("hoist-non-react-statics");

/**
 * State interface for JSS manager
 */
export interface IJSSManagerState {
    /**
     * Stores a JSS stylesheet containing all config-driven styles rules for a component
     */
    dynamicStyleSheet?: any;
}

/**
 * JSS Manager props
 */
export interface IJSSManagerProps<S, C> {
    jssStyleSheet?: Partial<ComponentStyles<S, C>>;
}

/**
 * Main entry into the style manager. This function accepts a JSS style object and returns a
 * higher order component. That higher-order component can then be used to compose a component
 * with styles managed
 */
/* tslint:disable-next-line */
function manageJss<S, C>(styles?: ComponentStyles<S, C>): <T>(Component: React.ComponentType<T & IManagedClasses<S>>) => React.ComponentType<T & IJSSManagerProps<S, C>> {
    return function<T>(Component: React.ComponentType<T & IManagedClasses<S>>): React.ComponentType<T & IJSSManagerProps<S, C>> {

        // Define the manager higher-order component inside of the return method of the higher-order function.
        class JSSManager extends React.Component<T & IJSSManagerProps<S, C>, IJSSManagerState> {
            // TODO: figure out if there is a better way to type this object
            public static contextTypes: any = {
                designSystem: propTypes.any
            };

            /**
             * The style manager is responsible for attaching and detaching style elements when
             * components mount and un-mount
             */
            private static stylesheetManager: SheetsManager = stylesheetManager;

            /**
             * Map of all components that have been initialized via this component
             */
            private static componentMap: WeakMap<React.ComponentType<T & IManagedClasses<S>>, string> = new WeakMap();

            /**
             * Map of all style objects that have been initialized via this component
             */
            private static styleMap: WeakMap<ComponentStyles<S, C>, string> = new WeakMap();

            /**
             * All static and dynamic styles associated with the component
             */
            private static styles: ComponentStyles<S, C>;

            /**
             * Tracks the ID of an instance of the JSSManager. Multiple instances can have the same ID
             * if the the backing Component and styles objects are shared because the ID is is derived from
             * both the Component and styles IDs
             */
            private instanceId: string;

            constructor(props: T) {
                super(props);

                JSSManager.styles = styles;

                const state: IJSSManagerState = {};

                if (Boolean(JSSManager.styles)) {
                    state.dynamicStyleSheet = this.createDynamicStyleSheet();
                }

                this.state = state;
            }

            /**
             * Updates a dynamic stylesheet with context
             */
            public updateDynamicStyleSheet(): void {
                if (Boolean(this.state.dynamicStyleSheet)) {
                    this.state.dynamicStyleSheet.update(this.designSystem);
                }
            }

            public componentWillMount(): void {
                if (Boolean(this.state.dynamicStyleSheet)) {
                    // It appears we need to update the stylesheet for any style properties defined as functions
                    // to work.

                    this.state.dynamicStyleSheet.attach();
                    this.updateDynamicStyleSheet();
                }
            }

            public componentWillUpdate(nextProps: T & IJSSManagerProps<S, C>, nextState: IJSSManagerState, nextContext: any): void {
                if (!isEqual(this.context, nextContext)) {
                    this.updateDynamicStyleSheet();
                }
            }

            public componentDidUpdate(prevProps: T & IJSSManagerProps<S, C>, prevState: IJSSManagerState): void {
                if (this.props.jssStyleSheet !== prevProps.jssStyleSheet) {
                    jss.removeStyleSheet(this.state.dynamicStyleSheet);

                    this.setState((previousState: IJSSManagerState, props: T & IJSSManagerProps<S, C>): Partial<IJSSManagerState> => {
                        return {
                            dynamicStyleSheet: this.hasDynamicStyleSheet() ? this.createDynamicStyleSheet() : null
                        };
                    }, (): void => {
                        if (this.hasDynamicStyleSheet()) {
                            this.state.dynamicStyleSheet.attach().update(this.designSystem);
                        }
                    });
                }
            }

            public componentWillUnmount(): void {
                if (this.hasDynamicStyleSheet()) {
                    this.state.dynamicStyleSheet.detach();
                    jss.removeStyleSheet(this.state.dynamicStyleSheet);
                }
            }

            public render(): React.ReactNode {
                return (
                    <Component
                        {...omit(this.props, ["jssStyleSheet"])}
                        managedClasses={this.getClassNames()}
                    />
                );
            }

            /**
             * Get the design-system context to update the stylesheet with
             */
            private get designSystem(): any {
                return this.context && this.context.designSystem ? this.context.designSystem : {};
            }

            /**
             * Creates a jss stylesheet from the dynamic portion of an associated style object and any style object passed
             * as props
             */
            private createDynamicStyleSheet(): any {
                return jss.createStyleSheet(
                    merge({}, JSSManager.styles, this.props.jssStyleSheet),
                    { link: true }
                );
            }

            /**
             * Checks to see if this component has an associated dynamic stylesheet
             */
            private hasDynamicStyleSheet(): boolean {
                return Boolean(JSSManager.styles || this.props.jssStyleSheet);
            }

            /**
             * Merges static and dynamic stylesheet classnames into one object
             */
            private getClassNames(): ClassNames<S> {
                const classNames: Partial<ClassNames<S>> = {};

                if (this.hasDynamicStyleSheet()) {
                    for (const key in this.state.dynamicStyleSheet.classes) {
                        if (this.state.dynamicStyleSheet.classes.hasOwnProperty(key)) {
                            classNames[key] = typeof classNames[key] !== "undefined"
                                ? `${classNames[key]} ${this.state.dynamicStyleSheet.classes[key]}`
                                : this.state.dynamicStyleSheet.classes[key];
                        }
                    }
                }

                return classNames as ClassNames<S>;
            }
        }

        return hoistNonReactStatics(JSSManager, Component);
    };
}

export default manageJss;
export * from "@microsoft/fast-jss-manager";
