import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps, TypeLevel, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    IMetatextHandledProps,
    IMetatextManagedClasses,
    IMetatextUnhandledProps,
    MetatextTag
} from "./metatext.props";
import Typography from "../typography";
import { IManagedClasses, IMetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

/* tslint:disable-next-line */
class Metatext extends Foundation<IMetatextHandledProps & IManagedClasses<IMetatextClassNameContract>, React.HTMLAttributes<HTMLSpanElement | HTMLParagraphElement>, {}> {
    public static defaultProps: Partial<IMetatextHandledProps> = {
        tag: MetatextTag.span
    };

    protected handledProps: HandledProps<IMetatextHandledProps & IManagedClasses<IMetatextClassNameContract>> = {
        managedClasses: void 0,
        tag: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag[this.props.tag]}
                typeLevel={TypeLevel._7}
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
        return super.generateClassNames(get(this.props, "managedClasses.metatext"));
    }
}

export default Metatext;
export * from "./metatext.props";
export { IMetatextClassNameContract };
