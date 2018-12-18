import React from "react";
import ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button, ButtonProps } from "@microsoft/fast-components-react-base";
import {
    FlipperDirection,
    FlipperHandledProps,
    FlipperManagedClasses,
    FlipperUnhandledProps,
} from "./flipper.props";
import {
    FlipperClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

class Flipper extends Foundation<FlipperHandledProps, FlipperUnhandledProps, {}> {
    public static displayName: string = "Flipper";

    protected handledProps: HandledProps<FlipperHandledProps> = {
        label: void 0,
        visibleToAssistiveTechnologies: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Button
                {...this.unhandledProps()}
                {...this.coerceButtonProps()}
                className={this.generateClassNames()}
            >
                <span className={get(this.props, "managedClasses.flipper_glyph")}>
                    {this.props.children}
                </span>
            </Button>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const classes: string = get(
            this.props,
            `managedClasses.flipper__${this.props.direction || FlipperDirection.next}`,
            ""
        );

        return super.generateClassNames(
            `${get(this.props, "managedClasses.flipper", "")} ${classes}`
        );
    }

    /**
     * Generates class names based on props
     */
    protected coerceButtonProps(): Partial<ButtonProps> {
        const coercedProps: Partial<ButtonProps> = {
            href: void 0,
        };

        if (!this.props.visibleToAssistiveTechnologies) {
            coercedProps["aria-hidden"] = true;
            coercedProps.tabIndex = -1;
        }

        if (this.props.label) {
            coercedProps["aria-label"] = this.props.label;
        }

        return coercedProps;
    }
}

export default Flipper;
export * from "./flipper.props";
export { FlipperClassNameContract };
