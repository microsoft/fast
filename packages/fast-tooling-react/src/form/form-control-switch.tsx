import React from "react";
import { get } from "lodash-es";
import SectionLinkFormControl from "./controls/control.section-link";
import NumberFieldFormControl from "./controls/control.number-field";
import ArrayFormControl from "./controls/control.array";
import TextareaFormControl from "./controls/control.textarea";
import SelectFormControl from "./controls/control.select";
import ChildrenFormControl from "./controls/control.children";
import CheckboxFormControl from "./controls/control.checkbox";
import DisplayFormControl from "./controls/control.display";
import ButtonFormControl from "./controls/control.button";
import { FormControlSwitchProps } from "./form-control-switch.props";
import { CommonFormControlProps } from "./controls/control.props";
import { FormChildOptionItem } from "./form.props";
import { isConst, isSelect } from "./utilities";

class FormControlSwitch extends React.Component<FormControlSwitchProps, {}> {
    public static displayName: string = "FormControlSwitch";

    public static defaultProps: Partial<FormControlSwitchProps> = {
        softRemove: true,
    };

    public render(): React.ReactNode {
        return <React.Fragment>{this.renderFormControl()}</React.Fragment>;
    }

    /**
     * Renders form items
     */
    private renderFormControl(): React.ReactNode {
        const hasEnum: boolean = isSelect({ enum: this.props.schema.enum });

        if (
            isConst(this.props.schema) ||
            (hasEnum && this.props.schema.enum.length === 1)
        ) {
            return this.renderDisplay();
        }

        if (hasEnum) {
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
            case "null":
                return this.renderButton();
            default:
                return this.renderSectionLink();
        }
    }

    private renderChildren(): React.ReactNode {
        return (
            <ChildrenFormControl
                {...this.getCommonFormControlPropsProps()}
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
            <ArrayFormControl
                schemaLocation={this.props.schemaLocation}
                untitled={this.props.untitled}
                onUpdateActiveSection={this.props.onUpdateActiveSection}
                {...this.getCommonFormControlPropsProps()}
            />
        );
    }

    /**
     * Renders the number field form item
     */
    private renderNumberField(): React.ReactNode {
        return (
            <NumberFieldFormControl
                min={this.props.schema.minimum}
                max={this.props.schema.maximum}
                step={this.props.schema.multipleOf}
                {...this.getCommonFormControlPropsProps()}
            />
        );
    }

    /**
     * Renders the checkbox form item
     */
    private renderCheckbox(): React.ReactNode {
        return <CheckboxFormControl {...this.getCommonFormControlPropsProps()} />;
    }

    /**
     * Renders a section link for properties
     * that are objects
     */
    private renderSectionLink(): React.ReactNode {
        return (
            <SectionLinkFormControl
                onUpdateSection={this.handleSectionLinkClick}
                schemaLocation={this.props.schemaLocation}
                {...this.getCommonFormControlPropsProps()}
            />
        );
    }

    /**
     * Renders the textarea form item
     */
    private renderTextarea(): React.ReactNode {
        return <TextareaFormControl {...this.getCommonFormControlPropsProps()} />;
    }

    /**
     * Renders the select form item
     */
    private renderSelect(): React.ReactNode {
        const options: any[] = this.props.schema.enum;

        if (!this.props.required && typeof options[0] !== "undefined") {
            options.unshift(void 0);
        }

        return (
            <SelectFormControl
                options={options}
                {...this.getCommonFormControlPropsProps()}
            />
        );
    }

    /**
     * Renders the display form item
     */
    private renderDisplay(): React.ReactNode {
        return <DisplayFormControl {...this.getCommonFormControlPropsProps()} />;
    }

    private renderButton(): React.ReactNode {
        return <ButtonFormControl {...this.getCommonFormControlPropsProps()} />;
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
    private getCommonFormControlPropsProps(): CommonFormControlProps {
        return {
            index: this.props.index,
            dataLocation: this.props.dataLocation,
            data: this.props.data,
            required: this.props.required,
            label: get(this.props, "schema.title"),
            disabled: get(this.props, "schema.disabled"),
            onChange: this.props.onChange,
            default: get(this.props, "schema.default") || this.props.default,
            badge: get(this.props, "schema.badge"),
            badgeDescription: get(this.props, "schema.badgeDescription"),
            invalidMessage: this.props.invalidMessage,
            displayValidationBrowserDefault: this.props.displayValidationBrowserDefault,
            displayValidationInline: this.props.displayValidationInline,
            schema: this.props.schema,
            softRemove: this.props.softRemove,
        };
    }
}

export default FormControlSwitch;
export { FormControlSwitchProps };
