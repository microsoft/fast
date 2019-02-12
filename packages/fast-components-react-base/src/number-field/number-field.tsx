import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    NumberFieldHandledProps,
    NumberFieldManagedClasses,
    NumberFieldProps,
    NumberFieldUnhandledProps,
} from "./number-field.props";
import {
    ManagedClasses,
    NumberFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { TextFieldType } from "../text-field/index";

class NumberField extends Foundation<
    NumberFieldHandledProps,
    NumberFieldUnhandledProps,
    {}
> {
    public static defaultProps: Partial<NumberFieldProps> = {};

    public static displayName: string = "NumberField";

    protected handledProps: HandledProps<NumberFieldHandledProps> = {
        managedClasses: void 0,
        disabled: void 0,
        min: void 0,
        max: void 0,
        name: void 0,
        placeholder: void 0,
        step: void 0,
        readOnly: void 0,
        required: void 0,
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
                {...this.assignAttributes()}
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.numberField"));
    }

    /**
     * Generates attributes based on props
     */
    private assignAttributes(): Partial<NumberFieldHandledProps> {
        const attributes: Partial<NumberFieldHandledProps> = {};

        if (typeof this.props.disabled === "boolean") {
            attributes.disabled = true;
        }

        if (typeof this.props.max === "number") {
            attributes.max = this.props.max;
        }

        if (typeof this.props.min === "number") {
            attributes.min = this.props.min;
        }

        if (typeof this.props.placeholder === "string") {
            attributes.placeholder = this.props.placeholder;
        }

        if (typeof this.props.name === "string") {
            attributes.name = this.props.name;
        }

        if (typeof this.props.readOnly === "boolean") {
            attributes.readOnly = true;
        }

        if (typeof this.props.required === "boolean") {
            attributes.required = true;
        }

        if (typeof this.props.step === "number") {
            attributes.step = this.props.step;
        }

        return attributes;
    }
}

export default NumberField;
export * from "./number-field.props";
export { NumberFieldClassNameContract };
