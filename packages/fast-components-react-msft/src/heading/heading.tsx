import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps, TypeLevel, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    AlignHeadingBaseline,
    HeadingLevel,
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
        level: void 0,
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
     * Stores level for use in render
     */
    private get level(): TypeLevel {
        return TypeLevel[`_${this.props.level}`];
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={this.tag}
                typeLevel={this.level}
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
        const classes: string = this.props.level ?
            get(this.props, `managedClasses.heading__${this.props.level}`) : get(this.props, "managedClasses.heading__1");

        return super.generateClassNames(`${get(this.props, "managedClasses.heading")} ${classes}`);
    }
}

export default Heading;
export * from "./heading.props";
export { IHeadingClassNameContract };
