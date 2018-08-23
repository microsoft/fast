import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps, TypeLevel, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphLevel
} from "./paragraph.props";
import Typography from "../typography";
import { IManagedClasses, IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

/* tslint:disable-next-line */
class Paragraph extends Foundation<IParagraphHandledProps & IManagedClasses<IParagraphClassNameContract>, React.HTMLAttributes<HTMLParagraphElement>, {}> {
    protected handledProps: HandledProps<IParagraphHandledProps & IManagedClasses<IParagraphClassNameContract>> = {
        level: void 0,
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag.p}
                typeLevel={this.getTypeLevel()}
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
        const classes: string = get(this.props, `managedClasses.paragraph_${this.props.level || ParagraphLevel._3}`);

        return super.generateClassNames(classes);
    }

    /**
     * Stores level for use in render
     */
    private getTypeLevel(): TypeLevel {
        switch (this.props.level) {
            case ParagraphLevel._1:
                return TypeLevel._5;
            case ParagraphLevel._2:
                return TypeLevel._6;
            default:
                return TypeLevel._7;
        }
    }
}

export default Paragraph;
export * from "./paragraph.props";
export { IParagraphClassNameContract };
