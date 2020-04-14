import { ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import { ToggleHandledProps, ToggleProps, ToggleUnhandledProps } from "./toggle.props";

/**
 * Toggle state interface
 */
export interface ToggleState {
    selected: boolean;
}

/**
 * Toggle base component
 */
class Toggle extends Foundation<ToggleHandledProps, ToggleUnhandledProps, ToggleState> {
    public static displayName: string = `${DisplayNamePrefix}Toggle`;

    public static defaultProps: Partial<ToggleProps> = {
        managedClasses: {},
    };

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(
        nextProps: ToggleProps,
        prevState: ToggleState
    ): null | Partial<ToggleState> {
        if (
            typeof nextProps.selected === "boolean" &&
            nextProps.selected !== prevState.selected
        ) {
            return {
                selected: nextProps.selected,
            };
        }

        return null;
    }

    protected handledProps: HandledProps<ToggleHandledProps> = {
        managedClasses: void 0,
        disabled: void 0,
        inputId: void 0,
        labelId: void 0,
        name: void 0,
        selected: void 0,
        selectedMessage: void 0,
        statusMessageId: void 0,
        unselectedMessage: void 0,
        onChange: void 0,
    };

    /**
     * Define constructor
     */
    constructor(props: ToggleProps) {
        super(props);

        this.state = {
            selected: this.props.selected || false,
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        const {
            toggle_toggleButton,
            toggle_input,
            toggle_stateIndicator,
        }: ToggleClassNameContract = this.props.managedClasses;

        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                aria-disabled={this.props.disabled || null}
            >
                {this.generateLabel()}
                <div className={classNames(toggle_toggleButton)}>
                    <input
                        className={classNames(toggle_input)}
                        type="checkbox"
                        id={this.props.inputId}
                        aria-describedby={this.props.statusMessageId}
                        disabled={this.props.disabled}
                        name={this.props.name}
                        value={this.generateToggleStateLabel()}
                        onChange={this.handleToggleChange}
                        checked={this.state.selected}
                    />
                    <span className={classNames(toggle_stateIndicator)} />
                </div>
                {this.renderStatusMessage()}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            toggle,
            toggle__disabled,
            toggle__checked,
        }: ToggleClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                toggle,
                [toggle__disabled, this.props.disabled],
                [toggle__checked, this.state.selected]
            )
        );
    }

    /**
     * Creates proper string based on state
     */
    private generateToggleStateLabel(): string {
        return this.state.selected
            ? this.props.selectedMessage
            : this.props.unselectedMessage;
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (typeof this.props.selected !== "boolean") {
            this.setState({ selected: !this.state.selected });
        }

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    };

    /**
     * Generates label if it exists
     */
    private generateLabel(): React.ReactElement<HTMLElement> {
        if (this.props.labelId || this.props.children) {
            return (
                <label
                    className={classNames(this.props.managedClasses.toggle_label)}
                    id={this.props.labelId}
                    htmlFor={this.props.inputId}
                >
                    {this.props.children}
                </label>
            );
        }
    }

    private renderStatusMessage(): React.ReactNode {
        if (this.props.selectedMessage || this.props.unselectedMessage) {
            return (
                <span
                    id={this.props.statusMessageId}
                    className={classNames(this.props.managedClasses.toggle_statusMessage)}
                >
                    {this.generateToggleStateLabel()}
                </span>
            );
        }
    }
}

export default Toggle;
export * from "./toggle.props";
export { ToggleClassNameContract };
