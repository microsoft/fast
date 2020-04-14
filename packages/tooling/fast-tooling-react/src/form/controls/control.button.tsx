import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { ButtonControlClassNameContract } from "./control.button.style";
import { ButtonControlProps } from "./control.button.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";

/**
 * Form control definition
 * @extends React.Component
 */
class ButtonControl extends React.Component<
    ButtonControlProps & ManagedClasses<ButtonControlClassNameContract>,
    {}
> {
    public static displayName: string = "ButtonControl";

    public static defaultProps: Partial<
        ButtonControlProps & ManagedClasses<ButtonControlClassNameContract>
    > = {
        managedClasses: {},
    };

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <button
                    className={classNames(
                        this.props.managedClasses.buttonControl,
                        [
                            this.props.managedClasses.buttonControl__disabled,
                            this.props.disabled,
                        ],
                        [
                            this.props.managedClasses.buttonControl__default,
                            isDefault(this.props.value, this.props.default),
                        ]
                    )}
                    ref={this.props.elementRef as React.Ref<HTMLButtonElement>}
                    onBlur={this.props.updateValidity}
                    onFocus={this.props.reportValidity}
                    onClick={this.handleButtonClick()}
                    disabled={this.props.disabled}
                >
                    Set to null
                </button>
                <input
                    id={this.props.dataLocation}
                    hidden={true}
                    value={this.props.value || ""}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                    required={this.props.required}
                />
            </React.Fragment>
        );
    }

    private handleButtonClick = (): ((
        e: React.MouseEvent<HTMLButtonElement>
    ) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            this.props.onChange({ value: null });
        };
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
}

export { ButtonControl };
export default manageJss(styles)(ButtonControl);
