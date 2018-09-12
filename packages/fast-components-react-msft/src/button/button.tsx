import * as React from "react";
import { get } from "lodash-es";
import { Foundation, HandledProps } from "@microsoft/fast-components-react-base";
import { ButtonAppearance, IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button.props";
import { IManagedClasses, IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Button as BaseButton } from "@microsoft/fast-components-react-base";

/**
 * Button slot options
 */
export enum ButtonSlot {
    before = "before",
    after = "after"
}

/* tslint:disable-next-line */
class Button extends Foundation<IButtonHandledProps & IManagedClasses<IMSFTButtonClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, {}> {
    protected handledProps: HandledProps<IButtonHandledProps & IManagedClasses<IMSFTButtonClassNameContract>> = {
        appearance: void 0,
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
                {this.renderChildrenBySlot(ButtonSlot.before)}
                {this.renderContent()}
                {this.renderChildrenBySlot(ButtonSlot.after)}
            </BaseButton>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        switch (this.props.appearance) {
            case ButtonAppearance.primary:
                return super.generateClassNames(get(this.props, "managedClasses.button_primary"));
            case ButtonAppearance.outline:
                return super.generateClassNames(get(this.props, "managedClasses.button_outline"));
            case ButtonAppearance.lightweight:
                return super.generateClassNames(get(this.props, "managedClasses.button_lightweight"));
            case ButtonAppearance.justified:
                return super.generateClassNames(get(this.props, "managedClasses.button_justified"));
            default:
                return super.generateClassNames();
        }
    }

    /**
     * Renders slotted children in the appropriate slot
     */
    private renderChildrenBySlot(slot: ButtonSlot): JSX.Element {
        if (Array.isArray(this.props.children)) {
            return this.props.children.map((child: any, index: number) => {
                if (child.props && child.props.slot === slot) {
                    return (
                        <React.Fragment key={index}>
                            {child}
                        </React.Fragment>
                    );
                }
            });
        }
    }

    /**
     * Renders the non-slot child content
     */
    private renderContent(): JSX.Element {
        let content: any = {};

        if (Array.isArray(this.props.children)) {
            this.props.children.forEach((child: any) => {
                if (!child.props) {
                    content = child;
                }
            });
        } else {
            content = this.props.children;
        }

        return <span className={get(this.props, "managedClasses.button_textContainer")}>{content}</span>;
    }
}

export default Button;
export * from "./button.props";
export { IMSFTButtonClassNameContract };
