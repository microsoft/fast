import React from "react";
import { get } from "lodash-es";
import { FormControlSwitchProps } from "./form-control-switch.props";
import { ControlTemplateUtilitiesProps, StandardControlPlugin } from "./templates";
import { FormChildOptionItem } from "./form.props";
import { generateExampleData, isConst, isSelect } from "./utilities";
import { ItemConstraints } from "./controls/control.array.props";
import { SingleLineControlPlugin } from "./templates/plugin.control.single-line";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "./templates/plugin.control.utilities";

class FormControlSwitch extends React.Component<FormControlSwitchProps, {}> {
    public static displayName: string = "FormControlSwitch";

    public static defaultProps: Partial<FormControlSwitchProps> = {
        softRemove: true,
    };

    public render(): React.ReactNode {
        return <React.Fragment>{this.renderControl()}</React.Fragment>;
    }

    /**
     * Renders form items
     */
    private renderControl(): React.ReactNode {
        let control: ControlPluginUtilities<ControlPluginUtilitiesProps>;

        // Check to see if there is any associated `formControlId`
        // then check for the id within the passed controlPlugins
        if (typeof this.props.schema.formControlId === "string") {
            control = this.props.controlPlugins.find(
                (controlPlugin: StandardControlPlugin) => {
                    return controlPlugin.matchesId(this.props.schema.formControlId);
                }
            );
        }

        const hasEnum: boolean = isSelect({ enum: this.props.schema.enum });

        if (
            isConst(this.props.schema) ||
            (hasEnum && this.props.schema.enum.length === 1)
        ) {
            return this.renderDisplay(
                control !== undefined ? control : this.props.controls.display
            );
        }

        if (hasEnum) {
            return this.renderSelect(
                control !== undefined ? control : this.props.controls.select
            );
        }

        if (this.props.schema.oneOf || this.props.schema.anyOf) {
            return this.renderSectionLink(
                control !== undefined ? control : this.props.controls.sectionLink
            );
        }

        switch (this.props.schema.type) {
            case "boolean":
                return this.renderCheckbox(
                    control !== undefined ? control : this.props.controls.checkbox
                );
            case "number":
                return this.renderNumberField(
                    control !== undefined ? control : this.props.controls.numberField
                );
            case "string":
                return this.renderTextarea(
                    control !== undefined ? control : this.props.controls.textarea
                );
            case "array":
                return this.renderArray(
                    control !== undefined ? control : this.props.controls.array
                );
            case "children":
                return this.renderChildren(
                    control !== undefined ? control : this.props.controls.children
                );
            case "null":
                return this.renderButton(
                    control !== undefined ? control : this.props.controls.button
                );
            default:
                return this.renderSectionLink(
                    control !== undefined ? control : this.props.controls.sectionLink
                );
        }
    }

    private renderChildren(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(
            Object.assign(
                {
                    childOptions: this.getChildOptions(),
                    defaultChildOptions: this.props.schema.defaults || null,
                },
                this.getCommonControlProps()
            )
        );

        return control.render();
    }

    /**
     * Renders the array form item
     */
    private renderArray(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(
            Object.assign(
                {
                    minItems: get(this.props.schema, ItemConstraints.minItems, 0),
                    maxItems: get(this.props.schema, ItemConstraints.maxItems, Infinity),
                    onAddExampleData: this.handleAddExampleData,
                },
                this.getCommonControlProps()
            )
        );

        return control.render();
    }

    /**
     * Renders the number field form item
     */
    private renderNumberField(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(
            Object.assign(
                {
                    min: this.props.schema.minimum,
                    max: this.props.schema.maximum,
                    step: this.props.schema.multipleOf,
                },
                this.getCommonControlProps()
            )
        );

        return control.render();
    }

    /**
     * Renders the checkbox form item
     */
    private renderCheckbox(control: SingleLineControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps());

        return control.render();
    }

    /**
     * Renders a section link for properties
     * that are objects
     */
    private renderSectionLink(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps());

        return control.render();
    }

    /**
     * Renders the textarea form item
     */
    private renderTextarea(control: StandardControlPlugin): React.ReactNode {
        const rows: number | undefined = this.props.schema.rows || void 0;

        control.updateProps(
            Object.assign(
                {
                    rows,
                },
                this.getCommonControlProps()
            )
        );

        return control.render();
    }

    /**
     * Renders the select form item
     */
    private renderSelect(control: StandardControlPlugin): React.ReactNode {
        const options: any[] = this.props.schema.enum || [];

        if (!this.props.required && typeof options[0] !== "undefined") {
            options.unshift(void 0);
        }

        control.updateProps(
            Object.assign(
                {
                    options,
                },
                this.getCommonControlProps()
            )
        );

        return control.render();
    }

    /**
     * Renders the display form item
     */
    private renderDisplay(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps());

        return control.render();
    }

    private renderButton(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps());

        return control.render();
    }

    private handleAddExampleData = (additionalSchemaPathSyntax: string): any => {
        return generateExampleData(this.props.schema, additionalSchemaPathSyntax);
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
     * Gets the common form control props
     */
    private getCommonControlProps(): ControlTemplateUtilitiesProps {
        const schema: any = get(this.props, "schema", {});

        return {
            index: this.props.index,
            dataLocation: this.props.dataLocation,
            schemaLocation: this.props.schemaLocation,
            data: this.props.data,
            required: this.props.required,
            label: schema.title || schema.description || this.props.untitled,
            labelTooltip: schema.description,
            disabled: this.props.disabled || schema.disabled,
            onChange: this.props.onChange,
            default: schema.default || this.props.default,
            const: schema.const || this.props.const,
            badge: schema.badge,
            badgeDescription: schema.badgeDescription,
            invalidMessage: this.props.invalidMessage,
            displayValidationBrowserDefault: this.props.displayValidationBrowserDefault,
            displayValidationInline: this.props.displayValidationInline,
            onUpdateSection: this.props.onUpdateSection,
            softRemove: this.props.softRemove,
        };
    }
}

export default FormControlSwitch;
export { FormControlSwitchProps };
