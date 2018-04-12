import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, {HandledProps} from "../foundation";
import {ICheckboxHandledProps, ICheckboxManagedClasses, ICheckboxUnhandledProps} from "./checkbox.props";
import {ICheckboxClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import {get} from "lodash-es";

/* tslint:disable-next-line */
class Checkbox extends Foundation<ICheckboxHandledProps & ICheckboxManagedClasses, ICheckboxUnhandledProps, {}> {
    protected handledProps: HandledProps<ICheckboxHandledProps & IManagedClasses<ICheckboxClassNameContract>> = {
        managedClasses: void 0,
        text: void 0,
        checked: void 0,
        indeterminate: void 0,
        onChange: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLInputElement> {
        return (
            <label className={this.generateClassNames()}>
                <input
                    {...this.unhandledProps()}
                    className={get(this.props, "managedClasses.checkbox_input")}
                    type="checkbox"
                    onChange={this.props.onChange}
                    ref={this.setRef("items")}
                />
                <span className={get(this.props, "managedClasses.checkbox_label")}>
                    {this.props.text}
                </span>
            </label>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.checkbox);
    }
}

export default Checkbox;
export * from "./checkbox.props";
export {ICheckboxClassNameContract};
