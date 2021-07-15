import React from "react";
import { isEqual } from "lodash-es";
import Badge from "./badge";
import DefaultValue from "./default-value";
import ConstValue from "./const-value";
import SoftRemove from "./soft-remove";
import { ControlType } from "./types";
/**
 * Control template definition
 * This should be extended to create custom templates
 */
class ControlTemplateUtilities extends React.Component {
    constructor() {
        super(...arguments);
        this.ref = React.createRef();
        this.handleChange = config => {
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
        this.handleSetDefaultValue = () => {
            this.props.onChange({
                dataLocation: this.props.dataLocation,
                dictionaryId: this.props.dictionaryId,
                value: this.props.default,
            });
        };
        this.handleSetConstValue = () => {
            this.props.onChange({
                dataLocation: this.props.dataLocation,
                dictionaryId: this.props.dictionaryId,
                value: this.props.const,
            });
        };
        this.handleSoftRemove = () => {
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
        this.renderInvalidMessage = className => {
            if (this.props.invalidMessage !== "" && this.props.displayValidationInline) {
                return <div className={className}>{this.props.invalidMessage}</div>;
            }
        };
        /**
         * updates the validity
         */
        this.updateValidity = () => {
            const formControlElement = this.ref.current;
            if (
                formControlElement !== null &&
                typeof formControlElement !== "undefined"
            ) {
                this.ref.current.setCustomValidity(this.props.invalidMessage);
            }
        };
        /**
         * Reports the current validity of the form item
         */
        this.reportValidity = () => {
            this.updateValidity();
            if (this.props.displayValidationBrowserDefault) {
                this.ref.current.reportValidity();
            }
        };
        /**
         * Explicitly updates the default value as the value
         */
        this.handleUpdateValueToDefaultValue = () => {
            this.props.onChange({
                dataLocation: this.props.dataLocation,
                dictionaryId: this.props.dictionaryId,
                value: this.props.default,
            });
        };
    }
    componentDidMount() {
        this.updateValidity();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.invalidMessage !== this.props.invalidMessage) {
            this.updateValidity();
        }
    }
    renderSoftRemove(className) {
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
    renderBadge(className) {
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
    renderConstValueIndicator(className) {
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
    renderDefaultValueIndicator(className) {
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
    getConfig() {
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
}
export default ControlTemplateUtilities;
