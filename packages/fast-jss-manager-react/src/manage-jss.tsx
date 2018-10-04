/**
 * manageJss is a higher-order function that returns a higher-order component.
 * The HOC that is returned is responsible for managing JSS stylesheets for components
 * registered with manageJss.
 */
import * as React from "react";
import jss, { stylesheetManager, stylesheetRegistry } from "./jss";
import { SheetsManager, StyleSheet } from "jss";
import { IDesignSystemProviderProps } from "./design-system-provider";
import * as propTypes from "prop-types";
import { ClassNames, ComponentStyles, ComponentStyleSheet, IManagedClasses } from "@microsoft/fast-jss-manager";
import { isEqual, merge, omit } from "lodash-es";

// hoist-non-react-statics does not seem to be a properly formatted ES6 module, so we need to require it instead
// TODO https://github.com/Microsoft/fast-dna/issues/512
/* tslint:disable-next-line */
const hoistNonReactStatics: any = require("hoist-non-react-statics");

/**
 * State interface for JSS manager
 */
export interface IJSSManagerState {
    /**
     * Stores a JSS stylesheet containing all config-driven styles rules for a component
     */
    styleSheet?: any;
}

/**
 * JSS Manager props
 */
export interface IJSSManagerProps<S, C> {
    jssStyleSheet?: Partial<ComponentStyles<S, C>>;
}

/**
 * Prop typing for the JSSManager
 */
export type JSSManagerProps<T, S, C> =
Pick<
    T,
    Exclude<
        keyof T,
        keyof IManagedClasses<C>
    >
> & IJSSManagerProps<S, C>;

/**
 * Main entry into the style manager. This function accepts a JSS style object and returns a
 * higher order component. That higher-order component can then be used to compose a component
 * with styles managed
 * @param S - The stylesheet class-name contract
 * @param C - The stylesheet configuration object
 * @param T - The component prop interface
 */
function manageJss<S, C>(
    styles?: ComponentStyles<S, C>
): <T>(
    Component: React.ComponentType<T & IManagedClasses<S>>
) => React.ComponentClass<JSSManagerProps<T, S, C>> {
    return function<T>(
        Component: React.ComponentType<T & IManagedClasses<S>>
    ): React.ComponentClass<JSSManagerProps<T, S, C>> {

        // Define the manager higher-order component inside of the return method of the higher-order function.
        class JSSManager extends React.Component<JSSManagerProps<T, S, C>, IJSSManagerState> {
            // TODO: figure out if there is a better way to type this object
            public static contextTypes: any = {
                designSystem: propTypes.any
            };

            /**
             * The style manager is responsible for attaching and detaching style elements when
             * components mount and un-mount
             */
            private static stylesheetManager: SheetsManager = stylesheetManager;

            constructor(props: JSSManagerProps<T, S, C>) {
                super(props);

                const state: IJSSManagerState = {};

                if (Boolean(styles)) {
                    state.styleSheet = this.createStyleSheet();
                }

                this.state = state;
            }

            /**
             * Updates a dynamic stylesheet with context
             */
            public updateStyleSheet(nextContext?: any): void {
                if (!Boolean(this.state.styleSheet)) {
                    return;
                }

                if (typeof styles === "function") {
                    this.resetStyleSheet();
                } else {
                    this.state.styleSheet.update(nextContext && nextContext.designSystem ? nextContext.designSystem : this.designSystem);
                }
            }

            public componentWillMount(): void {
                if (Boolean(this.state.styleSheet)) {
                    // It appears we need to update the stylesheet for any style properties defined as functions
                    // to work.
                    this.state.styleSheet.attach();
                    this.updateStyleSheet();
                }
            }

            public componentWillUpdate(nextProps: JSSManagerProps<T, S, C>, nextState: IJSSManagerState, nextContext: any): void {
                if (!isEqual(this.context, nextContext)) {
                    this.updateStyleSheet(nextContext);
                }
            }

            public componentDidUpdate(prevProps: JSSManagerProps<T, S, C>, prevState: IJSSManagerState): void {
                if (this.props.jssStyleSheet !== prevProps.jssStyleSheet) {
                    this.resetStyleSheet();
                }
            }

            public componentWillUnmount(): void {
                this.removeStyleSheet();
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
             * Remove a JSS stylesheet
             */
            private removeStyleSheet(): void {
                if (this.hasStyleSheet()) {
                    this.state.styleSheet.detach();
                    stylesheetRegistry.remove(this.state.styleSheet);
                    jss.removeStyleSheet(this.state.styleSheet);
                }
            }

            /**
             * Reset a JSS stylesheet relative to current props
             */
            private resetStyleSheet(): any {
                this.removeStyleSheet();
                this.setState((previousState: IJSSManagerState, props: JSSManagerProps<T, S, C>): Partial<IJSSManagerState> => {
                    return {
                        styleSheet: this.hasStyleSheet() ? this.createStyleSheet() : null
                    };
                }, (): void => {
                    if (this.hasStyleSheet()) {
                        this.state.styleSheet.attach().update(this.designSystem);
                    }
                });
            }

            /**
             * Creates a JSS stylesheet from the dynamic portion of an associated style object and any style object passed
             * as props
             */
            private createStyleSheet(): any {
                const stylesheet: ComponentStyleSheet<S, C> = typeof styles === "function"
                    ? styles(this.designSystem)
                    : styles;

                const jssSheet: any =  jss.createStyleSheet(
                    merge({}, stylesheet, this.props.jssStyleSheet),
                    { link: true }
                );

                stylesheetRegistry.add(jssSheet);

                return jssSheet;
            }

            /**
             * Checks to see if this component has an associated dynamic stylesheet
             */
            private hasStyleSheet(): boolean {
                return Boolean(styles || this.props.jssStyleSheet);
            }

            /**
             * Merges static and dynamic stylesheet classnames into one object
             */
            private getClassNames(): ClassNames<S> {
                const classNames: Partial<ClassNames<S>> = {};

                if (this.hasStyleSheet()) {
                    for (const key in this.state.styleSheet.classes) {
                        if (this.state.styleSheet.classes.hasOwnProperty(key)) {
                            classNames[key] = typeof classNames[key] !== "undefined"
                                ? `${classNames[key]} ${this.state.styleSheet.classes[key]}`
                                : this.state.styleSheet.classes[key];
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
export { stylesheetRegistry };
