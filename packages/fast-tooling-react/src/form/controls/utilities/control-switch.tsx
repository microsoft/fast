import React from "react";
import { get } from "lodash-es";
import { ControlSwitchProps } from "./control-switch.props";
import {
    AdditionalControlConfigOptions,
    ControlTemplateUtilitiesProps,
    StandardControlPlugin,
} from "../../templates";
import { generateExampleData, isConst, isSelect } from "./form";
import { ItemConstraints } from "@microsoft/fast-tooling";
import { SingleLineControlPlugin } from "../../templates/plugin.control.single-line";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "../../templates/plugin.control.utilities";
import { ControlType } from "../../index";
import { dictionaryLink } from "@microsoft/fast-tooling";

class ControlSwitch extends React.Component<ControlSwitchProps, {}> {
    public static displayName: string = "ControlSwitch";

    public static defaultProps: Partial<ControlSwitchProps> = {
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

        // Check to see if there is any associated `controlId`
        // then check for the id within the passed controlPlugins
        if (
            typeof this.props.schema.formControlId === "string" &&
            this.props.controlPlugins
        ) {
            control = this.props.controlPlugins.find(
                (controlPlugin: StandardControlPlugin) => {
                    return controlPlugin.matchesId(this.props.schema.formControlId);
                }
            );
        }

        if (this.props.schema[dictionaryLink]) {
            return this.renderDataLink(
                control !== undefined ? control : this.props.controls.linkedData
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

        if (this.props.schema === false) {
            return null;
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

    private renderDataLink(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps(ControlType.linkedData));

        return control.render();
    }

    /**
     * Renders the array form item
     */
    private renderArray(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(
            Object.assign(this.getCommonControlProps(ControlType.array), {
                minItems: get(this.props.schema, ItemConstraints.minItems, 0),
                maxItems: get(this.props.schema, ItemConstraints.maxItems, Infinity),
                onAddExampleData: this.handleAddExampleData,
            })
        );

        return control.render();
    }

    /**
     * Renders the number field form item
     */
    private renderNumberField(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(
            Object.assign(this.getCommonControlProps(ControlType.numberField), {
                min: this.props.schema.minimum,
                max: this.props.schema.maximum,
                step: this.props.schema.multipleOf,
            })
        );

        return control.render();
    }

    /**
     * Renders the checkbox form item
     */
    private renderCheckbox(control: SingleLineControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps(ControlType.checkbox));

        return control.render();
    }

    /**
     * Renders a section link for properties
     * that are objects
     */
    private renderSectionLink(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps(ControlType.sectionLink));

        return control.render();
    }

    /**
     * Renders the textarea form item
     */
    private renderTextarea(control: StandardControlPlugin): React.ReactNode {
        const rows: number | undefined = this.props.schema.rows || void 0;

        control.updateProps(
            Object.assign(this.getCommonControlProps(ControlType.textarea), {
                rows,
            })
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
            Object.assign(this.getCommonControlProps(ControlType.select), {
                options,
            })
        );

        return control.render();
    }

    /**
     * Renders the display form item
     */
    private renderDisplay(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps(ControlType.display));

        return control.render();
    }

    private renderButton(control: StandardControlPlugin): React.ReactNode {
        control.updateProps(this.getCommonControlProps(ControlType.button));

        return control.render();
    }

    private handleAddExampleData = (additionalSchemaPathSyntax: string): any => {
        return generateExampleData(this.props.schema, additionalSchemaPathSyntax);
    };

    /**
     * Gets the common form control props
     */
    private getCommonControlProps(
        type: ControlType
    ): ControlTemplateUtilitiesProps & AdditionalControlConfigOptions {
        const schema: any = get(this.props, "schema", {});

        return {
            index: this.props.index,
            type,
            dataLocation: this.props.dataLocation,
            navigationConfigId: this.props.navigationConfigId,
            dictionaryId: this.props.dictionaryId,
            dataDictionary: this.props.dataDictionary,
            navigation: this.props.navigation,
            schemaLocation: this.props.schemaLocation,
            data: this.props.data,
            schemaDictionary: this.props.schemaDictionary,
            schema,
            required: this.props.required,
            label: schema.title || schema.description || this.props.untitled,
            labelTooltip: schema.description,
            disabled: this.props.disabled || schema.disabled,
            onChange: this.props.onChange,
            default:
                typeof schema.default !== "undefined"
                    ? schema.default
                    : typeof this.props.default !== "undefined"
                        ? this.props.default
                        : void 0,
            const: schema.const || this.props.const,
            badge: schema.badge,
            badgeDescription: schema.badgeDescription,
            invalidMessage: this.props.invalidMessage,
            validationErrors: this.props.validationErrors,
            displayValidationBrowserDefault: this.props.displayValidationBrowserDefault,
            displayValidationInline: this.props.displayValidationInline,
            onUpdateSection: this.props.onUpdateSection,
            softRemove: this.props.softRemove,
            component: this.props.controlComponents[type],
            controls: this.props.controls,
            controlComponents: this.props.controlComponents,
            controlPlugins: this.props.controlPlugins,
            untitled: this.props.untitled,
            messageSystem: this.props.messageSystem,
        };
    }
}

export default ControlSwitch;
export { ControlSwitchProps };
