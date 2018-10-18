import * as React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    SubheadingHandledProps,
    SubheadingManagedClasses,
    SubheadingProps,
    SubheadingSize,
    SubheadingTag,
    SubheadingUnhandledProps
} from "./subheading.props";

import { Typography } from "../typography";
import {
    ManagedClasses,
    SubheadingClassNameContract
} from "@microsoft/fast-components-class-name-contracts-msft";

class Subheading extends Foundation<
    SubheadingHandledProps,
    SubheadingUnhandledProps,
    {}
> {
    public static defaultProps: Partial<SubheadingProps> = {
        size: SubheadingSize._1,
        tag: SubheadingTag.h3
    };

    public static displayName: string = "Subheading";

    protected handledProps: HandledProps<SubheadingHandledProps> = {
        size: void 0,
        managedClasses: void 0,
        tag: void 0
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
        return super.generateClassNames(
            `${get(this.props, "managedClasses.subheading")} ${get(
                this.props,
                `managedClasses.subheading__${this.props.size}`
            )}`
        );
    }
}

export default Subheading;
export * from "./subheading.props";
export { SubheadingClassNameContract };
