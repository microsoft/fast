import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { NumberFieldControlClassNameContract } from "./control.number-field.style";
import { NumberFieldControlProps } from "./control.number-field.props";
/**
 * Form control definition
 */
declare class NumberFieldControl extends React.Component<
    NumberFieldControlProps & ManagedClasses<NumberFieldControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        NumberFieldControlProps & ManagedClasses<NumberFieldControlClassNameContract>
    >;
    private hasFocus;
    /**
     * Renders the component
     */
    render(): React.ReactNode;
    private handleFocus;
    private handleBlur;
    private handleChange;
    private getValue;
}
export { NumberFieldControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, NumberFieldControlClassNameContract, {}>,
    any
>;
export default _default;
