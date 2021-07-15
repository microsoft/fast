import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ButtonControlClassNameContract } from "./control.button.style";
import { ButtonControlProps } from "./control.button.props";
/**
 * Form control definition
 * @extends React.Component
 */
declare class ButtonControl extends React.Component<
    ButtonControlProps & ManagedClasses<ButtonControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        ButtonControlProps & ManagedClasses<ButtonControlClassNameContract>
    >;
    render(): React.ReactNode;
    private handleButtonClick;
    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    private handleInputChange;
}
export { ButtonControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, ButtonControlClassNameContract, {}>,
    any
>;
export default _default;
