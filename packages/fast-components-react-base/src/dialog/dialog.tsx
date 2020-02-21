import { DialogClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames, keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import React from "react";
import { DisplayNamePrefix, extractHtmlElement } from "../utilities";
import { DialogHandledProps, DialogProps, DialogUnhandledProps } from "./dialog.props";
import { isFunction, isNil } from "lodash-es";
import Tabbable from "tabbable";

class Dialog extends Foundation<DialogHandledProps, DialogUnhandledProps, {}> {
    public static defaultProps: Partial<DialogProps> = {
        contentHeight: "480px",
        contentWidth: "640px",
        visible: false,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}Dialog`;

    protected handledProps: HandledProps<DialogHandledProps> = {
        describedBy: void 0,
        label: void 0,
        labelledBy: void 0,
        contentWidth: void 0,
        contentHeight: void 0,
        modal: void 0,
        managedClasses: void 0,
        onDismiss: void 0,
        visible: void 0,
        focusTargetOnClose: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        const {
            dialog_positioningRegion,
            dialog_contentRegion,
        }: DialogClassNameContract = this.props.managedClasses;

        return (
            <div
                ref={this.rootElement}
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                aria-hidden={!this.props.visible}
            >
                <div className={classNames(dialog_positioningRegion)}>
                    {this.renderModalOverlay()}
                    <div
                        role="dialog"
                        aria-modal={this.props.modal}
                        tabIndex={-1}
                        className={classNames(dialog_contentRegion)}
                        style={{
                            height: this.props.contentHeight,
                            width: this.props.contentWidth,
                        }}
                        aria-describedby={this.props.describedBy}
                        aria-labelledby={this.props.labelledBy}
                        aria-label={this.props.label}
                    >
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        if (canUseDOM()) {
            if (this.shouldAddKeyListener(this.props)) {
                document.addEventListener("keydown", this.handleDocumentKeyDown);
            }
            if (this.props.modal) {
                document.addEventListener("focusin", this.handleDocumentFocus);
                if (this.shouldForceFocus(document.activeElement)) {
                    this.focusOnFirstElement();
                }
            }
        }
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(prevProps: Partial<DialogHandledProps>): void {
        if (canUseDOM()) {
            if (!prevProps.modal && this.props.modal) {
                document.addEventListener("focusin", this.handleDocumentFocus);
                this.focusOnFirstElement();
            } else if (prevProps.modal && !this.props.modal) {
                document.removeEventListener("focusin", this.handleDocumentFocus);
            }

            if (
                !this.shouldAddKeyListener(prevProps) &&
                this.shouldAddKeyListener(this.props)
            ) {
                document.addEventListener("keydown", this.handleDocumentKeyDown);
            } else if (
                this.shouldAddKeyListener(prevProps) &&
                !this.shouldAddKeyListener(this.props)
            ) {
                document.removeEventListener("keydown", this.handleDocumentKeyDown);
            }
        }
    }

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {
        if (canUseDOM()) {
            if (this.shouldAddKeyListener(this.props)) {
                document.removeEventListener("keydown", this.handleDocumentKeyDown);
            }

            if (this.props.modal) {
                document.removeEventListener("focusin", this.handleDocumentFocus);
            }

            this.invokeFocusOnCloseTarget();
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.dialog));
    }

    /**
     * Renders the modal overlay
     */
    private renderModalOverlay(): React.ReactElement<HTMLDivElement> {
        if (!this.props.modal) {
            return;
        }

        return (
            <div
                className={classNames(this.props.managedClasses.dialog_modalOverlay)}
                onClick={this.checkForSoftDismiss}
                onTouchStart={this.checkForSoftDismiss}
                role={"presentation"}
                tabIndex={-1}
                style={{
                    touchAction: "none",
                }}
            />
        );
    }

    /**
     * Check if props demand a key listener
     */
    private shouldAddKeyListener = (props: DialogProps): boolean => {
        if (props.modal || props.onDismiss) {
            return true;
        }
        return false;
    };

    /**
     * handles document key down events
     */
    private handleDocumentKeyDown = (event: KeyboardEvent): void => {
        if (!event.defaultPrevented && this.props.visible) {
            switch (event.keyCode) {
                case keyCodeEscape:
                    this.checkForSoftDismiss(event);
                    break;

                case keyCodeTab:
                    this.handleTabKeyDown(event);
                    break;
            }
        }
    };

    /**
     * Invokes dialog soft dismiss if appropriate
     */
    private checkForSoftDismiss = (
        event: KeyboardEvent | React.MouseEvent | React.TouchEvent
    ): void => {
        if (
            this.props.onDismiss &&
            typeof this.props.onDismiss === "function" &&
            this.props.visible
        ) {
            this.props.onDismiss(event);
        }
    };

    /**
     * process tab key down events
     */
    private handleTabKeyDown = (event: KeyboardEvent): void => {
        if (!this.props.modal) {
            // only handle tab keystrokes when modal
            return;
        }

        const tabbableElements: HTMLElement[] = Tabbable(this.rootElement.current);
        const tabbableElementCount: number = tabbableElements.length;
        if (tabbableElementCount === 0) {
            this.tryFocusOnRootElement();
            event.preventDefault();
            return;
        }
        // intervene in normal tab order for first and last items in list
        if (event.shiftKey && event.target === tabbableElements[0]) {
            tabbableElements[tabbableElementCount - 1].focus();
            event.preventDefault();
        } else if (
            !event.shiftKey &&
            event.target === tabbableElements[tabbableElementCount - 1]
        ) {
            tabbableElements[0].focus();
            event.preventDefault();
        }
    };

    /**
     * forces focus to first tabbable element of modal dialog if document gains focus while dialog is open
     */
    private handleDocumentFocus = (event: FocusEvent): void => {
        if (
            !event.defaultPrevented &&
            this.shouldForceFocus(event.target as HTMLElement)
        ) {
            this.focusOnFirstElement();
            event.preventDefault();
        }
    };

    /**
     * test to avoid forcing focus when focus is already within
     */
    private shouldForceFocus = (currentFocusElement: Element): boolean => {
        return (
            this.props.visible &&
            this.rootElement.current instanceof HTMLElement &&
            !(this.rootElement.current as HTMLElement).contains(currentFocusElement)
        );
    };

    /**
     * focus on first element of tab queue
     */
    private focusOnFirstElement = (): void => {
        if (canUseDOM() && this.rootElement.current instanceof HTMLElement) {
            const tabbableElements: HTMLElement[] = Tabbable(this.rootElement.current);
            if (tabbableElements.length === 0) {
                this.tryFocusOnRootElement();
            } else {
                tabbableElements[0].focus();
            }
        }
    };

    /**
     * if no tabbable elements try to focus root element
     * generally a modal dialog should be expected to have a focusable element
     */
    private tryFocusOnRootElement = (): void => {
        if (this.rootElement.current instanceof HTMLElement) {
            this.rootElement.current.focus();
        }
    };

    /**
     * Act on focusTargetOnClose prop when component unmounts
     */
    private invokeFocusOnCloseTarget = (): void => {
        if (isNil(this.props.focusTargetOnClose)) {
            return;
        }

        if (isFunction(this.props.focusTargetOnClose)) {
            this.props.focusTargetOnClose();
            return;
        }

        const targetElement: HTMLElement = extractHtmlElement(
            this.props.focusTargetOnClose
        );

        if (targetElement !== null) {
            targetElement.focus();
        }
    };
}

export default Dialog;
export * from "./dialog.props";
export { DialogClassNameContract };
