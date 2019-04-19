import React from "react";
import { get } from "lodash-es";
import FormItemSectionLink from "./form-item.section-link";
import FormItemNumberField from "./form-item.number-field";
import FormItemArray from "./form-item.array";
import FormItemTextarea from "./form-item.textarea";
import FormItemSelect from "./form-item.select";
import FormItemChildren from "./form-item.children";
import FormItemCheckbox from "./form-item.checkbox";
import { FormControlProps, FormControlState } from "./form-control.props";
import FormItemCommon from "./form-item.props";
import { FormChildOptionItem } from "./form.props";
import { isSelect } from "../utilities";

class FormControl extends React.Component<FormControlProps, {}> {
    public static displayName: string = "FormControl";

    public render(): React.ReactNode {
        return <React.Fragment>{this.renderFormItem()}</React.Fragment>;
    }

    /**
     * Renders form items
     */
    private renderFormItem(): React.ReactNode {
        if (isSelect({ enum: this.props.schema.enum })) {
            return this.renderSelect();
        }

        if (this.props.schema.oneOf || this.props.schema.anyOf) {
            return this.renderSectionLink();
        }

        switch (this.props.schema.type) {
            case "boolean":
                return this.renderCheckbox();
            case "number":
                return this.renderNumberField();
            case "string":
                return this.renderTextarea();
            case "array":
                return this.renderArray();
            case "children":
                return this.renderChildren();
            default:
                return this.renderSectionLink();
        }
    }

    private renderChildren(): React.ReactNode {
        return (
            <FormItemChildren
                {...this.getFormItemCommonProps()}
                required={false}
                defaultChildOptions={this.props.schema.defaults || null}
                childOptions={this.getChildOptions()}
                onUpdateActiveSection={this.props.onUpdateActiveSection}
            />
        );
    }

    /**
     * Renders the array form item
     */
    private renderArray(): React.ReactNode {
        return (
            <FormItemArray
                schemaLocation={this.props.schemaLocation}
                untitled={this.props.untitled}
                onUpdateActiveSection={this.props.onUpdateActiveSection}
                {...this.getFormItemCommonProps()}
            />
        );
    }

    /**
     * Renders the number field form item
     */
    private renderNumberField(): React.ReactNode {
        return (
            <FormItemNumberField
                min={this.props.schema.minimum}
                max={this.props.schema.maximum}
                step={this.props.schema.multipleOf}
                {...this.getFormItemCommonProps()}
            />
        );
    }

    /**
     * Renders the checkbox form item
     */
    private renderCheckbox(): React.ReactNode {
        return <FormItemCheckbox {...this.getFormItemCommonProps()} />;
    }

    /**
     * Renders a section link for properties
     * that are objects
     */
    private renderSectionLink(): React.ReactNode {
        return (
            <FormItemSectionLink
                onUpdateSection={this.handleSectionLinkClick}
                schemaLocation={this.props.schemaLocation}
                {...this.getFormItemCommonProps()}
            />
        );
    }

    /**
     * Renders the textarea form item
     */
    private renderTextarea(): React.ReactNode {
        return <FormItemTextarea {...this.getFormItemCommonProps()} />;
    }

    /**
     * Renders the select form item
     */
    private renderSelect(): React.ReactNode {
        const options: any[] = this.props.schema.enum;

        if (!this.props.required && typeof options[0] !== "undefined") {
            options.unshift(void 0);
        }

        return <FormItemSelect options={options} {...this.getFormItemCommonProps()} />;
    }

    /**
     * Handles updating to another active section
     */
    private handleUpdateSection(schemaLocation: string, dataLocation: string): void {
        this.props.onUpdateActiveSection(schemaLocation, dataLocation, this.props.schema);
    }

    /**
     * Handles the onClick of the section link, changes from controlled to uncontrolled if location is passed
     */
    private handleSectionLinkClick = (
        schemaLocation: string,
        dataLocation: string
    ): void => {
        this.handleUpdateSection(schemaLocation, dataLocation);
    };

    /**
     * Gets the child options available to the control
     */
    private getChildOptions(): FormChildOptionItem[] {
        if (Array.isArray(this.props.schema.ids)) {
            return this.props.childOptions.filter(
                (childOption: FormChildOptionItem): boolean => {
                    return this.props.schema.ids.includes(childOption.schema.id);
                }
            );
        }

        return this.props.childOptions;
    }

    /**
     * Gets the common form item props
     */
    private getFormItemCommonProps(): FormItemCommon {
        return {
            index: this.props.index,
            dataLocation: this.props.dataLocation,
            data: this.props.data,
            required: this.props.required,
            label: get(this.props, "schema.title"),
            disabled: get(this.props, "schema.disabled"),
            onChange: this.props.onChange,
            default: get(this.props, "schema.default"),
            badge: get(this.props, "schema.badge"),
            badgeDescription: get(this.props, "schema.badgeDescription"),
            invalidMessage: this.props.invalidMessage,
            displayValidationBrowserDefault: this.props.displayValidationBrowserDefault,
            displayValidationInline: this.props.displayValidationInline,
            schema: this.props.schema,
        };
    }
}

export default FormControl;
export { FormControlProps };
