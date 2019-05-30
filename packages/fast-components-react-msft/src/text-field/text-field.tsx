import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    TextFieldAppearance,
    TextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldUnhandledProps,
} from "./text-field.props";
import { TextField as BaseTextField } from "@microsoft/fast-components-react-base";
import { DisplayNamePrefix } from "../utilities";

class TextField extends Foundation<TextFieldHandledProps, TextFieldUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}TextField`;

    protected handledProps: HandledProps<TextFieldHandledProps> = {
        appearance: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLInputElement> {
        return (
            <BaseTextField
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                managedClasses={this.props.managedClasses}
                disabled={this.props.disabled}
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const className: string = this.props.appearance
            ? get(
                  this.props,
                  `managedClasses.textField__${
                      TextFieldAppearance[this.props.appearance]
                  }`
              )
            : "";

        return super.generateClassNames(className);
    }
}

export default TextField;
export * from "./text-field.props";
