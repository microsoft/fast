import React from "react";
import { get } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./form-item.textarea.style";
import {
    FormItemTextareaClassNameContract,
    FormItemTextareaProps,
} from "./form-item.textarea.props";
import FormItemBase from "./form-item.base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemTextarea extends FormItemBase<
    FormItemTextareaProps & ManagedClasses<FormItemTextareaClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemTextarea";

    public render(): JSX.Element {
        return (
            <div className={this.generateClassNames()}>
                <div className={this.props.managedClasses.formItemTextarea_control}>
                    <label
                        htmlFor={this.props.dataLocation}
                        className={
                            this.props.managedClasses.formItemTextarea_controlLabel
                        }
                    >
                        {this.props.label}
                    </label>
                    <textarea
                        className={
                            this.props.managedClasses.formItemTextarea_controlTextarea
                        }
                        id={this.props.dataLocation}
                        name={this.props.dataLocation}
                        rows={typeof this.props.rows === "number" ? this.props.rows : 3}
                        value={this.props.data || ""}
                        onChange={this.handleChange}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className={this.props.managedClasses.formItemTextarea_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.formItemTextarea_softRemoveInput
                    )}
                </div>
            </div>
        );
    }

    private handleChange = ({ target: { value } }: any): any => {
        return this.props.onChange(this.props.dataLocation, value);
    };

    private generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.formItemTextarea");

        if (this.props.disabled) {
            classes += ` ${get(this.props, "managedClasses.formItemTextarea__disabled")}`;
        }

        return classes;
    }
}

export default manageJss(styles)(FormItemTextarea);
