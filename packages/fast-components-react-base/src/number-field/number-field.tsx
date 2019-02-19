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
    public static displayName: string = "NumberField";

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
        return super.generateClassNames(get(this.props, "managedClasses.numberField"));
    }
}

export default NumberField;
export * from "./number-field.props";
export { NumberFieldClassNameContract };
