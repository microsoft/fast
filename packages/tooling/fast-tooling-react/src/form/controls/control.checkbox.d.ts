import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { CheckboxControlClassNameContract } from "./control.checkbox.style";
import { CheckboxControlProps } from "./control.checkbox.props";
/**
 * Form control definition
 * @extends React.Component
 */
declare class CheckboxControl extends React.Component<
    CheckboxControlProps & ManagedClasses<CheckboxControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        CheckboxControlProps & ManagedClasses<CheckboxControlClassNameContract>
    >;
    render(): JSX.Element;
    private handleChange;
}
export { CheckboxControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, CheckboxControlClassNameContract, {}>,
    any
>;
export default _default;
