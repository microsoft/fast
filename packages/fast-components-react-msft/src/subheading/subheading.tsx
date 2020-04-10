import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { Typography } from "../typography";
import { DisplayNamePrefix } from "../utilities";
import {
    SubheadingHandledProps,
    SubheadingProps,
    SubheadingSize,
    SubheadingTag,
    SubheadingUnhandledProps,
} from "./subheading.props";

class Subheading extends Foundation<
    SubheadingHandledProps,
    SubheadingUnhandledProps,
    {}
> {
    public static defaultProps: Partial<SubheadingProps> = {
        size: SubheadingSize._1,
        tag: SubheadingTag.h3,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}Subheading`;

    protected handledProps: HandledProps<SubheadingHandledProps> = {
        size: void 0,
        managedClasses: void 0,
        tag: void 0,
    };

    private get size(): TypographySize {
        switch (this.props.size) {
            case SubheadingSize._1:
                return TypographySize._3;
            case SubheadingSize._2:
                return TypographySize._4;
            case SubheadingSize._3:
                return TypographySize._5;
            case SubheadingSize._4:
                return TypographySize._6;
            case SubheadingSize._5:
                return TypographySize._7;
            case SubheadingSize._6:
                return TypographySize._8;
            case SubheadingSize._7:
                return TypographySize._9;
        }
    }

    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag[this.props.tag]}
                size={this.size}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    protected generateClassNames(): string {
        const managedClasses: SubheadingClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                managedClasses.subheading,
                managedClasses[`subheading__${this.props.size}`]
            )
        );
    }
}

export default Subheading;
export * from "./subheading.props";
export { SubheadingClassNameContract };
