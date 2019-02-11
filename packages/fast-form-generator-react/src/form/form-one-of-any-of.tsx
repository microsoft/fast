import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import styles from "./form-one-of-any-of.style";
import {
    FormOneOfAnyOfClassNameContract,
    FormOneOfAnyOfProps,
    FormOneOfAnyOfState,
} from "./form-one-of-any-of.props";
import { uniqueId } from "lodash-es";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormOneOfAnyOf extends React.Component<
    FormOneOfAnyOfProps & ManagedClasses<FormOneOfAnyOfClassNameContract>,
    FormOneOfAnyOfState
> {
    public static displayName: string = "FormOneOfAnyOf";

    public render(): React.ReactNode {
        const id: string = uniqueId();

        return (
            <div className={this.props.managedClasses.formOneOfAnyOf}>
                <label
                    htmlFor={id}
                    className={this.props.managedClasses.formOneOfAnyOf_label}
                >
                    {this.props.label}
                </label>
                <span className={this.props.managedClasses.formOneOfAnyOf_selectSpan}>
                    <select
                        className={this.props.managedClasses.formOneOfAnyOf_select}
                        id={id}
                        onChange={this.handleChange}
                        value={this.props.activeIndex || 0}
                    >
                        {this.props.children}
                    </select>
                </span>
            </div>
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.onUpdate(parseInt(e.target.value, 10));
    };
}

export default manageJss(styles)(FormOneOfAnyOf);
export { FormOneOfAnyOfProps };
