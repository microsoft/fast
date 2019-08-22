import { ButtonBaseClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button as BaseButton } from "@microsoft/fast-components-react-base";
import { classNames } from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    ButtonBaseHandledProps,
    ButtonBaseProps,
    ButtonBaseUnhandledProps,
} from "./button-base.props";

class ButtonBase extends Foundation<
    ButtonBaseHandledProps,
    ButtonBaseUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}ButtonBase`;

    public static defaultProps: Partial<ButtonBaseProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<ButtonBaseHandledProps> = {
        beforeContent: void 0,
        afterContent: void 0,
        disabled: void 0,
        href: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        const managedClasses: ButtonBaseClassNameContract = this.props.managedClasses;

        return (
            <BaseButton
                {...this.unhandledProps()}
                managedClasses={managedClasses}
                className={this.generateClassNames()}
                href={this.props.href}
                disabled={this.props.disabled}
            >
                {this.generateBeforeContent()}
                <span className={classNames(managedClasses.button_contentRegion)}>
                    {this.props.children}
                </span>
                {this.generateAfterContent()}
            </BaseButton>
        );
    }

    protected generateClassNames(): string {
        return super.generateClassNames(
            classNames([
                this.props.managedClasses.button__hasBeforeOrAfterAndChildren,
                this.hasBeforeOrAfterAndChildren(),
            ])
        );
    }

    private generateBeforeContent(): React.ReactNode {
        if (typeof this.props.beforeContent === "function") {
            return this.props.beforeContent(
                classNames(this.props.managedClasses.button_beforeContent)
            );
        }
    }

    private generateAfterContent(): React.ReactNode {
        if (typeof this.props.afterContent === "function") {
            return this.props.afterContent(
                classNames(this.props.managedClasses.button_afterContent)
            );
        }
    }

    private hasBeforeOrAfterAndChildren(): boolean {
        return (
            !isNil(this.props.children) &&
            (!isNil(this.props.beforeContent) || !isNil(this.props.afterContent))
        );
    }
}

export default ButtonBase;
export * from "./button-base.props";
