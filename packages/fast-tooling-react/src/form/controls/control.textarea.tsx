import React from "react";
import { get } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./control.textarea.style";
import {
    TextareaFormControlClassNameContract,
    TextareaFormControlProps,
} from "./control.textarea.props";
import BaseFormControl from "./template.control.abstract";

/**
 * Schema form component definition
 * @extends React.Component
 */
class TextareaFormControl extends BaseFormControl<
    TextareaFormControlProps & ManagedClasses<TextareaFormControlClassNameContract>,
    {}
> {
    public static displayName: string = "TextareaFormControl";

    public render(): JSX.Element {
        return (
            <div className={this.generateClassNames()}>
                <div
                    className={
                        this.props.managedClasses.textareaFormControl_controlRegion
                    }
                >
                    <div
                        className={this.props.managedClasses.textareaFormControl_control}
                    >
                        <div
                            className={get(
                                this.props,
                                "managedClasses.textareaFormControl_controlLabelRegion"
                            )}
                        >
                            <label
                                htmlFor={this.props.dataLocation}
                                className={
                                    this.props.managedClasses
                                        .textareaFormControl_controlLabel
                                }
                            >
                                {this.props.label}
                            </label>
                            {this.renderDefaultValueIndicator(
                                get(
                                    this.props,
                                    "managedClasses.textareaFormControl_defaultValueIndicator"
                                )
                            )}
                            {this.renderBadge(
                                get(
                                    this.props,
                                    "managedClasses.textareaFormControl_badge"
                                )
                            )}
                        </div>
                        <textarea
                            className={
                                this.props.managedClasses
                                    .textareaFormControl_controlTextarea
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
                        className={
                            this.props.managedClasses.textareaFormControl_softRemove
                        }
                    >
                        {this.renderSoftRemove(
                            this.props.managedClasses.textareaFormControl_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.textareaFormControl_invalidMessage")
                )}
            </div>
        );
    }

    private handleChange = ({ target: { value } }: any): any => {
        return this.props.onChange(this.props.dataLocation, value);
    };

    private generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.textareaFormControl");

        if (this.props.disabled) {
            classes += ` ${get(
                this.props,
                "managedClasses.textareaFormControl__disabled"
            )}`;
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

export { TextareaFormControl };
export default manageJss(styles)(TextareaFormControl);
