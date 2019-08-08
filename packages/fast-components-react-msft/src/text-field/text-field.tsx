import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    TextFieldAppearance,
    TextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldProps,
    TextFieldUnhandledProps,
} from "./text-field.props";
import { TextField as BaseTextField } from "@microsoft/fast-components-react-base";
import { DisplayNamePrefix } from "../utilities";
import { classNames } from "@microsoft/fast-web-utilities";

class TextField extends Foundation<TextFieldHandledProps, TextFieldUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}TextField`;
    public static defaultProps: Partial<TextFieldProps> = {
        managedClasses: {},
    };

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
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(
            classNames([
                this.props.managedClasses[
                    `textField__${TextFieldAppearance[this.props.appearance]}`
                ],
                !!this.props.appearance,
            ])
        );
    }
}

export default TextField;
export * from "./text-field.props";
