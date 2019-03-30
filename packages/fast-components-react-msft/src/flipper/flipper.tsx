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
import { DisplayNamePrefix } from "../utilities";
import { FlipperProps } from "./flipper.props";

class Flipper extends Foundation<FlipperHandledProps, FlipperUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Flipper`;

    public static defaultProps: Partial<FlipperProps> = {
        direction: FlipperDirection.next,
    };

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
                {this.renderGlyph()}
                {this.props.children}
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

    private renderGlyph(): React.ReactNode {
        let path: React.ReactNode;
        if (this.props.direction === FlipperDirection.next) {
            path = (
                <path d="M4.023 15.273L11.29 8 4.023.727l.704-.704L12.71 8l-7.984 7.977-.704-.704z" />
            );
        } else if (this.props.direction === FlipperDirection.previous) {
            path = (
                <path d="M11.273 15.977L3.29 8 11.273.023l.704.704L4.71 8l7.266 7.273-.704.704z" />
            );
        }
        if (path) {
            return (
                <svg
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    className={get(this.props, "managedClasses.flipper_glyph")}
                >
                    {path}
                </svg>
            );
        }
    }
}

export default Flipper;
export * from "./flipper.props";
export { FlipperClassNameContract };
