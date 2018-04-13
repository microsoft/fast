import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { ICheckboxHandledProps, ICheckboxManagedClasses, ICheckboxUnhandledProps } from "./checkbox.props";
import { ICheckboxClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import { get } from "lodash-es";

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
     * Apply indeterminate state to items that are indeterminate.
     * This method should be called after render because it relies on element references.
     */
    public applyIndeterminateState(): any {
        const ref: React.ReactNode = this.getRef("input");

        if (this.props.indeterminate && ref) {
            (ref as HTMLInputElement).indeterminate = this.props.indeterminate;
        }
    }

    /**
     * Called the when a component is mounted
     */
    public componentDidMount(): void {
        this.applyIndeterminateState();
    }

    /**
     * Called the when a component is updated
     */
    public componentDidUpdate(): void {
        this.applyIndeterminateState();
    }

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
                    ref={this.setRef("input")}
                    onChange={this.props.onChange}
                    checked={this.props.checked}
                />
                <span className={get(this.props, "managedClasses.checkbox_label")}>
                    {this.props.text ? this.props.text : null}
                </span>
            </label>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.checkbox"));
    }
}

export default Checkbox;
export * from "./checkbox.props";
export {ICheckboxClassNameContract};
