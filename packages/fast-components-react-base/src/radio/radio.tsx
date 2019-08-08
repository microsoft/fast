import { RadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import { RadioHandledProps, RadioProps, RadioUnhandledProps } from "./radio.props";

/**
 * Radio slot options
 */
export enum RadioSlot {
    label = "label",
}

interface RadioState {
    checked: boolean;
}

class Radio extends Foundation<RadioHandledProps, RadioUnhandledProps, RadioState> {
    public static displayName: string = `${DisplayNamePrefix}Radio`;
    public static defaultProps: Partial<RadioHandledProps> = {
        managedClasses: {},
    };

    public static getDerivedStateFromProps(
        nextProps: RadioProps,
        prevState: RadioState
    ): null | Partial<RadioState> {
        if (
            typeof nextProps.checked === "boolean" &&
            nextProps.checked !== prevState.checked
        ) {
            return {
                checked: nextProps.checked,
            };
        }

        return null;
    }

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<RadioHandledProps> = {
        inputId: void 0,
        checked: void 0,
        disabled: void 0,
        managedClasses: void 0,
        name: void 0,
        onChange: void 0,
        children: void 0,
        value: void 0,
    };

    constructor(props: RadioProps) {
        super(props);

        this.state = {
            checked: this.props.checked || false,
        };
    }

    public render(): React.ReactElement<HTMLElement> {
        const {
            radio_input,
            radio_stateIndicator,
        }: RadioClassNameContract = this.props.managedClasses;

        return (
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                <input
                    className={classNames(radio_input)}
                    type="radio"
                    id={this.props.inputId}
                    name={this.props.name}
                    onChange={this.handleRadioChange}
                    disabled={this.props.disabled || null}
                    checked={this.state.checked}
                    value={this.props.value}
                />
                <span className={classNames(radio_stateIndicator)} />
                {this.renderChildrenWithSlot(RadioSlot.label)}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            radio,
            radio__disabled,
            radio__checked,
        }: RadioClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                radio,
                [radio__disabled, this.props.disabled],
                [radio__checked, this.state.checked]
            )
        );
    }

    private renderChildrenWithSlot(slot: RadioSlot): React.ReactChild[] {
        const node: React.ReactNode = this.withSlot(RadioSlot.label);

        return React.Children.map(node, (child: JSX.Element, index: number) => {
            return React.cloneElement(child, {
                className: classNames(
                    child.props.className,
                    this.props.managedClasses.radio_label
                ),
            });
        });
    }

    private handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (typeof this.props.checked !== "boolean") {
            this.setState({ checked: !this.state.checked });
        }

        if (typeof this.props.onChange === "function") {
            this.props.onChange(e);
        }
    };
}

export default Radio;
export * from "./radio.props";
export { RadioClassNameContract };
