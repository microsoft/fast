import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, {HandledProps} from "../foundation";

import { IToggleHandledProps, IToggleManagedClasses, IToggleUnhandledProps } from "./toggle.props";
import {IToggleClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

/**
 * Toggle state interface
 */
export interface IToggleState {
    checked: boolean;
}

/**
 * Toggle base component
 */
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
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.selected
        };
    }

    
    /**
     * Creates proper string based on state
     */
    private generateToggleStateLabel() {
        return this.state.checked ? this.props.selectedString : this.props.unselectedString;
    }

    /**
     * Passes toggle onClick to consumer
     */
    private handleClickEvent = (e) => {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleToggleChange = (e) => {
        this.setState({checked: !this.state.checked})
    }

    private generateLabel() {
        if (this.props.labelId) {
            return(
                <label
                    className={this.props.managedClasses.toggle_label}
                    id={this.props.labelId}
                    htmlFor={this.props.id}
                >
                    {this.props.children}
                </label>
            );
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.toggle);
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                aria-disabled={ this.props.disabled || null }
            >
                {this.generateLabel()}
                <div className={this.props.managedClasses.toggle_wrapper}>
                    <input
                        className={this.props.managedClasses.toggle_input}
                        type='checkbox'
                        id={this.props.id}
                        defaultChecked={this.state.checked}
                        aria-describedby={this.props.statusLabelId}
                        disabled={this.props.disabled}
                        onClick={this.handleClickEvent}
                        value={this.generateToggleStateLabel()}
                        onChange={this.handleToggleChange}
                    />
                    <span className={this.props.managedClasses.toggle_button} />
                </div>
                <span 
                    id={this.props.statusLabelId}
                >
                    {this.generateToggleStateLabel()}
                </span>
            </div>
        );
    }
}

export default Toggle;
export * from "./toggle.props";
export { IToggleClassNameContract };
