import * as React from "react";
import { get } from "lodash-es";
import { Foundation, HandledProps, TypeLevel, TypographyTag  } from "@microsoft/fast-components-react-base";
import {
    ISubheadingHandledProps,
    ISubheadingManagedClasses,
    ISubheadingUnhandledProps,
    SubheadingLevel,
    SubheadingTag
} from "./subheading.props";

import Typography from "../typography";
import { IManagedClasses, ISubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

/* tslint:disable-next-line */
class Subheading extends Foundation<ISubheadingHandledProps & IManagedClasses<ISubheadingClassNameContract>, React.HTMLAttributes<HTMLElement>, {}> {
    public static defaultProps: Partial<ISubheadingHandledProps> = {
        level: SubheadingLevel._1,
        tag: SubheadingTag.h3
    };

    protected handledProps: HandledProps<ISubheadingHandledProps & IManagedClasses<ISubheadingClassNameContract>> = {
        level: void 0,
        managedClasses: void 0,
        tag: void 0
    };

    private get level(): TypeLevel {
        switch (this.props.level) {
            case SubheadingLevel._1:
                return TypeLevel._3;
            case SubheadingLevel._2:
                return TypeLevel._4;
            case SubheadingLevel._3:
                return TypeLevel._5;
            case SubheadingLevel._4:
                return TypeLevel._6;
            case SubheadingLevel._5:
                return TypeLevel._7;
            case SubheadingLevel._6:
                return TypeLevel._8;
        }
    }

    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag[this.props.tag]}
                typeLevel={this.level}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    protected generateClassNames(): string {
        const classes: string = get(this.props, `managedClasses_subheading_${this.props.level}`);

        return super.generateClassNames(classes);
    }
}

export default Subheading;
export * from "./subheading.props";
export { ISubheadingClassNameContract };
