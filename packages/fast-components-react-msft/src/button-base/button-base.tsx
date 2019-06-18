import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseUnhandledProps,
} from "./button-base.props";
import { Button as BaseButton } from "@microsoft/fast-components-react-base";
import { DisplayNamePrefix } from "../utilities";

class ButtonBase extends Foundation<
    ButtonBaseHandledProps,
    ButtonBaseUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}ButtonBase`;

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
        return (
            <BaseButton
                {...this.unhandledProps()}
                managedClasses={this.props.managedClasses}
                href={this.props.href}
                disabled={this.props.disabled}
            >
                {this.generateBeforeContent()}
                <span className={get(this.props, "managedClasses.button_contentRegion")}>
                    {this.props.children}
                </span>
                {this.generateAfterContent()}
            </BaseButton>
        );
    }

    private generateBeforeContent(): React.ReactNode {
        if (typeof this.props.beforeContent === "function") {
            return this.props.beforeContent(
                get(this.props, "managedClasses.button_beforeContent", "")
            );
        }
    }

    private generateAfterContent(): React.ReactNode {
        if (typeof this.props.afterContent === "function") {
            return this.props.afterContent(
                get(this.props, "managedClasses.button_afterContent", "")
            );
        }
    }
}

export default ButtonBase;
export * from "./button-base.props";
