import React from "react";
import { get } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./form-item.select.style";
import {
    FormItemSelectClassNameContract,
    FormItemSelectProps,
} from "./form-item.select.props";
import FormItemBase from "./form-item.base";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemSelect extends FormItemBase<
    FormItemSelectProps & ManagedClasses<FormItemSelectClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemSelect";

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        const value: any =
            typeof this.props.data !== "undefined"
                ? this.props.data
                : this.props.default || this.props.options[0];

        return (
            <div className={this.generateClassNames()}>
                <div className={this.props.managedClasses.formItemSelect_controlRegion}>
                    <div className={this.props.managedClasses.formItemSelect_control}>
                        <div
                            className={get(
                                this.props,
                                "managedClasses.formItemSelect_controlLabelRegion"
                            )}
                        >
                            <label
                                className={
                                    this.props.managedClasses.formItemSelect_controlLabel
                                }
                            >
                                {this.props.label}
                            </label>
                            {this.renderDefaultValueIndicator(
                                get(
                                    this.props,
                                    "managedClasses.formItemSelect_defaultValueIndicator"
                                )
                            )}
                            {this.renderBadge(
                                get(this.props, "managedClasses.formItemSelect_badge")
                            )}
                        </div>
                        <span className={this.generateControlSpanClassNames()}>
                            <select
                                className={
                                    this.props.managedClasses.formItemSelect_controlInput
                                }
                                onChange={this.handleChange}
                                value={JSON.stringify(value)}
                                disabled={this.props.disabled}
                                ref={this.selectRef}
                                onBlur={this.updateValidity}
                                onFocus={this.reportValidity}
                            >
                                {this.renderOptions()}
                            </select>
                        </span>
                    </div>
                    <div className={this.props.managedClasses.formItemSelect_softRemove}>
                        {this.renderSoftRemove(
                            this.props.managedClasses.formItemSelect_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.formItemSelect_invalidMessage")
                )}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateControlSpanClassNames(): string {
        return get(this.props, "managedClasses.formItemSelect_controlSpan");
    }

    private generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.formItemSelect");

        if (this.props.disabled) {
            classes += ` ${get(this.props, "managedClasses.formItemSelect__disabled")}`;
        }

        return classes;
    }

    /**
     * Handles the onChange of the select element
     */
    private handleChange = (event: React.FormEvent<HTMLSelectElement>): void => {
        this.props.onChange(
            this.props.dataLocation,
            this.parse((event.target as HTMLSelectElement).value)
        );
    };

    /**
     * Stringify the select value
     */
    private stringify(value: any): string | any {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }

    /**
     * Parse the select value
     */
    private parse(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    /**
     * Renders the selects option elements
     */
    private renderOptions(): JSX.Element[] {
        return this.props.options.map((item: any, index: number) => {
            const stringifiedItem: string = this.stringify(item);
            return (
                <option key={index} value={stringifiedItem}>
                    {typeof item === "string" || typeof item === "number"
                        ? item
                        : stringifiedItem}
                </option>
            );
        });
    }
}

export { FormItemSelect };
export default manageJss(styles)(FormItemSelect);
