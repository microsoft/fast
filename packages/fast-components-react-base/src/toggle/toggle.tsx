import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ToggleHandledProps, ToggleManagedClasses, ToggleProps, ToggleUnhandledProps } from "./toggle.props";
import { ManagedClasses, ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Toggle state interface
 */
export interface ToggleState {
    selected: boolean;
}

/**
 * Toggle base component
 */
class Toggle extends Foundation<
    ToggleHandledProps,
    ToggleUnhandledProps,
    ToggleState
> {
    public static displayName: string = "Toggle";

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(nextProps: ToggleProps, prevState: ToggleState): null | Partial<ToggleState> {
        if (typeof nextProps.selected === "boolean" && nextProps.selected !== prevState.selected) {
            return {
                selected: nextProps.selected
            };
        }

        return null;
    }

    protected handledProps: HandledProps<ToggleHandledProps> = {
        managedClasses: void 0,
        disabled: void 0,
        id: void 0,
        labelId: void 0,
        selected: void 0,
        selectedMessage: void 0,
        statusMessageId: void 0,
        unselectedMessage: void 0,
        onChange: void 0
    };

    /**
     * Define constructor
     */
    constructor(props: ToggleProps) {
        super(props);

        this.state = {
            selected: this.props.selected || false
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                aria-disabled={this.props.disabled || null}
            >
                {this.generateLabel()}
                <div className={get(this.props, "managedClasses.toggle_toggleButton")}>
                    <input
                        className={get(this.props, "managedClasses.toggle_input")}
                        type="checkbox"
                        id={this.props.id}
                        aria-describedby={this.props.statusMessageId}
                        disabled={this.props.disabled}
                        value={this.generateToggleStateLabel()}
                        onChange={this.handleToggleChange}
                        checked={this.state.selected}
                    />
                    <span className={get(this.props, "managedClasses.toggle_stateIndicator")} />
                </div>
                <span
                    id={this.props.statusMessageId}
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
        return this.state.selected ? this.props.selectedMessage : this.props.unselectedMessage;
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (typeof this.props.selected !== "boolean") {
            this.setState({selected: !this.state.selected});
        }

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    /**
     * Generates label if it exists
     */
    private generateLabel(): React.ReactElement<HTMLElement> {
        if (this.props.labelId || this.props.children) {
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
export { ToggleClassNameContract };
