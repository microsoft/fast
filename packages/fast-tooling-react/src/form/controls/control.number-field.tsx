import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, {
    NumberFieldControlClassNameContract,
} from "./control.number-field.style";
import { NumberFieldControlProps } from "./control.number-field.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";

/**
 * Form control definition
 */
class NumberFieldControl extends React.Component<
    NumberFieldControlProps & ManagedClasses<NumberFieldControlClassNameContract>,
    {}
> {
    public static displayName: string = "NumberFieldControl";

    public static defaultProps: Partial<
        NumberFieldControlProps & ManagedClasses<NumberFieldControlClassNameContract>
    > = {
        managedClasses: {},
    };

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        return (
            <input
                className={classNames(
                    this.props.managedClasses.numberFieldControl,
                    [
                        this.props.managedClasses.numberFieldControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.numberFieldControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                id={this.props.dataLocation}
                type={"number"}
                value={this.getValue(this.props.value)}
                name={this.props.dataLocation}
                onChange={this.handleChange()}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                disabled={this.props.disabled}
                ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                onBlur={this.props.updateValidity}
                onFocus={this.props.reportValidity}
                required={this.props.required}
            />
        );
    }

    private handleChange = (): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const value: number = parseInt(e.target.value, 10);

            if (!isNaN(value)) {
                this.props.onChange({ value });
            }
        };
    };

    private getValue(value: number | undefined): number | string {
        return typeof value === "number"
            ? value
            : typeof this.props.default !== "undefined"
                ? this.props.default
                : "";
    }
}

export { NumberFieldControl };
export default manageJss(styles)(NumberFieldControl);
