import {
    LabelClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import { isUndefined } from "lodash-es";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    LabelHandledProps,
    LabelProps,
    LabelTag,
    LabelUnhandledProps,
} from "./label.props";
class Label extends Foundation<LabelHandledProps, LabelUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Label`;

    public static defaultProps: Partial<LabelProps> = {
        tag: LabelTag.label,
        managedClasses: {},
    };

    protected handledProps: HandledProps<
        LabelHandledProps & ManagedClasses<LabelClassNameContract>
    > = {
        hidden: void 0,
        managedClasses: void 0,
        tag: void 0,
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): any {
        return isUndefined(LabelTag[this.props.tag])
            ? LabelTag.label
            : LabelTag[this.props.tag];
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLabelElement | HTMLFieldSetElement> {
        return (
            <this.tag {...this.unhandledProps()} className={this.generateClassNames()}>
                {this.props.children}
            </this.tag>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const {
            label,
            label__hidden,
        }: LabelClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(label, [label__hidden, this.props.hidden])
        );
    }
}

export default Label;
export * from "./label.props";
export { LabelClassNameContract };
