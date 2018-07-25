import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps } from "@microsoft/fast-components-react-base";
import { ButtonAppearance, IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button.props";
import { IManagedClasses, IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Button as BaseButton } from "@microsoft/fast-components-react-base";

/* tslint:disable-next-line */
class Button extends Foundation<IButtonHandledProps & IManagedClasses<IMSFTButtonClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<IButtonHandledProps & IManagedClasses<IMSFTButtonClassNameContract>> = {
        appearance: void 0,
        children: void 0,
        disabled: void 0,
        href: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <BaseButton
                {...this.unhandledProps()}
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
        if (!this.props.appearance) {
            return;
        }

        switch (this.props.appearance) {
            case ButtonAppearance.primary:
                return super.generateClassNames(get(this.props, "managedClasses.button_primary"));
            case ButtonAppearance.outline:
                return super.generateClassNames(get(this.props, "managedClasses.button_outline"));
            case ButtonAppearance.lightweight:
                return super.generateClassNames(get(this.props, "managedClasses.button_lightweight"));
            case ButtonAppearance.justified:
                return super.generateClassNames(get(this.props, "managedClasses.button_justified"));
        }
    }

    private generateInnerContent(): React.ReactElement<HTMLSpanElement> | (React.ReactNode | React.ReactNode[]) {
        if (this.props.appearance === ButtonAppearance.lightweight || this.props.appearance === ButtonAppearance.justified) {
            return <span className={get(this.props, "managedClasses.button_span")}>{this.props.children}</span>;
        }

        return this.props.children;
    }
}

export default Button;
export * from "./button.props";
export { IMSFTButtonClassNameContract };
