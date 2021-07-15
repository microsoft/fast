import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./section.one-of-any-of.style";
import { uniqueId } from "lodash-es";
/**
 * Schema form component definition
 * @extends React.Component
 */
class SectionOneOfAnyOf extends React.Component {
    constructor() {
        super(...arguments);
        this.handleChange = e => {
            this.props.onUpdate(parseInt(e.target.value, 10));
        };
    }
    render() {
        const id = uniqueId();
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
    getActiveIndex() {
        return typeof this.props.activeIndex === "number" ? this.props.activeIndex : -1;
    }
}
SectionOneOfAnyOf.displayName = "SectionOneOfAnyOf";
export default manageJss(styles)(SectionOneOfAnyOf);
