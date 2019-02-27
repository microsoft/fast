import * as React from "react";
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
            >
                {state.displayString}
                <span
                    className={get(this.props, "managedClasses.select_toggleGlyph", "")}
                />
            </Button>
        );
    };
}

export default Select;
export * from "./select.props";
