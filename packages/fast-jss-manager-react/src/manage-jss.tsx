/**
 * manageJss is a higher-order function that returns a higher-order component.
 * The HOC that is returned is responsible for managing JSS stylesheets for components
 * registered with manageJss.
 */
import * as React from "react";
import jss, { stylesheetManager } from "./jss";
import { getDynamicStyles } from "jss";
import getStaticStyles from "./utilities/get-static-styles";
import { isEmptyObject } from "./utilities/object";
import { SheetsManager, StyleSheet } from "jss";
import { IDesignSystemProviderProps } from "./design-system-provider";
import * as propTypes from "prop-types";
import { ClassNames, ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager";
import { isEqual, uniqueId } from "lodash-es";

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

    /**
     * Stores a JSS stylesheet containing all static style rules for a component
     */
    staticStyleSheet?: any;
}

/**
 * Defines a object that has been separated into dynamic and static stylesheets
 */
export interface ISeparatedStylesheet<T, C> {
    /**
     * The static styles for a given component and stylesheet combination
     * TODO: these are always static so they shouldn't use CSSRuleResolver
     */
    staticStyles?: ComponentStyles<T, C>;

    /**
     * Store the jss stylesheet so that multiple components can access it
     */
    staticStyleSheet?: any;

    /**
     * The dynamic styles for a given component and stylesheet combination
     */
    dynamicStyles?: ComponentStyles<T, C>;
}

/**
 * Main entry into the style manager. This function accepts a JSS style object and returns a
 * higher order component. That higher-order component can then be used to compose a component
 * with styles managed
 */
/* tslint:disable-next-line */
function manageJss<S, C>(styles?: ComponentStyles<S, C>): <T>(Component: React.ComponentType<T & IManagedClasses<S>>) => React.ComponentType<T> {
    return function<T>(Component: React.ComponentType<T & IManagedClasses<S>>): React.ComponentType<T> {

        // Define the manager higher-order component inside of the return method of the higher-order function.
        class JSSManager extends React.Component<T, IJSSManagerState> {
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
             * Store references to all separated stylesheets
             */
            private static separatedStyles: {[key: string]: ISeparatedStylesheet<S, C>} = {};

            /**
             * Tracks the ID of an instance of the JSSManager. Multiple instances can have the same ID
             * if the the backing Component and styles objects are shared because the ID is is derived from
             * both the Component and styles IDs
             */
            private instanceId: string;

            constructor(props: T) {
                super(props);

                // On construction, check if the style object or component object have already been used.
                // If not, we need to store them in our weakmaps for later use
                if (!Boolean(JSSManager.styleMap.get(styles))) {
                    JSSManager.styleMap.set(styles, uniqueId());
                }

                if (!Boolean(JSSManager.componentMap.get(Component))) {
                    JSSManager.componentMap.set(Component, uniqueId());
                }

                const styleId: string = JSSManager.styleMap.get(styles);
                const componentId: string = JSSManager.componentMap.get(Component);

                // Store the instance id as a combination of the generated IDs
                this.instanceId = `${componentId}${styleId}`;
                let separatedStylesInstance: ISeparatedStylesheet<S, C> = JSSManager.separatedStyles[this.instanceId];

                // Check if we have a separatedStyles object stored at the instanceId key.
                // If we don"t, we need to create that object
                if (!Boolean(separatedStylesInstance)) {
                    separatedStylesInstance = JSSManager.separatedStyles[this.instanceId] = this.separateStyles(styles);
                }

                // Now lets store those newly created stylesheet objects in state so we can easily reference them later
                // Since dynamic styles can be different across components, we should create the dynamic styles as a
                // new object so that identity checks between dynamic stylesheets do not pass.
                const state: IJSSManagerState = {};

                // Extract the static stylesheet and dynamic style object and apply them to the state
                // object if they exist
                const staticStyleSheet: StyleSheet = separatedStylesInstance.staticStyleSheet;
                const dynamicStyles: StyleSheet = separatedStylesInstance.dynamicStyles;

                if (Boolean(staticStyleSheet)) {
                    state.staticStyleSheet = separatedStylesInstance.staticStyleSheet;
                }

                if (Boolean(dynamicStyles)) {
                    state.dynamicStyleSheet = jss.createStyleSheet(
                        JSSManager.separatedStyles[this.instanceId].dynamicStyles,
                        { link: true }
                    );
                }

                this.state = state;
            }

            public componentWillMount(): void {
                if (Boolean(this.state.staticStyleSheet)) {
                    JSSManager.stylesheetManager.add(this.state.staticStyleSheet, this.state.staticStyleSheet);
                    JSSManager.stylesheetManager.manage(this.state.staticStyleSheet);
                }

                if (Boolean(this.state.dynamicStyleSheet)) {
                    // It appears we need to update the stylesheet for any style properties defined as functions
                    // to work.
                    // TODO: We'll need to call this with a context if it exists

                    this.state.dynamicStyleSheet.attach().update(this.designSystem);
                }
            }

            public componentWillUpdate(nextProps: T, nextState: IJSSManagerState, nextContext: any): void {
                if (!isEqual(this.context, nextContext)) {
                    this.state.dynamicStyleSheet.update(nextContext.designSystem);
                }
            }

            public componentWillUnmount(): void {
                if (this.hasStaticStyleSheet()) {
                    JSSManager.stylesheetManager.unmanage(this.state.staticStyleSheet);
                }

                if (this.hasDynamicStyleSheet()) {
                    this.state.dynamicStyleSheet.detach();
                    jss.removeStyleSheet(this.state.dynamicStyleSheet);
                }
            }

            public render(): React.ReactNode {
                return (
                    <Component
                        {...this.props}
                        managedClasses={this.getClassNames()}
                    />
                );
            }

            private get designSystem(): any {
                return this.context && this.context.designSystem ? this.context.designSystem : {};
            }

            /**
             * Checks to see if this component has an associated static stylesheet
             */
            private hasStaticStyleSheet(): boolean {
                return Boolean(this.state.staticStyleSheet);
            }

            /**
             * Checks to see if this component has an associated dynamic stylesheet
             */
            private hasDynamicStyleSheet(): boolean {
                return Boolean(this.state.dynamicStyleSheet);
            }

            /**
             * Separates a single ComponentStyles object into an ISeparatedStylesheet object
             * If either a dynamic or static stylesheet is empty (there are no styles) then that
             * key will not be created.
             */
            private separateStyles(componentStyles: ComponentStyles<S, C>): ISeparatedStylesheet<S, C> {
                // TODO: write a test for this method to make sure it always returns an object.
                // TODO: write a test to make sure this does not create a static/dynamic key if
                //       no corresponding styles are passed
                const dynamicStyles: ComponentStyles<S, C> = getDynamicStyles(componentStyles);

                // TODO: figure out how to type this without coercion
                const staticStyles: ComponentStyles<S, C> = getStaticStyles(componentStyles) as ComponentStyles<S, C>;
                const separatedStyles: ISeparatedStylesheet<S, C> = {};

                if (Boolean(dynamicStyles) && !isEmptyObject(dynamicStyles)) {
                    separatedStyles.dynamicStyles = dynamicStyles;
                }

                if (Boolean(staticStyles) && !isEmptyObject(staticStyles)) {
                    separatedStyles.staticStyles = staticStyles;
                    separatedStyles.staticStyleSheet = jss.createStyleSheet(staticStyles);
                }

                return separatedStyles;
            }

            /**
             * Merges static and dynamic stylesheet classnames into one object
             */
            private getClassNames(): ClassNames<S> {
                let classNames: Partial<ClassNames<S>> = {};

                if (this.hasStaticStyleSheet()) {
                    classNames = Object.assign({}, this.state.staticStyleSheet.classes);
                }

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
