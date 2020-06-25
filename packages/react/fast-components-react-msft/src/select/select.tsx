import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Select as BaseSelect, SelectState } from "@microsoft/fast-components-react-base";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { neutralLayerFloating } from "@microsoft/fast-components-styles-msft";
import { isNil } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";
import { Background } from "../background";
import { SelectHandledProps, SelectProps, SelectUnhandledProps } from "./select.props";

class Select extends Foundation<SelectHandledProps, SelectUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Select`;
    public static defaultProps: SelectProps = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<SelectHandledProps> = {
        disabled: void 0,
        managedClasses: void 0,
        menu: void 0,
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
                menu={
                    typeof this.props.menu === "function"
                        ? this.props.menu
                        : this.defaultMenuRenderFunction
                }
                trigger={
                    typeof this.props.trigger === "function"
                        ? this.props.trigger
                        : this.defaultTriggerRenderFunction
                }
            >
                {this.props.children}
            </BaseSelect>
        );
    }

    /**
     * The function that renders the default styled trigger
     */
    private defaultTriggerRenderFunction = (
        props: SelectProps,
        state: SelectState,
        triggerId?: string
    ): React.ReactNode => {
        if (props.multiselectable) {
            return null;
        }

        const {
            select_button,
            select_buttonContentRegion,
            select_buttonDisplayText,
        }: SelectClassNameContract = this.props.managedClasses;

        const labelledBy: string = `${
            isNil(this.props.labelledBy) ? "" : `${this.props.labelledBy} `
        }${triggerId}`;

        return (
            <button
                id={triggerId}
                disabled={props.disabled}
                className={classNames(select_button)}
                aria-haspopup="listbox"
                aria-labelledby={labelledBy}
                aria-expanded={state.isMenuOpen}
            >
                <span className={classNames(select_buttonContentRegion)}>
                    <div className={classNames(select_buttonDisplayText)}>
                        {state.displayString}
                    </div>
                    {this.generateGlyph()}
                </span>
            </button>
        );
    };

    private defaultMenuRenderFunction = (
        props: SelectProps,
        state: SelectState,
        defaultMenu: React.ReactNode
    ): React.ReactNode => {
        return (
            <Background value={neutralLayerFloating} tag={null}>
                {defaultMenu}
            </Background>
        );
    };

    /**
     * Gets the dropdown glyph
     * TODO: scomea - replace with ref to a glyph resource (https://github.com/Microsoft/fast/issues/1488)
     */
    private generateGlyph = (): React.ReactNode => {
        return (
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 12"
                className={classNames(this.props.managedClasses.select_toggleGlyph)}
                aria-hidden={true}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M11.3613 2.73633L11.8887 3.26367L6 9.15234L0.111328 3.26367L0.638672 2.73633L6 8.09766L11.3613 2.73633Z" />
            </svg>
        );
    };
}

export default Select;
export * from "./select.props";
