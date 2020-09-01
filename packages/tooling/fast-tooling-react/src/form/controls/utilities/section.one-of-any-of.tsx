import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import styles from "./section.one-of-any-of.style";
import {
    SectionOneOfAnyOfClassNameContract,
    SectionOneOfAnyOfProps,
} from "./section.one-of-any-of.props";
import { uniqueId } from "lodash-es";

/**
 * Schema form component definition
 * @extends React.Component
 */
class SectionOneOfAnyOf extends React.Component<
    SectionOneOfAnyOfProps & ManagedClasses<SectionOneOfAnyOfClassNameContract>,
    {}
> {
    public static displayName: string = "SectionOneOfAnyOf";

    public render(): React.ReactNode {
        const id: string = uniqueId();

        return (
            <div className={this.props.managedClasses.sectionOneOfAnyOf}>
                <label
                    htmlFor={id}
                    className={this.props.managedClasses.sectionOneOfAnyOf_label}
                >
                    {this.props.label}
                </label>
                <span className={this.props.managedClasses.sectionOneOfAnyOf_selectSpan}>
                    <select
                        className={this.props.managedClasses.sectionOneOfAnyOf_select}
                        id={id}
                        onChange={this.handleChange}
                        value={this.getActiveIndex()}
                    >
                        {this.props.children}
                    </select>
                </span>
            </div>
        );
    }

    private getActiveIndex(): number {
        return typeof this.props.activeIndex === "number" ? this.props.activeIndex : -1;
    }

    private handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.onUpdate(parseInt(e.target.value, 10));
    };
}

export default manageJss(styles)(SectionOneOfAnyOf);
export { SectionOneOfAnyOfProps };
