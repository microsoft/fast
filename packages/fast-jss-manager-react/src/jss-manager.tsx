import * as React from "react";
import { jss, stylesheetManager, stylesheetRegistry } from "./jss";
import SheetManager from "./sheet-manager";
import { DesignSystem } from "./design-system-provider";
import {
    ComponentStyles,
    ComponentStyleSheet,
    ManagedClasses,
} from "@microsoft/fast-jss-manager";
import { isEqual, mergeWith, pickBy } from "lodash-es";
import { designSystemContext } from "./context";
import { SheetTracker } from "./tracker";

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

        if (this.props.jssStyleSheet) {
            this.createPropStyleSheet();
        }
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

    public componentDidUpdate(prevProps: ManagedJSSProps<T, S, C>): void {
        let shouldUpdate: boolean = false;
        const hasSheetProps: boolean = !!this.props.jssStyleSheet;
        const hadSheetProps: boolean = !!prevProps.jssStyleSheet;

        if (this.designSystem !== this.context) {
            if (!!this.styles) {
                JSSManager.sheetManager.update(
                    this.styles,
                    this.designSystem,
                    this.context
                );

                shouldUpdate = true;
            }

            if (
                hadSheetProps &&
                hasSheetProps &&
                prevProps.jssStyleSheet !== this.props.jssStyleSheet
            ) {
                JSSManager.sheetManager.remove(
                    prevProps.jssStyleSheet,
                    this.designSystem
                );
                this.createPropStyleSheet();
                shouldUpdate = true;
            } else if (
                hadSheetProps &&
                hasSheetProps &&
                prevProps.jssStyleSheet === this.props.jssStyleSheet
            ) {
                JSSManager.sheetManager.update(
                    this.props.jssStyleSheet,
                    this.designSystem,
                    this.context
                );
                shouldUpdate = true;
            } else if (hadSheetProps && !hasSheetProps) {
                JSSManager.sheetManager.remove(
                    prevProps.jssStyleSheet,
                    this.designSystem
                );
            } else if (!hadSheetProps && hasSheetProps) {
                this.createPropStyleSheet();
                shouldUpdate = true;
            }

            this.designSystem = this.context;
        } else if (
            hadSheetProps &&
            hasSheetProps &&
            prevProps.jssStyleSheet !== this.props.jssStyleSheet
        ) {
            JSSManager.sheetManager.remove(prevProps.jssStyleSheet, this.designSystem);

            this.createPropStyleSheet();
        }

        if (hadSheetProps && !hasSheetProps) {
            JSSManager.sheetManager.remove(prevProps.jssStyleSheet, this.designSystem);
        } else if (!hadSheetProps && hasSheetProps) {
            this.createPropStyleSheet();
        }

        // TODO we need to make updates if jssStyleSheet changes
        if (shouldUpdate) {
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

        return mergeWith(primaryClasses, secondaryClasses, this.mergeClassNames);
    }

    private mergeClassNames(a: string, b: string): string {
        if (typeof a === "string" && typeof b === "string") {
            return a.concat(" ", b);
        } else if (typeof a === "string") {
            return a;
        } else if (typeof b === "string") {
            return b;
        }
    }

    private createPropStyleSheet(): void {
        JSSManager.sheetManager.add(
            this.props.jssStyleSheet,
            this.designSystem,
            this.index + 1
        );
    }
}

export { JSSManager };
