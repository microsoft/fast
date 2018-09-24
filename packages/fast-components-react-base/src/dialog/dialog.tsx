import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { DialogProps, IDialogHandledProps, IDialogManagedClasses, IDialogUnhandledProps } from "./dialog.props";
import { IDialogClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { canUseDOM } from "exenv-es6";
import { KeyCodes } from "@microsoft/fast-web-utilities";

class Dialog extends Foundation<
    IDialogHandledProps & IManagedClasses<IDialogClassNameContract>,
    React.AllHTMLAttributes<HTMLElement>,
    {}
> {
    public static defaultProps: Partial<IDialogHandledProps> = {
        contentHeight: "480px",
        contentWidth: "640px",
        visible: false
    };

    public static displayName: string = "Dialog";

    protected handledProps: HandledProps<IDialogHandledProps & IManagedClasses<IDialogClassNameContract>> = {
        describedBy: void 0,
        label: void 0,
        labelledBy: void 0,
        contentWidth: void 0,
        contentHeight: void 0,
        modal: void 0,
        managedClasses: void 0,
        onDismiss: void 0,
        visible: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                aria-hidden={!this.props.visible}
            >
                {this.renderModalOverlay()}
                <div
                    role="dialog"
                    tabIndex={-1}
                    className={get(this.props, "managedClasses.dialog_contentRegion")}
                    style={{height: this.props.contentHeight, width: this.props.contentWidth}}
                    aria-describedby={this.props.describedBy}
                    aria-labelledby={this.props.labelledBy}
                    aria-label={this.props.label}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        if (canUseDOM() && this.props.onDismiss) {
            window.addEventListener("keydown", this.handleWindowKeyDown);
        }
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(prevProps: Partial<IDialogHandledProps>): void {
        if (canUseDOM()) {
            if (!prevProps.onDismiss && this.props.onDismiss) {
                window.addEventListener("keydown", this.handleWindowKeyDown);
            } else if (prevProps.onDismiss && !this.props.onDismiss) {
                window.removeEventListener("keydown", this.handleWindowKeyDown);
            }
        }
    }

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {
        if (canUseDOM() && this.props.onDismiss) {
            window.removeEventListener("keydown", this.handleWindowKeyDown);
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.dialog"));
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
                className={get(this.props, "managedClasses.dialog_modalOverlay")}
                onClick={this.handleOverlayClick}
                role={"presentation"}
                tabIndex={-1}
            />
        );
    }

    private handleOverlayClick = (event: React.MouseEvent): void => {
        if (this.props.onDismiss && typeof this.props.onDismiss === "function" && this.props.visible) {
            this.props.onDismiss(event);
        }
    }

    private handleWindowKeyDown = (event: KeyboardEvent): void => {
        if (this.props.onDismiss && typeof this.props.onDismiss === "function" && this.props.visible && event.keyCode === KeyCodes.escape) {
            this.props.onDismiss(event);
        }
    }
}

export default Dialog;
export * from "./dialog.props";
export { IDialogClassNameContract };
