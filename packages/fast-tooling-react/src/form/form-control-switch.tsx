import React from "react";
import DisplayControl from "./controls/control.display";
import SectionLinkControl from "./controls/control.section-link";
import NumberFieldControl from "./controls/control.number-field";
import ArrayControl from "./controls/control.array";
import TextareaControl from "./controls/control.textarea";
import SelectControl from "./controls/control.select";
import ChildrenControl from "./controls/control.children";
import { get } from "lodash-es";
import CheckboxControl from "./controls/control.checkbox";
import ButtonControl from "./controls/control.button";
import { FormControlSwitchProps } from "./form-control-switch.props";
import {
    ArrayControlConfig,
    ChildrenControlConfig,
    CommonControlConfig,
    ControlConfig,
    ControlContext,
    ControlTemplateUtilitiesProps,
    LinkControlConfig,
    ListControlConfig,
    NumberTypeControlConfig,
    StandardControlPlugin,
    TextboxControlConfig,
} from "./templates";
import { FormChildOptionItem } from "./form.props";
import { generateExampleData, isConst, isSelect } from "./utilities";
import { ItemConstraints } from "./controls/control.array.props";
import { SingleLineControlPlugin } from "./templates/plugin.control.single-line";

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
        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            context: ControlContext.fill,
            control: (config: ChildrenControlConfig): React.ReactNode => {
                return <ChildrenControl {...config} />;
            },
        });

        standardControl.updateConfig(
            Object.assign(
                {
                    childOptions: this.getChildOptions(),
                    defaultChildOptions: this.props.schema.defaults || null,
                },
                this.getCommonControlProps()
            )
        );

        return standardControl.render();
    }

    /**
     * Renders the array form item
     */
    private renderArray(): React.ReactNode {
        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            context: ControlContext.fill,
            control: (config: ArrayControlConfig): React.ReactNode => {
                return <ArrayControl {...config} />;
            },
        });

        standardControl.updateConfig(
            Object.assign(
                {
                    minItems: get(this.props.schema, ItemConstraints.minItems, 0),
                    maxItems: get(this.props.schema, ItemConstraints.maxItems, Infinity),
                    onAddExampleData: this.handleAddExampleData,
                },
                this.getCommonControlProps()
            )
        );

        return standardControl.render();
    }

    /**
     * Renders the number field form item
     */
    private renderNumberField(): React.ReactNode {
        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            control: (config: NumberTypeControlConfig): React.ReactNode => {
                return <NumberFieldControl {...config} />;
            },
        });

        standardControl.updateConfig(
            Object.assign(
                {
                    min: this.props.schema.minimum,
                    max: this.props.schema.maximum,
                    step: this.props.schema.multipleOf,
                },
                this.getCommonControlProps()
            )
        );

        return standardControl.render();
    }

    /**
     * Renders the checkbox form item
     */
    private renderCheckbox(): React.ReactNode {
        const singleLineControl: SingleLineControlPlugin = new SingleLineControlPlugin({
            control: (config: CommonControlConfig): React.ReactNode => {
                return <CheckboxControl {...config} />;
            },
        });

        singleLineControl.updateConfig(this.getCommonControlProps());

        return singleLineControl.render();
    }

    /**
     * Renders a section link for properties
     * that are objects
     */
    private renderSectionLink(): React.ReactNode {
        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            control: (config: LinkControlConfig): React.ReactNode => {
                return <SectionLinkControl {...config} />;
            },
        });

        standardControl.updateConfig(this.getCommonControlProps());

        return standardControl.render();
    }

    /**
     * Renders the textarea form item
     */
    private renderTextarea(): React.ReactNode {
        const rows: number | undefined = this.props.schema.rows || void 0;

        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            control: (config: TextboxControlConfig): React.ReactNode => {
                return <TextareaControl {...config} />;
            },
        });

        standardControl.updateConfig(
            Object.assign(
                {
                    rows,
                },
                this.getCommonControlProps()
            )
        );

        return standardControl.render();
    }

    /**
     * Renders the select form item
     */
    private renderSelect(): React.ReactNode {
        const options: any[] = this.props.schema.enum || [];

        if (!this.props.required && typeof options[0] !== "undefined") {
            options.unshift(void 0);
        }

        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            control: (config: ListControlConfig): React.ReactNode => {
                return <SelectControl {...config} />;
            },
        });

        standardControl.updateConfig(
            Object.assign(
                {
                    options,
                },
                this.getCommonControlProps()
            )
        );

        return standardControl.render();
    }

    /**
     * Renders the display form item
     */
    private renderDisplay(): React.ReactNode {
        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            control: (config: ControlConfig): React.ReactNode => {
                return <DisplayControl {...config} />;
            },
        });

        standardControl.updateConfig(this.getCommonControlProps());

        return standardControl.render();
    }

    private renderButton(): React.ReactNode {
        const standardControl: StandardControlPlugin = new StandardControlPlugin({
            control: (config: ControlConfig): React.ReactNode => {
                return <ButtonControl {...config} />;
            },
        });

        standardControl.updateConfig(this.getCommonControlProps());

        return standardControl.render();
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
            disabled: schema.disabled,
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
