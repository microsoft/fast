import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IDialogHandledProps, IDialogManagedClasses, IDialogUnhandledProps } from "./dialog.props";
import { IDialogClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/* tslint:disable-next-line */
class Dialog extends Foundation<IDialogHandledProps & IManagedClasses<IDialogClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<IDialogHandledProps & IManagedClasses<IDialogClassNameContract>> = {
        children: void 0,
        contentWidth: void 0,
        contentHeight: void 0,
        focusElementRef: void 0,
        modal: void 0,
        managedClasses: void 0,
        triggerElementRef: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                {this.props.modal ? <div {...this.generateBackgroundOverlayAttributes()} /> : null}
                <div
                    role="dialog"
                    tabIndex={-1}
                    className={get(this.props, "managedClasses.dialog_contentRegion")}
                    style={this.generateContentRegionStyles()}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.dialog"));
    }

    /**
     * Generates background overlay attributes
     */
    private generateBackgroundOverlayAttributes(): React.HTMLAttributes<HTMLDivElement> {
        return {
            className: get(this.props, "managedClasses.dialog_backgroundOverlay"),
            role: "presentation",
            tabIndex: -1,
            style: {
                position: "fixed",
                bottom: "0",
                left: "0",
                right: "0",
                top: "0",
                background: "rgba(0, 0, 0, 0.2)",
                zIndex: 1000
            }
        };
    }

    /**
     * Generates background overlay attributes
     */
    private generateContentRegionStyles(): React.CSSProperties {
        return {
            position: "fixed",
            width: this.props.contentWidth,
            height: this.props.contentHeight,
            background: "white",
            zIndex: 1000
        };
    }
}

export default Dialog;
export * from "./dialog.props";
export { IDialogClassNameContract };
