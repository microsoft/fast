import * as React from "react";
import { jss, stylesheetManager, stylesheetRegistry } from "./jss";
import SheetManager from "./sheetManager";
import { DesignSystem } from "./design-system-provider";
import {
    ComponentStyles,
    ComponentStyleSheet,
    ManagedClasses,
} from "@microsoft/fast-jss-manager";
import { isEqual, pickBy } from "lodash-es";
import { designSystemContext } from "./context";
import { SheetTracker } from "./tracker";

/**
 * Registry class would expose simple API for associating design systems, use counts, and style objects
 * @method create(styles, designSystem)
 * @description creates a new association if one doesn't exit. If one does exist, it simply increments the
 * count.
 *
 * @method read(styles, designSystem)
 * @description retrieves the JSS sheet mapping to both styles and designSystem
 *
 *
 * @method update(styles, previousDesignSystem, nextDesignSystem)
 * @description Associates the stylesheet with a different design system
 *
 * @method delete(styles, designSystem)
 * @description decrements a count for a set of stylesheets. If the count becomes 0,
 * the sheet is removed from the DOM
 */

/**
 * Describes an interface for adjusting a styled component
 * per component instance
 */
export interface JSSManagedComponentProps<S, C> {
    jssStyleSheet?: Partial<ComponentStyles<S, C>>;
}

/** Describes the JSS StyleSheet object
 * that is returned form jss.createStyleSheet
 */
export interface JSSStyleSheet {
    attached: boolean;
    classes: { [key: string]: string };
    options: { index: number };
    attach(): JSSStyleSheet;
    update(config: unknown): JSSStyleSheet;
}

/**
 * Prop typing for the JSSManager
 */
export type ManagedJSSProps<T, S, C> = Pick<
    T,
    Exclude<keyof T, keyof ManagedClasses<C>>
> &
    JSSManagedComponentProps<S, C>;

abstract class JSSManager<T, S, C> extends React.Component<ManagedJSSProps<T, S, C>, {}> {
    /**
     * JSS allows us to use an index to order the created style elements. The higher the index,
     * the later in the document the style element will be created.
     *
     * This static index allows us to globally track every stylesheet created by the JSSManager. Each
     * instance decrements this index and assigns itself the decremented value. The effect of this is that
     * a React parent will always have a higher index than it's children because react constructs trees
     * recursively starting at the root. With a parent always having a higher index then it's children,
     * we can inform JSS of this order preference and ensure parent stylesheets always come later in the DOM.
     *
     * Inspiration for this approach to style element ordering comes from
     * https://github.com/cssinjs/react-jss/blob/master/src/injectSheet.js
     */
    private static index: number = -1000;
    /**
     * Define the contextType for the manager to be the design system context
     */
    private static contextType: React.Context<unknown> = designSystemContext;

    /**
     * Manages stylesheets
     */
    private static sheetManager: SheetManager = new SheetManager();

    /**
     * The source style object that should be compiled into a StyleSheet
     */
    protected abstract styles: ComponentStyles<S, C> | void;

    /**
     * The component that should have styles and classes managed by the JSSManager
     */
    protected abstract managedComponent: React.ComponentType<T & ManagedClasses<S>>;

    /**
     * The stylesheet index for the JSSManager instance
     */
    private index: number;

    /**
     * Store the design-system as an instance property because
     * react does not give us first-class support for detecting changes
     * to context values
     */
    private designSystem: C;

    constructor(props: ManagedJSSProps<T, S, C>, context: C) {
        super(props, context);

        this.index = JSSManager.index--;
        this.designSystem = context;
    }

    public componentDidMount(): void {
        /*
         * We need to check here if we have a stylesheet compiled with our
         * designSystem and style object. If we do, then don't do anything.
         * If we don't, we need to go create the stylesheet
         */
        if (!!this.styles) {
            JSSManager.sheetManager.add(this.styles, this.designSystem, this.index);
            this.forceUpdate();
        }
    }

    public render(): JSX.Element {
        return React.createElement(this.managedComponent, this.managedComponentProps());
    }

    public componentDidUpdate(): void {
        if (this.designSystem !== this.context && !!this.styles) {
            JSSManager.sheetManager.update(
                this.styles,
                this.designSystem as any,
                this.context
            );
            this.designSystem = this.context;
            this.forceUpdate();

            return;
        }
    }

    public componentWillUnmount(): void {
        if (this.styles) {
            JSSManager.sheetManager.remove(this.styles, this.designSystem as any);
        }
    }

    /**
     * Creates a JSS stylesheet from the dynamic portion of an associated style object and any style object passed
     * as props
     */
    private createStyleSheet(): SheetTracker {
        if (!this.styles) {
            return;
        }

        const stylesheet: ComponentStyleSheet<S, C> =
            typeof this.styles === "function"
                ? this.styles(this.designSystem)
                : this.styles;

        const jssSheet: any = jss.createStyleSheet(stylesheet, {
            link: true,
            index: this.index,
        });

        stylesheetRegistry.add(jssSheet);

        jssSheet.attach().update(this.designSystem);

        return new SheetTracker(jssSheet);
    }

    /**
     * Return the JSSStyleSheet associated with the current designSystem and style
     */
    private primaryStyleSheet(): JSSStyleSheet | void {
        return JSSManager.sheetManager.get(this.styles as any, this.designSystem as any);
    }

    /**
     * Generate a prop object to give to the managed component
     */
    private managedComponentProps(): T & ManagedClasses<S> {
        return {
            ...pickBy(this.props, this.pickManagedComponentProps),
            managedClasses: this.getManagedClassNames(),
        } as T & ManagedClasses<S>;
    }

    /**
     * pickBy callback to determine if props should be used
     */
    private pickManagedComponentProps(value: unknown, key: string): boolean {
        return key !== "managedClasses" && key !== "jssStyleSheet";
    }

    /**
     * Returns the classes to pass down to the managed component
     */
    private getManagedClassNames(): ManagedClasses<S> {
        let primaryClasses: ManagedClasses<S> | void;

        const primarySheet: JSSStyleSheet | void = this.primaryStyleSheet();

        if (!!primarySheet && primarySheet.hasOwnProperty("classes")) {
            primaryClasses = primarySheet.classes;
        }

        return primaryClasses || {};
    }
}

export { JSSManager };

// /**
//  * State interface for JSS manager
//  */
// export interface JSSManagerState {
//     /**
//      * Stores a JSS stylesheet containing all config-driven styles rules for a component
//      */
//     styleSheet?: any;
// }
//
// export interface JSSManagerProps<S, C> extends JSSManagedComponentProps<S, C> {
//     /**
//      * The styles for the JSS manager to compile
//      */
//     styles?: ComponentStyles<S, C>;
//
//     /**
//      * The design-system to compile the styles with
//      */
//     designSystem?: C;
//
//     /**
//      * Render the child component
//      */
//     render: (managedClasses: { [className in keyof S]?: string }) => React.ReactNode;
// }
//
// /**
//  * The JSSManger. This class manages JSSStyleSheet compilation and passes generated class-names
//  * down to child component
//  */
// export class JSSManager<S, C> extends React.Component<
//     JSSManagerProps<S, C>,
//     JSSManagerState
// > {
//     /**
//      * The style manager is responsible for attaching and detaching style elements when
//      * components mount and un-mount
//      */
//     private static stylesheetManager: SheetsManager = stylesheetManager;
//
//     /**
//      * JSS allows us to use an index to order the created style elements. The higher the index,
//      * the later in the document the style element will be created.
//      *
//      * This static index allows us to globally track every stylesheet created by the JSSManager. Each
//      * instance decrements this index and assigns itself the decremented value. The effect of this is that
//      * a React parent will always have a higher index than it's children because react constructs trees
//      * recursively starting at the root. With a parent always having a higher index then it's children,
//      * we can inform JSS of this order preference and ensure parent stylesheets always come later in the DOM.
//      *
//      * Inspiration for this approach to style element ordering comes from
//      * https://github.com/cssinjs/react-jss/blob/master/src/injectSheet.js
//      */
//     private static index: number = -1000;
//
//     /**
//      * The stylesheet index for the JSSManager instance
//      */
//     private index: number;
//
//     constructor(props: JSSManagerProps<S, C>) {
//         super(props);
//
//         const state: JSSManagerState = {};
//         this.index = JSSManager.index--;
//
//         if (Boolean(props.styles)) {
//             state.styleSheet = this.createStyleSheet();
//             state.styleSheet.attach();
//             state.styleSheet.update(props.designSystem);
//         }
//
//         this.state = state;
//     }
//
//     public componentDidUpdate(
//         prevProps: JSSManagerProps<S, C>,
//         prevState: JSSManagerState
//     ): void {
//         // If we have new style assignments, we always need to reset the stylesheet from scratch
//         // else, if the designSystem has changed, update the stylesheet with new design system values
//         if (this.props.jssStyleSheet !== prevProps.jssStyleSheet) {
//             this.resetStyleSheet();
//         } else if (!isEqual(this.props.designSystem, prevProps.designSystem)) {
//             this.updateStyleSheet();
//         }
//     }
//
//     public componentWillUnmount(): void {
//         this.removeStyleSheet();
//
//         // Increment the global stylesheet index tracker when a component unmounts
//         // so that we can recycle index values and avoid eventually running out of numbers
//         // if an application lives for a long time.
//         JSSManager.index++;
//     }
//
//     public render(): React.ReactNode {
//         return this.props.render(this.classNames());
//     }
//
//     /**
//      * Updates a dynamic stylesheet with context
//      */
//     public updateStyleSheet(): void {
//         if (!Boolean(this.state.styleSheet)) {
//             return;
//         }
//
//         if (typeof this.props.styles === "function") {
//             this.resetStyleSheet();
//         } else {
//             this.state.styleSheet.update(this.props.designSystem);
//         }
//     }
//
//     /**
//      * Remove a JSS stylesheet
//      */
//     private removeStyleSheet(): void {
//         if (this.hasStyleSheet()) {
//             this.state.styleSheet.detach();
//             stylesheetRegistry.remove(this.state.styleSheet);
//             jss.removeStyleSheet(this.state.styleSheet);
//         }
//     }
//
//     /**
//      * Reset a JSS stylesheet relative to current props
//      */
//     private resetStyleSheet(): void {
//         this.removeStyleSheet();
//         this.setState(
//             (
//                 previousState: JSSManagerState,
//                 props: JSSManagerProps<S, C>
//             ): Partial<JSSManagerState> => {
//                 return {
//                     styleSheet: this.hasStyleSheet() ? this.createStyleSheet() : null,
//                 };
//             },
//             (): void => {
//                 if (this.hasStyleSheet()) {
//                     this.state.styleSheet.attach().update(this.props.designSystem);
//                 }
//             }
//         );
//     }
//
//     /**
//      * Creates a JSS stylesheet from the dynamic portion of an associated style object and any style object passed
//      * as props
//      */
//     private createStyleSheet(): any {
//         const stylesheet: ComponentStyleSheet<S, C> =
//             typeof this.props.styles === "function"
//                 ? this.props.styles(this.props.designSystem)
//                 : this.props.styles;
//
//         const jssSheet: any = jss.createStyleSheet(
//             merge({}, stylesheet, this.props.jssStyleSheet),
//             {
//                 link: true,
//                 index: this.index,
//             }
//         );
//
//         stylesheetRegistry.add(jssSheet);
//
//         return jssSheet;
//     }
//
//     /**
//      * Checks to see if this component has an associated dynamic stylesheet
//      */
//     private hasStyleSheet(): boolean {
//         return Boolean(this.props.styles || this.props.jssStyleSheet);
//     }
//
//     /**
//      * returns the compiled classes
//      */
//     private classNames(): { [className in keyof S]?: string } {
//         return this.hasStyleSheet() ? this.state.styleSheet.classes : {};
//     }
// }
