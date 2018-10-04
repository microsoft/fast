import * as React from "react";
import { jss, stylesheetManager, stylesheetRegistry } from "./jss";
import { SheetsManager } from "jss";
import { IDesignSystem } from "./design-system-provider";
import { ClassNames, ComponentStyles, ComponentStyleSheet, IManagedClasses } from "@microsoft/fast-jss-manager";
import { isEqual, merge } from "lodash-es";
import { Consumer } from "./context";

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
export interface IJSSManagedComponentProps<S, C> {
    jssStyleSheet?: Partial<ComponentStyles<S, C>>;
}

export interface IJSSManagerProps<S, C> extends IJSSManagedComponentProps<S, C> {
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
> & IJSSManagedComponentProps<S, C>;

/**
 * The JSSManger. This class manages JSSStyleSheet compilation and passes generated class-names
 * down to child component
 */
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

            // It appears we need to update the stylesheet for any style properties defined as functions
            // to work.
            state.styleSheet.update(props.designSystem);
        }

        this.state = state;
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
    private resetStyleSheet(): void {
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
    }
}
