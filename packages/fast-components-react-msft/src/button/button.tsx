import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps } from "@microsoft/fast-components-react-base";
import { IMSFTButtonHandledProps, IMSFTButtonManagedClasses, IMSFTButtonUnhandledProps } from "./button.props";
import { IManagedClasses, IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    default as BaseButton,
    IButtonClassNameContract,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps,
} from "@microsoft/fast-components-react-base/src/button";

/* tslint:disable-next-line */
class Button extends Foundation<IMSFTButtonHandledProps & IManagedClasses<IMSFTButtonClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<IMSFTButtonHandledProps & IManagedClasses<IMSFTButtonClassNameContract>> = {
        children: void 0,
        justified: void 0,
        lightweight: void 0,
        managedClasses: void 0,
        outline: void 0,
        primary: void 0,
        href: void 0,
        disabled: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <BaseButton
                className={this.generateClassNames()}
                managedClasses={this.props.managedClasses}
                href={this.props.href}
                disabled={this.props.disabled}
            >
                {this.generateInnerContent()}
            </BaseButton>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classLocation: string;

        if (this.props.primary) {
            classLocation = "managedClasses.button_primary";
        } else if (this.props.outline) {
            classLocation = "managedClasses.button_outline";
        } else if (this.props.lightweight) {
            classLocation = "managedClasses.button_lightweight";
        } else if (this.props.justified) {
            classLocation = "managedClasses.button_justified";
        } else {
            classLocation = "managedClasses.button";
        }

        return super.generateClassNames(get(this.props, classLocation));
    }

    private generateInnerContent(): React.ReactElement<HTMLSpanElement> | (React.ReactNode | React.ReactNode[]) {
        if (this.props.lightweight || this.props.justified) {
            return <span className={get(this.props, "managedClasses.button_span")}>{this.props.children}</span>;
        } else {
            return this.props.children;
        }
    }
}

export default Button;
export * from "./button.props";
export { IMSFTButtonClassNameContract };
