import React from "react";
import ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    MetatextHandledProps,
    MetatextManagedClasses,
    MetatextProps,
    MetatextTag,
    MetatextUnhandledProps,
} from "./metatext.props";
import { Typography } from "../typography";
import {
    ManagedClasses,
    MetatextClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { DisplayNamePrefix } from "../utilities";

class Metatext extends Foundation<MetatextHandledProps, MetatextUnhandledProps, {}> {
    public static defaultProps: Partial<MetatextProps> = {
        tag: MetatextTag.span,
    };

    public static displayName: string = `${DisplayNamePrefix}Metatext`;

    protected handledProps: HandledProps<MetatextHandledProps> = {
        managedClasses: void 0,
        tag: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag[this.props.tag]}
                size={TypographySize._7}
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
export { MetatextClassNameContract };
