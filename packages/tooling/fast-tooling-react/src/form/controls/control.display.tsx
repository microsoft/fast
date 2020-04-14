import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { DisplayControlClassNameContract } from "./control.display.style";
import { DisplayControlProps } from "./control.display.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";

/**
 * Form control definition
 */
class DisplayControl extends React.Component<
    DisplayControlProps & ManagedClasses<DisplayControlClassNameContract>,
    {}
> {
    public static displayName: string = "DisplayControl";

    public static defaultProps: Partial<
        DisplayControlProps & ManagedClasses<DisplayControlClassNameContract>
    > = {
        managedClasses: {},
    };

    public render(): React.ReactNode {
        return (
            <input
                className={classNames(
                    this.props.managedClasses.displayControl,
                    [
                        this.props.managedClasses.displayControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.displayControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                type={"text"}
                ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                onBlur={this.props.updateValidity}
                onFocus={this.props.reportValidity}
                value={this.getDisplayValue(this.props.value)}
                onChange={this.handleInputChange}
                disabled={this.props.disabled}
                required={this.props.required}
            />
        );
    }

    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    /* tslint:disable-next-line */
    private handleInputChange = (): void => {};

    private getDisplayValue(data: any): string {
        const typeofData: string = typeof data;
        const typeofDefault: string = typeof this.props.default;

        if (typeofData === "undefined" && typeofDefault !== "undefined") {
            if (typeofDefault === "string") {
                return this.props.default;
            }

            return JSON.stringify(this.props.default, null, 2);
        }

        switch (typeofData) {
            case "string":
                return data;
            default:
                return JSON.stringify(data, null, 2);
        }
    }
}

export { DisplayControl };
export default manageJss(styles)(DisplayControl);
