import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { TextFieldType } from "../text-field/index";
import { DisplayNamePrefix } from "../utilities";
import {
    NumberFieldHandledProps,
    NumberFieldProps,
    NumberFieldUnhandledProps,
} from "./number-field.props";

class NumberField extends Foundation<
    NumberFieldHandledProps,
    NumberFieldUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}NumberField`;

    public static defaultProps: Partial<NumberFieldProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<NumberFieldHandledProps> = {
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <input
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                type={TextFieldType.number}
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(
            classNames(this.props.managedClasses.numberField)
        );
    }
}

export default NumberField;
export * from "./number-field.props";
export { NumberFieldClassNameContract };
