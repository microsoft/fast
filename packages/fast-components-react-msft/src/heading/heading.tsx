import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    AlignHeadingBaseline,
    IHeadingHandledProps,
    IHeadingManagedClasses,
    IHeadingUnhandledProps
} from "./heading.props";
import { Typography } from "../typography";
import { IHeadingClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";

class Heading extends Foundation<
    IHeadingHandledProps & IManagedClasses<IHeadingClassNameContract>,
    React.HTMLAttributes<HTMLElement>,
    {}
> {
    public static displayName: string = "Heading";

    protected handledProps: HandledProps<IHeadingHandledProps & IManagedClasses<IHeadingClassNameContract>> = {
        size: void 0,
        managedClasses: void 0,
        tag: void 0
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): TypographyTag {
        return this.props.tag ? TypographyTag[this.props.tag] : TypographyTag.h1;
    }

    /**
     * Stores size for use in render
     */
    private get size(): TypographySize {
        return TypographySize[`_${this.props.size}`];
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={this.tag}
                size={this.size}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const classes: string = this.props.size ?
            get(this.props, `managedClasses.heading__${this.props.size}`) : get(this.props, "managedClasses.heading__1");

        return super.generateClassNames(`${get(this.props, "managedClasses.heading")} ${classes}`);
    }
}

export default Heading;
export * from "./heading.props";
export { IHeadingClassNameContract };
