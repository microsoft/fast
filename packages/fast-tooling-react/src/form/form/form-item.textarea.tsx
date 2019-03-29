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
                <div className={this.props.managedClasses.formItemTextarea_controlRegion}>
                    <div className={this.props.managedClasses.formItemTextarea_control}>
                        <div
                            className={get(
                                this.props,
                                "managedClasses.formItemTextarea_controlLabelRegion"
                            )}
                        >
                            <label
                                htmlFor={this.props.dataLocation}
                                className={
                                    this.props.managedClasses
                                        .formItemTextarea_controlLabel
                                }
                            >
                                {this.props.label}
                            </label>
                            {this.renderDefaultValueIndicator(
                                get(
                                    this.props,
                                    "managedClasses.formItemTextarea_defaultValueIndicator"
                                )
                            )}
                            {this.renderBadge(
                                get(this.props, "managedClasses.formItemTextarea_badge")
                            )}
                        </div>
                        <textarea
                            className={
                                this.props.managedClasses.formItemTextarea_controlTextarea
                            }
                            id={this.props.dataLocation}
                            name={this.props.dataLocation}
                            rows={
                                typeof this.props.rows === "number" ? this.props.rows : 3
                            }
                            value={this.getValue()}
                            onChange={this.handleChange}
                            disabled={this.props.disabled}
                            ref={this.textAreaRef}
                            onFocus={this.reportValidity}
                            onBlur={this.updateValidity}
                        />
                    </div>
                    <div
                        className={this.props.managedClasses.formItemTextarea_softRemove}
                    >
                        {this.renderSoftRemove(
                            this.props.managedClasses.formItemTextarea_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.formItemTextarea_invalidMessage")
                )}
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

    private getValue(): string {
        if (typeof this.props.data === "undefined") {
            if (typeof this.props.default === "string") {
                return this.props.default;
            }

            return "";
        }

        return this.props.data;
    }
}

export { FormItemTextarea };
export default manageJss(styles)(FormItemTextarea);
