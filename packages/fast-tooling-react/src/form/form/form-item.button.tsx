import React from "react";
import { get } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./form-item.button.style";
import { getStringValue } from "../utilities";
import {
    FormItemButtonClassNameContract,
    FormItemButtonProps,
} from "./form-item.button.props";
import FormItemBase from "./form-item.base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemButton extends FormItemBase<
    FormItemButtonProps & ManagedClasses<FormItemButtonClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemButton";

    public render(): React.ReactNode {
        if (this.props.required && this.props.invalidMessage === "") {
            return null;
        }

        return (
            <div className={this.generateClassNames()}>
                <div
                    className={get(
                        this.props,
                        "managedClasses.formItemButton_controlRegion"
                    )}
                >
                    <div
                        className={get(
                            this.props,
                            "managedClasses.formItemButton_control"
                        )}
                    >
                        <div
                            className={get(
                                this.props,
                                "managedClasses.formItemButton_controlLabelRegion"
                            )}
                        >
                            <label
                                className={get(
                                    this.props,
                                    "managedClasses.formItemButton_controlLabel"
                                )}
                                htmlFor={this.props.dataLocation}
                            >
                                {this.props.label}
                            </label>
                            {this.renderDefaultValueIndicator(
                                get(
                                    this.props,
                                    "managedClasses.formItemButton_defaultValueIndicator"
                                )
                            )}
                            {this.renderBadge(
                                get(this.props, "managedClasses.formItemButton_badge")
                            )}
                        </div>
                        <button
                            className={get(
                                this.props,
                                "managedClasses.formItemButton_controlInput"
                            )}
                            ref={this.buttonRef}
                            onBlur={this.updateValidity}
                            onFocus={this.reportValidity}
                            onClick={this.handleButtonClick}
                            disabled={this.props.disabled}
                        >
                            Set to null
                        </button>
                        <input
                            id={this.props.dataLocation}
                            hidden={true}
                            value={this.getValue()}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div
                        className={get(
                            this.props,
                            "managedClasses.formItemButton_softRemove"
                        )}
                    >
                        {this.renderSoftRemove(
                            get(
                                this.props,
                                "managedClasses.formItemButton_softRemoveInput"
                            )
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.formItemButton_invalidMessage")
                )}
            </div>
        );
    }

    private handleButtonClick = (): void => {
        this.props.onChange(this.props.dataLocation, null);
    };

    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    /* tslint:disable-next-line */
    private handleInputChange = (): void => {};

    private getValue(): string {
        if (this.props.data === null) {
            return JSON.stringify(this.props.data);
        } else if (typeof this.props.data !== "undefined") {
            return this.props.data;
        }

        return "";
    }

    private generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.formItemButton");

        if (this.props.disabled) {
            classes += ` ${get(this.props, "managedClasses.formItemButton__disabled")}`;
        }

        return classes;
    }
}

export { FormItemButton };
export default manageJss(styles)(FormItemButton);
