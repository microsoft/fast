import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { IToggleHandledProps, IToggleManagedClasses, IToggleUnhandledProps } from "./toggle.props";
import { IManagedClasses, IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts";

/**
 * Toggle state interface
 */
export interface IToggleState {
    checked: boolean;
}

/**
 * Toggle base component
 */
/* tslint:disable-next-line */
class Toggle extends Foundation<IToggleHandledProps & IManagedClasses<IToggleClassNameContract>,  React.HTMLAttributes<HTMLDivElement>, IToggleState> {
    protected handledProps: HandledProps<IToggleHandledProps & IManagedClasses<IToggleClassNameContract>> = {
        managedClasses: void 0,
        disabled: void 0,
        id: void 0,
        labelId: void 0,
        selected: void 0,
        selectedString: void 0,
        statusLabelId: void 0,
        unselectedString: void 0
    };

    /**
     * Define constructor
     */
    constructor(props: IToggleHandledProps & IManagedClasses<IToggleClassNameContract>) {
        super(props);

        this.state = {
            checked: this.props.selected
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                aria-disabled={this.props.disabled || null}
            >
                {this.generateLabel()}
                <div className={get(this.props, "managedClasses.toggle_wrapper")}>
                    <input
                        className={get(this.props, "managedClasses.toggle_input")}
                        type="checkbox"
                        id={this.props.id}
                        defaultChecked={this.state.checked}
                        aria-describedby={this.props.statusLabelId}
                        disabled={this.props.disabled}
                        value={this.generateToggleStateLabel()}
                        onChange={this.handleToggleChange}
                    />
                    <span className={get(this.props, "managedClasses.toggle_button")} />
                </div>
                <span
                    id={this.props.statusLabelId}
                >
                    {this.generateToggleStateLabel()}
                </span>
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.toggle"));
    }

    /**
     * Creates proper string based on state
     */
    private generateToggleStateLabel(): string {
        return this.state.checked ? this.props.selectedString : this.props.unselectedString;
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleToggleChange = (): void => {
        this.setState({checked: !this.state.checked});
    }

    /**
     * Generates label if it exists
     */
    private generateLabel(): React.ReactElement<HTMLElement> {
        if (this.props.labelId) {
            return(
                <label
                    className={get(this.props, "managedClasses.toggle_label")}
                    id={this.props.labelId}
                    htmlFor={this.props.id}
                >
                    {this.props.children}
                </label>
            );
        }
    }
}

export default Toggle;
export * from "./toggle.props";
export { IToggleClassNameContract };
