import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Button, Foundation, HandledProps, IButtonHandledProps, IButtonUnhandledProps } from "@microsoft/fast-components-react-base";
import {
    FlipperDirection,
    IFlipperHandledProps,
    IFlipperManagedClasses,
    IFlipperUnhandledProps
} from "./flipper.props";
import { IFlipperClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";

/* tslint:disable-next-line */
class Flipper extends Foundation<IFlipperHandledProps & IManagedClasses<IFlipperClassNameContract>, React.HTMLAttributes<HTMLButtonElement>, {}> {
    protected handledProps: HandledProps<IFlipperHandledProps & IManagedClasses<IFlipperClassNameContract>> = {
        label: void 0,
        visible: void 0,
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Button
                {...this.unhandledProps()}
                {...this.coerceButtonProps()}
                managedClasses={this.props.managedClasses}
                className={this.generateClassNames()}
            >
                <span className={this.props.managedClasses.flipperGlyph}>{this.props.children}</span>
            </Button>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const classes: string = this.props.managedClasses[`flipper_${this.props.direction || FlipperDirection.next}`];

        return super.generateClassNames(classes);
    }

    /**
     * Generates class names based on props
     */
    protected coerceButtonProps(): IButtonHandledProps & Partial<IButtonUnhandledProps> {
        const coercedProps: Partial<IButtonHandledProps> & IButtonUnhandledProps = {
            href: void 0,
        };

        if (!this.props.visible) {
            coercedProps["aria-hidden"] = "true";
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
export { IFlipperClassNameContract };
