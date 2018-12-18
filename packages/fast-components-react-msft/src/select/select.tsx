import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    SelectHandledProps,
    SelectManagedClasses,
    SelectProps,
    SelectUnhandledProps,
} from "./select.props";
import { Select as BaseSelect, SelectState } from "@microsoft/fast-components-react-base";
import { Button, ButtonAppearance } from "../button";
import { selectDisplayButtonOverrides } from "@microsoft/fast-components-styles-msft";

class Select extends Foundation<SelectHandledProps, SelectUnhandledProps, {}> {
    public static displayName: string = "Select";

    protected handledProps: HandledProps<SelectHandledProps> = {
        disabled: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <BaseSelect
                {...this.unhandledProps()}
                managedClasses={this.props.managedClasses}
                disabled={this.props.disabled}
                trigger={this.renderTrigger}
            >
                {this.props.children}
            </BaseSelect>
        );
    }

    /**
     * The function that renders a styled content display
     */
    public renderTrigger = (props: SelectProps, state: SelectState): React.ReactNode => {
        if (props.multiselectable) {
            return null;
        }
        return (
            <Button
                jssStyleSheet={selectDisplayButtonOverrides}
                disabled={props.disabled}
                aria-labelledby={props.labelledBy || null}
                aria-haspopup={true}
                aria-expanded={state.isMenuOpen}
                appearance={ButtonAppearance.outline}
                afterContent={this.generateGlyph}
            >
                {state.displayString}
            </Button>
        );
    };

    /**
     * Gets the dropdown glyph
     * TODO: scomea - replace with ref to a glyph resource (https://github.com/Microsoft/fast-dna/issues/1488)
     */
    private generateGlyph = (): React.ReactNode => {
        return (
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className={get(this.props, "managedClasses.select_toggleGlyph", "")}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M11.3613 2.73633L11.8887 3.26367L6 9.15234L0.111328 3.26367L0.638672 2.73633L6 8.09766L11.3613 2.73633Z" />
            </svg>
        );
    };
}

export default Select;
export * from "./select.props";
