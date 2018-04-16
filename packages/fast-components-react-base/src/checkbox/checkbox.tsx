import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { CheckboxProps, ICheckboxHandledProps, ICheckboxManagedClasses, ICheckboxUnhandledProps } from "./checkbox.props";
import { ICheckboxClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import { get } from "lodash-es";

/* tslint:disable-next-line */
class Checkbox extends Foundation<ICheckboxHandledProps & ICheckboxManagedClasses, ICheckboxUnhandledProps, {}> {
    protected handledProps: HandledProps<ICheckboxHandledProps & IManagedClasses<ICheckboxClassNameContract>> = {
        managedClasses: void 0,
        text: void 0,
        checked: void 0,
        indeterminate: void 0,
        onChange: void 0,
        disabled: void 0
    };

    private inputRef: React.RefObject<HTMLInputElement>;
        constructor(props: CheckboxProps) {
            super(props);

            this.inputRef = React.createRef();
        }

    /**
     * Apply indeterminate state to items that are indeterminate.
     * This method should be called after render because it relies on element references.
     */
    public applyIndeterminateState(): any {
         if (this.props.indeterminate !== undefined && this.inputRef.current) {
            this.inputRef.current.indeterminate = this.props.indeterminate;
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
                    ref={this.inputRef}
                    onChange={this.props.onChange}
                    checked={this.props.checked}
                    disabled={this.props.disabled}
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
        let classes: string = get(this.props, "managedClasses.checkbox");

        classes = this.props.disabled ? `${classes} ${get(this.props, "managedClasses.checkbox_disabled")}` : classes;

        return super.generateClassNames(classes);
    }
}

export default Checkbox;
export * from "./checkbox.props";
export {ICheckboxClassNameContract};
