import React from "react";
import { isEqual } from "lodash-es";
import Badge from "./badge";
import DefaultValue from "./default-value";
import ConstValue from "./const-value";
import SoftRemove from "./soft-remove";
import {
    AdditionalControlConfigOptions,
    ControlConfig,
    ControlTemplateUtilitiesProps,
    FormHTMLElement,
} from "./template.control.utilities.props";
import { ControlType, OnChangeConfig } from "./types";

/**
 * Control template definition
 * This should be extended to create custom templates
 */
abstract class ControlTemplateUtilities<P, S> extends React.Component<
    P & ControlTemplateUtilitiesProps & AdditionalControlConfigOptions,
    S
> {
    public ref: React.RefObject<FormHTMLElement> = React.createRef<FormHTMLElement>();

    private cache: string;

    public componentDidMount(): void {
        this.updateValidity();
    }

    public componentDidUpdate(prevProps: P & ControlTemplateUtilitiesProps): void {
        if (prevProps.invalidMessage !== this.props.invalidMessage) {
            this.updateValidity();
        }
    }

    public renderSoftRemove(className: string): React.ReactNode {
        if (!this.props.required && this.props.softRemove) {
            return (
                <SoftRemove
                    className={className}
                    checked={this.props.data !== undefined}
                    onChange={this.handleSoftRemove}
                    disabled={
                        this.props.disabled &&
                        this.props.data === undefined &&
                        this.cache === undefined
                    }
                />
            );
        }
    }

    public renderBadge(className: string): React.ReactNode {
        if (this.props.badge) {
            return (
                <Badge
                    className={className}
                    type={this.props.badge}
                    description={this.props.badgeDescription}
                />
            );
        }
    }

    public renderConstValueIndicator(className: string): React.ReactNode {
        if (this.props.const !== undefined && this.props.data !== this.props.const) {
            return (
                <ConstValue
                    className={className}
                    disabled={this.props.disabled}
                    onChange={this.handleSetConstValue}
                    strings={this.props.strings}
                />
            );
        }
    }

    /**
     * Renders an indicator that signifies that the value
     * displayed is a default value
     */
    public renderDefaultValueIndicator(className: string): React.ReactNode {
        if (
            typeof this.props.default !== "undefined" &&
            !isEqual(this.props.data, this.props.default)
        ) {
            return (
                <DefaultValue
                    className={className}
                    disabled={this.props.disabled}
                    onChange={this.handleSetDefaultValue}
                    strings={this.props.strings}
                />
            );
        }
    }

    public handleChange = (config: OnChangeConfig): any => {
        return this.props.onChange({
            dataLocation: this.props.dataLocation,
            dictionaryId: this.props.dictionaryId,
            value: config.value,
            isArray: config.isArray,
            isLinkedData: config.isLinkedData,
            linkedDataAction: config.linkedDataAction,
            index: config.index,
        });
    };

    public handleSetDefaultValue = (): void => {
        this.props.onChange({
            dataLocation: this.props.dataLocation,
            dictionaryId: this.props.dictionaryId,
            value: this.props.default,
        });
    };

    public handleSetConstValue = (): void => {
        this.props.onChange({
            dataLocation: this.props.dataLocation,
            dictionaryId: this.props.dictionaryId,
            value: this.props.const,
        });
    };

    public handleSoftRemove = (): void => {
        if (typeof this.props.data !== "undefined") {
            this.cache = this.props.data;

            return this.props.onChange({
                dataLocation: this.props.dataLocation,
                dictionaryId: this.props.dictionaryId,
                value: undefined,
            });
        } else {
            return this.props.onChange({
                dataLocation: this.props.dataLocation,
                dictionaryId: this.props.dictionaryId,
                value: this.cache,
            });
        }
    };

    /**
     * Renders an invalid message
     */
    public renderInvalidMessage = (className: string): React.ReactNode => {
        if (this.props.invalidMessage !== "" && this.props.displayValidationInline) {
            return <div className={className}>{this.props.invalidMessage}</div>;
        }
    };

    /**
     * updates the validity
     */
    public updateValidity = (): void => {
        const formControlElement: HTMLElement = this.ref.current;

        if (formControlElement !== null && typeof formControlElement !== "undefined") {
            this.ref.current.setCustomValidity(this.props.invalidMessage);
        }
    };

    /**
     * Reports the current validity of the form item
     */
    public reportValidity = (): void => {
        this.updateValidity();

        if (this.props.displayValidationBrowserDefault) {
            this.ref.current.reportValidity();
        }
    };

    public getConfig(): ControlConfig {
        return {
            type: this.props.type,
            schemaDictionary: this.props.schemaDictionary,
            dataLocation: this.props.dataLocation,
            navigationConfigId: this.props.navigationConfigId,
            dictionaryId: this.props.dictionaryId,
            dataDictionary: this.props.dataDictionary,
            navigation: this.props.navigation,
            schemaLocation: this.props.schemaLocation,
            disabled: this.props.disabled,
            value: this.props.data,
            schema: this.props.schema,
            elementRef: this.ref,
            reportValidity: this.reportValidity,
            updateValidity: this.updateValidity,
            onChange:
                this.props.type === ControlType.section
                    ? this.props.onChange
                    : this.handleChange,
            min: this.props.min,
            max: this.props.max,
            step: this.props.step,
            rows: this.props.rows,
            options: this.props.options,
            label: this.props.label,
            onUpdateSection: this.props.onUpdateSection,
            invalidMessage: this.props.invalidMessage,
            validationErrors: this.props.validationErrors,
            displayValidationBrowserDefault: this.props.displayValidationBrowserDefault,
            displayValidationInline: this.props.displayValidationInline,
            minItems: this.props.minItems,
            maxItems: this.props.maxItems,
            onAddExampleData: this.props.onAddExampleData,
            default: this.props.default,
            component: this.props.component,
            required: this.props.required,
            controls: this.props.controls,
            controlComponents: this.props.controlComponents,
            controlPlugins: this.props.controlPlugins,
            untitled: this.props.untitled,
            messageSystem: this.props.messageSystem,
            strings: this.props.strings,
            messageSystemOptions: this.props.messageSystemOptions,
            categories: this.props.categories,
        };
    }

    /**
     * Explicitly updates the default value as the value
     */
    public handleUpdateValueToDefaultValue = (): void => {
        this.props.onChange({
            dataLocation: this.props.dataLocation,
            dictionaryId: this.props.dictionaryId,
            value: this.props.default,
        });
    };
}

export default ControlTemplateUtilities;
