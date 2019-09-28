import React from "react";
import { get } from "lodash-es";
import Badge from "./badge";
import DefaultValue from "./default-value";
import ConstValue from "./const-value";
import SoftRemove from "./soft-remove";
import {
    AbstractControlTemplateProps,
    ControlConfig,
} from "./template.control.abstract.props";
import { FormHTMLElement } from "./template.control.abstract.props";

/**
 * Abstract control template definition
 */
abstract class AbstractControlTemplate<P, S> extends React.Component<
    P & AbstractControlTemplateProps,
    S
> {
    public ref: React.RefObject<FormHTMLElement> = React.createRef<FormHTMLElement>();

    private cache: string;

    public componentDidMount(): void {
        this.updateValidity();
    }

    public componentDidUpdate(prevProps: P & AbstractControlTemplateProps): void {
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
                    disabled={this.props.data === undefined && this.cache === undefined}
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
                <ConstValue className={className} onChange={this.handleSetConstValue} />
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
            this.props.data !== this.props.default
        ) {
            return (
                <DefaultValue
                    className={className}
                    onChange={this.handleSetDefaultValue}
                />
            );
        }
    }

    public handleChange = (value: any, isArray?: boolean, index?: number): any => {
        return this.props.onChange(this.props.dataLocation, value, isArray, index);
    };

    public handleSetDefaultValue = (): void => {
        this.props.onChange(this.props.dataLocation, this.props.default);
    };

    public handleSetConstValue = (): void => {
        this.props.onChange(this.props.dataLocation, this.props.const);
    };

    public handleSoftRemove = (): void => {
        if (typeof this.props.data !== "undefined") {
            this.cache = this.props.data;

            return this.props.onChange(this.props.dataLocation, undefined);
        } else {
            return this.props.onChange(this.props.dataLocation, this.cache);
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
        const formControlElement: HTMLElement = get(this, "ref.current");

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
            dataLocation: this.props.dataLocation,
            schemaLocation: this.props.schemaLocation,
            disabled: this.props.disabled,
            value: this.props.data,
            elementRef: this.ref,
            reportValidity: this.reportValidity,
            updateValidity: this.updateValidity,
            onChange: this.handleChange,
            min: this.props.min,
            max: this.props.max,
            step: this.props.step,
            rows: this.props.rows,
            options: this.props.options,
            label: this.props.label,
            onUpdateSection: this.props.onUpdateSection,
            invalidMessage: this.props.invalidMessage,
            minItems: this.props.minItems,
            maxItems: this.props.maxItems,
            onAddExampleData: this.props.onAddExampleData,
            default: this.props.default,
            defaultChildOptions: this.props.defaultChildOptions,
            childOptions: this.props.childOptions,
        };
    }

    /**
     * Explicitly updates the default value as the value
     */
    public handleUpdateValueToDefaultValue = (): void => {
        this.props.onChange(this.props.dataLocation, this.props.default);
    };
}

export default AbstractControlTemplate;
