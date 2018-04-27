import { Component, ElementRef, Input, SimpleChanges } from "@angular/core";
import { SheetsManager, StyleSheet } from "jss";
import { ClassNames, ComponentStyles } from "@microsoft/fast-jss-manager";
import { eventNames } from "./utilities/get-event-names";
import jss, { stylesheetManager } from "./jss";

/**
 * State interface for JSS manager
 */
export interface IJSSManagerState {
    /**
     * Stores a JSS stylesheet containing all style rules for a component
     */
    styleSheet?: any;
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

                    if (this.state.styleSheet) {
                        this.state.styleSheet.update(this.designSystem);
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

                const state: IJSSManagerState = {};

                if (Boolean(styles)) {
                    state.styleSheet = jss.createStyleSheet(
                        styles,
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

                if (Boolean(this.state.styleSheet)) {
                    // It appears we need to update the stylesheet for any style properties defined as functions
                    // to work.
                    this.state.styleSheet.attach().update(this.designSystem);
                }
            }

            private ngOnDestroy(): void {
                if (this.hasStyleSheet()) {
                    this.state.styleSheet.detach();
                    jss.removeStyleSheet(this.state.styleSheet);
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
            private hasStyleSheet(): boolean {
                return Boolean(this.state.styleSheet);
            }

            /**
             * Merges static and dynamic stylesheet classnames into one object
             */
            private getClassNames(): ClassNames<S> {
                const classNames: Partial<ClassNames<S>> = {};

                if (this.hasStyleSheet()) {
                    for (const key in this.state.styleSheet.classes) {
                        if (this.state.styleSheet.classes.hasOwnProperty(key as keyof S)) {
                            classNames[key as keyof S] = typeof classNames[key as keyof S] !== "undefined"
                                ? `${classNames[key as keyof S]} ${this.state.styleSheet.classes[key as keyof S]}`
                                : this.state.styleSheet.classes[key as keyof S];
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
