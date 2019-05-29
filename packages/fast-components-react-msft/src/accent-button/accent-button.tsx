import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ButtonBase } from "../button-base";
import {
    AccentButtonHandledProps,
    AccentButtonUnhandledProps,
} from "./accent-button.props";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";

class AccentButton extends Foundation<
    AccentButtonHandledProps,
    AccentButtonUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}AccentButton`;

    protected handledProps: HandledProps<AccentButtonHandledProps> = {
        beforeContent: void 0,
        afterContent: void 0,
        disabled: void 0,
        href: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <ButtonBase
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                disabled={this.props.disabled}
                href={this.props.href}
                beforeContent={this.props.beforeContent}
                afterContent={this.props.afterContent}
            >
                {this.props.children}
            </ButtonBase>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(
            get(this.props, "managedClasses.button__accent", "")
        );
    }
}

export default AccentButton;
export * from "./accent-button.props";
