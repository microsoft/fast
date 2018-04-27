import { Component, ElementRef, Input, SimpleChanges } from "@angular/core";
import { getDynamicStyles, SheetsManager, StyleSheet } from "jss";
import { uniqueId } from "lodash-es";
import { ClassNames, ComponentStyles } from "@microsoft/fast-jss-manager";
import { eventNames } from "./utilities/get-event-names";
import { isEmptyObject } from "./utilities/object";
import jss, { stylesheetManager } from "./jss";

/**
 * State interface for JSS manager
 */
export interface IJSSManagerState {
    /**
     * Stores a JSS stylesheet containing all config-driven styles rules for a component
     */
    dynamicStyleSheet?: any;
}

function manageJss<S, C>(styles?: ComponentStyles<S, C>): <T>(BaseComponent: any) => any {
    return function(BaseComponent: any): any {

        class JSSManager extends BaseComponent {
            /**
             * The style manager is responsible for attaching and detaching style elements when
             * components mount and un-mount
             */
            private static stylesheetManager: SheetsManager = stylesheetManager;

            /**
             * Map of all components that have been initialized via this component
             */
            private static componentMap: WeakMap<any, string> = new WeakMap();

            /**
             * Map of all style objects that have been initialized via this component
             */
            private static styleMap: WeakMap<any, string> = new WeakMap();

            /**
             * All static and dynamic styles for this component
             */
            private static styles: ComponentStyles<S, C>;

            /**
             * The HTML class names as determined by the static and dymanic styles
             */
            private className: string;

            /**
             * The JSS managers state object
             */
            private state: any;

            private ngOnInit(): void {
                if (super.ngOnInit) {
                    super.ngOnInit();
                }

                this.state = {};

                this.el.nativeElement.addEventListener(eventNames.getConfig, (e: CustomEvent) => {
                    this.config = e.detail;

                    if (this.state.dynamicStyleSheet) {
                        this.state.dynamicStyleSheet.update(this.designSystem);
                    }
                }, true);

                const registerComponentEvent: CustomEvent = new CustomEvent(eventNames.registerComponent);
                this.el.nativeElement.dispatchEvent(registerComponentEvent);

                const updateStylesEvent: CustomEvent = new CustomEvent(eventNames.getConfig, {detail: {}});
                this.el.nativeElement.dispatchEvent(updateStylesEvent);

                this.el.nativeElement.addEventListener(eventNames.update, (e: CustomEvent) => {
                    this.el.nativeElement.dispatchEvent(updateStylesEvent);
                }, true);
            }

            private ngAfterContentInit(): void {
                if (super.ngAfterContentInit) {
                    super.ngAfterContentInit();
                }

                JSSManager.styles = styles;

                const state: IJSSManagerState = {};

                if (Boolean(JSSManager.styles)) {
                    state.dynamicStyleSheet = jss.createStyleSheet(
                        JSSManager.styles,
                        { link: true }
                    );
                }

                this.state = state;

                this.className = this.getClassNames()[(Object.keys(styles)[0] as any)];
            }

            private ngAfterViewInit(): void {
                if (super.ngAfterViewInit) {
                    super.ngAfterViewInit();
                }

                if (Boolean(this.state.dynamicStyleSheet)) {
                    // It appears we need to update the stylesheet for any style properties defined as functions
                    // to work.
                    this.state.dynamicStyleSheet.attach().update(this.designSystem);
                }
            }

            private ngOnDestroy(): void {
                if (this.hasDynamicStyleSheet()) {
                    this.state.dynamicStyleSheet.detach();
                    jss.removeStyleSheet(this.state.dynamicStyleSheet);
                }

                const deregisterComponentEvent: CustomEvent = new CustomEvent(eventNames.deregisterComponent);
                this.el.nativeElement.dispatchEvent(deregisterComponentEvent);
            }

            private get designSystem(): any {
                return this.config ? this.config : {};
            }

            /**
             * Checks to see if this component has an associated dynamic stylesheet
             */
            private hasDynamicStyleSheet(): boolean {
                return Boolean(this.state.dynamicStyleSheet);
            }

            /**
             * Merges static and dynamic stylesheet classnames into one object
             */
            private getClassNames(): ClassNames<S> {
                const classNames: Partial<ClassNames<S>> = {};

                if (this.hasDynamicStyleSheet()) {
                    for (const key in this.state.dynamicStyleSheet.classes) {
                        if (this.state.dynamicStyleSheet.classes.hasOwnProperty(key as keyof S)) {
                            classNames[key as keyof S] = typeof classNames[key as keyof S] !== "undefined"
                                ? `${classNames[key as keyof S]} ${this.state.dynamicStyleSheet.classes[key as keyof S]}`
                                : this.state.dynamicStyleSheet.classes[key as keyof S];
                        }
                    }
                }

                return classNames as ClassNames<S>;
            }
        }

        return JSSManager;
    };
}

export default manageJss;
