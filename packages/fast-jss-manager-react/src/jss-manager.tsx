import React from "react";
import { jss, stylesheetManager, stylesheetRegistry } from "./jss";
import SheetManager from "./sheet-manager";
import { DesignSystem } from "./design-system-provider";
import {
    ComponentStyles,
    ComponentStyleSheet,
    ManagedClasses,
} from "@microsoft/fast-jss-manager";
import { isEqual, mergeWith } from "lodash-es";
import { designSystemContext } from "./context";

/**
 * Describes an interface for adjusting a styled component
 * per component instance
 */
export interface JSSManagedComponentProps<T, S, C> {
    /**
     * The component instance stylesheet
     */
    jssStyleSheet?: Partial<ComponentStyles<S, C>>;

    /**
     * React reference to the component instance managed by the JSSManager
     */
    innerRef?: React.LegacyRef<React.Component<T & ManagedClasses<S>>>;
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
    JSSManagedComponentProps<T, S, C>;

export function mergeClassNames(a: string | void, b: string | void): string | void {
    if (typeof a === "string" && typeof b === "string") {
        return a.concat(" ", b);
    } else if (typeof a === "string") {
        return a;
    } else if (typeof b === "string") {
        return b;
    }
}

abstract class JSSManager<T, S, C> extends React.Component<ManagedJSSProps<T, S, C>, {}> {
    /**
     * Define the contextType for the manager to be the design system context
     */

    public static contextType: React.Context<unknown> = designSystemContext;
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
     * Manages stylesheets
     */
    private static sheetManager: SheetManager = new SheetManager();

    /**
     * React context instance data
     */
    public context: C;

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
     * Simple switch to track the initial creation of styles.
     * Because the "styles" property is abstract and abstract properties
     * are not accessible in the constructor,  we need to compile styles
     * inside the first call of the render function
     */
    private hasCreatedIntialStyleSheets: boolean = false;

    /**
     * Store the design-system as an instance property because
     * react does not give us first-class support for detecting changes
     * to context values
     */
    private designSystem: C;

    constructor(props: ManagedJSSProps<T, S, C>, context: C) {
        super(props, context);

        this.index = JSSManager.index -= 1;
        this.designSystem = context;
    }

    public render(): JSX.Element {
        if (!this.hasCreatedIntialStyleSheets) {
            if (!!this.styles) {
                JSSManager.sheetManager.add(this.styles, this.designSystem, {
                    meta: this.managedComponent.displayName || this.managedComponent.name,
                    index: this.index,
                });
            }

            if (this.props.jssStyleSheet) {
                this.createPropStyleSheet();
            }

            this.hasCreatedIntialStyleSheets = true;
        }

        return React.createElement(this.managedComponent, this.managedComponentProps());
    }

    public componentDidUpdate(prevProps: ManagedJSSProps<T, S, C>): void {
        const hasSheetProps: boolean = !!this.props.jssStyleSheet;
        const hadSheetProps: boolean = !!prevProps.jssStyleSheet;

        if (this.designSystem !== this.context) {
            if (!!this.styles) {
                JSSManager.sheetManager.update(
                    this.styles,
                    this.designSystem,
                    this.context
                );

                this.forceUpdate();
            }

            if (hadSheetProps && hasSheetProps) {
                if (prevProps.jssStyleSheet === this.props.jssStyleSheet) {
                    JSSManager.sheetManager.update(
                        this.props.jssStyleSheet,
                        this.designSystem,
                        this.context
                    );
                } else {
                    JSSManager.sheetManager.remove(
                        prevProps.jssStyleSheet,
                        this.designSystem
                    );
                    this.createPropStyleSheet(this.context);
                }

                this.forceUpdate();
            } else if (hadSheetProps && !hasSheetProps) {
                JSSManager.sheetManager.remove(
                    prevProps.jssStyleSheet,
                    this.designSystem
                );
            } else if (!hadSheetProps && hasSheetProps) {
                this.createPropStyleSheet(this.context);
                this.forceUpdate();
            }

            this.designSystem = this.context;
        } else if (
            hadSheetProps &&
            hasSheetProps &&
            prevProps.jssStyleSheet !== this.props.jssStyleSheet
        ) {
            JSSManager.sheetManager.remove(prevProps.jssStyleSheet, this.designSystem);

            this.createPropStyleSheet();
            this.forceUpdate();
        }

        if (hadSheetProps && !hasSheetProps) {
            JSSManager.sheetManager.remove(prevProps.jssStyleSheet, this.designSystem);
        } else if (!hadSheetProps && hasSheetProps) {
            this.createPropStyleSheet();
            this.forceUpdate();
        }
    }

    public componentWillUnmount(): void {
        if (this.styles) {
            JSSManager.sheetManager.remove(this.styles, this.designSystem);
        }

        if (this.props.jssStyleSheet) {
            JSSManager.sheetManager.remove(this.props.jssStyleSheet, this.designSystem);
        }

        JSSManager.index++;

        // reset style creation tracker in case the instance is re-used
        this.hasCreatedIntialStyleSheets = false;
    }

    /**
     * Return the JSSStyleSheet associated with the current designSystem and style
     */
    private primaryStyleSheet(): JSSStyleSheet | void {
        if (!!this.styles) {
            return JSSManager.sheetManager.get(this.styles, this.designSystem);
        }
    }

    /**
     * Return the JSSStylesheet associated with the jssStyleSheet prop
     */
    private secondaryStyleSheet(): JSSStyleSheet | void {
        if (!!this.props.jssStyleSheet) {
            return JSSManager.sheetManager.get(
                this.props.jssStyleSheet,
                this.designSystem
            );
        }
    }

    /**
     * Generate a prop object to give to the managed component
     */
    private managedComponentProps(): T & ManagedClasses<S> {
        const props: ManagedJSSProps<T, S, C> = {
            ...(this.props as any),
            managedClasses: this.getManagedClassNames(),
            ref: this.props.innerRef,
        };

        delete props.jssStyleSheet;
        delete props.innerRef;

        return props as T & ManagedClasses<S>;
    }

    /**
     * Returns the classes to pass down to the managed component
     */
    private getManagedClassNames(): ManagedClasses<S> {
        let primaryClasses: ManagedClasses<S> = {};
        let secondaryClasses: ManagedClasses<S> = {};

        const primarySheet: JSSStyleSheet | void = this.primaryStyleSheet();
        const secondarySheet: JSSStyleSheet | void = this.secondaryStyleSheet();

        if (!!primarySheet && primarySheet.hasOwnProperty("classes")) {
            primaryClasses = Object.assign({}, primarySheet.classes);
        }

        if (!!secondarySheet && secondarySheet.hasOwnProperty("classes")) {
            secondaryClasses = Object.assign({}, secondarySheet.classes);
        }

        return mergeWith(primaryClasses, secondaryClasses, mergeClassNames);
    }

    private createPropStyleSheet(designSystem: C = this.designSystem): void {
        const stylesheet: any = this.primaryStyleSheet();

        JSSManager.sheetManager.add(this.props.jssStyleSheet, designSystem, {
            meta: `${this.managedComponent.displayName ||
                this.managedComponent.name} - jssStyleSheet`,
            index: stylesheet ? stylesheet.options.index + 1 : this.index + 1,
        });
    }
}

export { JSSManager };
