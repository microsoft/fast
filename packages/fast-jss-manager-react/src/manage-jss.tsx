/**
 * manageJss is a higher-order function that returns a higher-order component.
 * The HOC that is returned is responsible for managing JSS stylesheets for components
 * registered with manageJss.
 */
import * as React from "react";
import jss, { stylesheetManager, stylesheetRegistry } from "./jss";
import { SheetsManager, StyleSheet } from "jss";
import { IDesignSystem } from "./design-system-provider";
import * as propTypes from "prop-types";
import { ClassNames, ComponentStyles, ComponentStyleSheet, IManagedClasses } from "@microsoft/fast-jss-manager";
import { isEqual, merge, omit, pick } from "lodash-es";
import { Consumer } from "./context";

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
 * Describes an interface for adjusting a styled component
 * per component instance
 */
export interface IInstanceStyleSheet<S, C> {
    jssStyleSheet?: Partial<ComponentStyles<S, C>>;
}

export interface IJSSManagerProps<S, C> extends IInstanceStyleSheet<S, C> {
    /**
     * The styles for the JSS manager to compile
     */
    styles?: ComponentStyles<S, C>;

    /**
     * The design-system to compile the styles with
     */
    designSystem?: C;

    /**
     * Render the child component
     */
    render: (managedClasses: ClassNames<S> ) => React.ReactNode;
}

/**
 * Prop typing for the JSSManager
 */
export type ManagedJSSProps<T, S, C> =
Pick<
    T,
    Exclude<
        keyof T,
        keyof IManagedClasses<C>
    >
> & IInstanceStyleSheet<S, C>;

export function cleanLowerOrderComponentProps<T, S, C>(props: ManagedJSSProps<T, S, C>): T {
    // TODO: We can make this more performant, running into type issues so leaving as is for now.
    return pick(props, Object.keys(props).filter((key: string) => {
        return key !== "jssStyleSheet" && key !== "managedClasses";
    })) as T;
}

/**
 * Main entry into the style manager. This function accepts a JSS style object and returns a
 * higher order component. That higher-order component can then be used to compose a component
 * with styles managed
 * @param S - The stylesheet class-name contract
 * @param C - The stylesheet design-system configuration object
 * @param T - The component prop interface
 */
function manageJss<S, C>(
    styles?: ComponentStyles<S, C>
): <T>(
    Component: React.ComponentType<T & IManagedClasses<S>>
) => React.SFC<ManagedJSSProps<T, S, C>> {
    return function<T>(
        Component: React.ComponentType<T & IManagedClasses<S>>
    ): React.SFC<ManagedJSSProps<T, S, C>> {
        return (props: ManagedJSSProps<T, S, C>): React.ReactElement<React.Consumer<unknown>> => {
            /**
             * Define the render prop of the JSSManager. generated class-names are passed into
             * this function and provided to the wrapped component
             */
            function renderLowerOrderComponent(
                managedClasses: ClassNames<S>
            ): React.ReactNode {
                return (
                    <Component
                        {...cleanLowerOrderComponentProps(props)}
                        managedClasses={managedClasses}
                    />
                );
            }

            /**
             * React Stateless Functional Component to render the JSSManager
             * with props from Consumer
             */
            function renderJSSManager(designSystem: C): React.ReactNode {
                return (
                    <JSSManager
                        styles={styles}
                        designSystem={designSystem}
                        jssStyleSheet={props.jssStyleSheet || null}
                        render={renderLowerOrderComponent}
                    />
                );
            }

            return (
                <Consumer>
                    {renderJSSManager}
                </Consumer>
            );
        };
    };
}

// function BLARG<S, C>(
//     styles?: ComponentStyles<S, C>
// ): <T>(
//     Component: React.ComponentType<T & IManagedClasses<S>>
// ) => React.ComponentClass<ManagedJSSProps<T, S, C>> {
//     return function<T>(
//         Component: React.ComponentType<T & IManagedClasses<S>>
//     ): React.ComponentClass<ManagedJSSProps<T, S, C>> {

//         // Define the manager higher-order component inside of the return method of the higher-order function.
//         class JSSManager extends React.Component<ManagedJSSProps<T, S, C>, IJSSManagerState> {
//             // TODO: figure out if there is a better way to type this object
//             public static contextTypes: any = {
//                 designSystem: propTypes.any
//             };

//             /**
//              * The style manager is responsible for attaching and detaching style elements when
//              * components mount and un-mount
//              */
//             private static stylesheetManager: SheetsManager = stylesheetManager;

//             constructor(props: ManagedJSSProps<T, S, C>) {
//                 super(props);

//                 const state: IJSSManagerState = {};

//                 if (Boolean(styles)) {
//                     state.styleSheet = this.createStyleSheet();
//                 }

//                 this.state = state;
//             }

//             /**
//              * Updates a dynamic stylesheet with context
//              */
//             public updateStyleSheet(nextContext?: any): void {
//                 if (!Boolean(this.state.styleSheet)) {
//                     return;
//                 }

//                 if (typeof styles === "function") {
//                     this.resetStyleSheet();
//                 } else {
//                     this.state.styleSheet.update(nextContext && nextContext.designSystem ? nextContext.designSystem : this.designSystem);
//                 }
//             }

//             public componentWillMount(): void {
//                 if (Boolean(this.state.styleSheet)) {
//                     // It appears we need to update the stylesheet for any style properties defined as functions
//                     // to work.
//                     this.state.styleSheet.attach();
//                     this.updateStyleSheet();
//                 }
//             }

//             public componentWillUpdate(nextProps: ManagedJSSProps<T, S, C>, nextState: IJSSManagerState, nextContext: any): void {
//                 if (!isEqual(this.context, nextContext)) {
//                     this.updateStyleSheet(nextContext);
//                 }
//             }

//             public componentDidUpdate(prevProps: ManagedJSSProps<T, S, C>, prevState: IJSSManagerState): void {
//                 if (this.props.jssStyleSheet !== prevProps.jssStyleSheet) {
//                     this.resetStyleSheet();
//                 }
//             }

//             public componentWillUnmount(): void {
//                 this.removeStyleSheet();
//             }

//             public render(): React.ReactNode {
//                 return (
//                     <Component
//                         {...omit(this.props, ["jssStyleSheet"])}
//                         managedClasses={this.getClassNames()}
//                     />
//                 );
//             }

//             /**
//              * Get the design-system context to update the stylesheet with
//              */
//             private get designSystem(): any {
//                 return this.context && this.context.designSystem ? this.context.designSystem : {};
//             }

//             /**
//              * Remove a JSS stylesheet
//              */
//             private removeStyleSheet(): void {
//                 if (this.hasStyleSheet()) {
//                     this.state.styleSheet.detach();
//                     stylesheetRegistry.remove(this.state.styleSheet);
//                     jss.removeStyleSheet(this.state.styleSheet);
//                 }
//             }

//             /**
//              * Reset a JSS stylesheet relative to current props
//              */
//             private resetStyleSheet(): any {
//                 this.removeStyleSheet();
//                 this.setState((previousState: IJSSManagerState, props: ManagedJSSProps<T, S, C>): Partial<IJSSManagerState> => {
//                     return {
//                         styleSheet: this.hasStyleSheet() ? this.createStyleSheet() : null
//                     };
//                 }, (): void => {
//                     if (this.hasStyleSheet()) {
//                         this.state.styleSheet.attach().update(this.designSystem);
//                     }
//                 });
//             }

//             /**
//              * Creates a JSS stylesheet from the dynamic portion of an associated style object and any style object passed
//              * as props
//              */
//             private createStyleSheet(): any {
//                 const stylesheet: ComponentStyleSheet<S, C> = typeof styles === "function"
//                     ? styles(this.designSystem)
//                     : styles;

//                 const jssSheet: any =  jss.createStyleSheet(
//                     merge({}, stylesheet, this.props.jssStyleSheet),
//                     { link: true }
//                 );

//                 stylesheetRegistry.add(jssSheet);

//                 return jssSheet;
//             }

//             /**
//              * Checks to see if this component has an associated dynamic stylesheet
//              */
//             private hasStyleSheet(): boolean {
//                 return Boolean(styles || this.props.jssStyleSheet);
//             }

//             /**
//              * Merges static and dynamic stylesheet classnames into one object
//              */
//             private getClassNames(): ClassNames<S> {
//                 const classNames: Partial<ClassNames<S>> = {};

//                 if (this.hasStyleSheet()) {
//                     for (const key in this.state.styleSheet.classes) {
//                         if (this.state.styleSheet.classes.hasOwnProperty(key)) {
//                             classNames[key] = typeof classNames[key] !== "undefined"
//                                 ? `${classNames[key]} ${this.state.styleSheet.classes[key]}`
//                                 : this.state.styleSheet.classes[key];
//                         }
//                     }
//                 }

//                 return classNames as ClassNames<S>;
//             }
//         }

//         return hoistNonReactStatics(JSSManager, Component);
//     };
// }

/**
 * The JSSManger. This class manages JSSStyleSheet compilation and passes generated class-names
 * down to child component
 */
// TODO: remove tslint disable when BLARG is deleted
/* tslint:disable-next-line */
export class JSSManager<T, S, C> extends React.Component<IJSSManagerProps<S, C>, IJSSManagerState> {
    /**
     * The style manager is responsible for attaching and detaching style elements when
     * components mount and un-mount
     */
    private static stylesheetManager: SheetsManager = stylesheetManager;

    constructor(props: IJSSManagerProps<S, C>) {
        super(props);

        const state: IJSSManagerState = {};

        if (Boolean(props.styles)) {
            state.styleSheet = this.createStyleSheet();
            state.styleSheet.attach();
        }

        this.state = state;

        // It appears we need to update the stylesheet for any style properties defined as functions
        // to work.
        this.updateStyleSheet();
    }

    public componentDidUpdate(prevProps: IJSSManagerProps<S, C>, prevState: IJSSManagerState): void {
        // If we have new style assignments, we always need to reset the stylesheet from scratch
        // else, if the designSystem has changed, update the stylesheet with new design system values
        if (this.props.jssStyleSheet !== prevProps.jssStyleSheet) {
            this.resetStyleSheet();
        } else if (!isEqual(this.props.designSystem, prevProps.designSystem)) {
            this.updateStyleSheet();
        }

    }

    public componentWillUnmount(): void {
        this.removeStyleSheet();
    }

    public render(): React.ReactNode {
        return this.props.render(this.classNames());
    }

    /**
     * Updates a dynamic stylesheet with context
     */
    public updateStyleSheet(): void {
        if (!Boolean(this.state.styleSheet)) {
            return;
        }

        if (typeof this.props.styles === "function") {
            this.resetStyleSheet();
        } else {
            this.state.styleSheet.update(
                this.props.designSystem
            );
        }
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
        this.setState(
            (previousState: IJSSManagerState, props: IJSSManagerProps<S, C>): Partial<IJSSManagerState> => {
                return {
                    styleSheet: this.hasStyleSheet() ? this.createStyleSheet() : null
                };
            }, (): void => {
                if (this.hasStyleSheet()) {
                    this.state.styleSheet.attach().update(this.props.designSystem);
                }
            });
    }

    /**
     * Creates a JSS stylesheet from the dynamic portion of an associated style object and any style object passed
     * as props
     */
    private createStyleSheet(): any {
        const stylesheet: ComponentStyleSheet<S, C> = typeof this.props.styles === "function"
            ? this.props.styles(this.props.designSystem)
            : this.props.styles;

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
        return Boolean(this.props.styles || this.props.jssStyleSheet);
    }

    /**
     * returns the compiled classes
     */
    private classNames(): ClassNames<S> {
        return this.hasStyleSheet()
        ? this.state.styleSheet.classes
        : {};
        // const classNames: Partial<ClassNames<S>> = {};

        // TODO we probably don't need to do this
        // if (this.hasStyleSheet()) {
        //     for (const key in this.state.styleSheet.classes) {
        //         if (this.state.styleSheet.classes.hasOwnProperty(key)) {
        //             classNames[key] = typeof classNames[key] !== "undefined"
        //                 ? `${classNames[key]} ${this.state.styleSheet.classes[key]}`
        //                 : this.state.styleSheet.classes[key];
        //         }
        //     }
        // }

        // return classNames as ClassNames<S>;
    }
}

export default manageJss;
export * from "@microsoft/fast-jss-manager";
export { stylesheetRegistry };
