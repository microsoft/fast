import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { SelectControlProps } from "./control.select.props";
import { SelectControlClassNameContract } from "./control.select.style";
/**
 * Form control definition
 */
declare class SelectControl extends React.Component<
    SelectControlProps & ManagedClasses<SelectControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        SelectControlProps & ManagedClasses<SelectControlClassNameContract>
    >;
    /**
     * Renders the component
     */
    render(): React.ReactNode;
    private handleChange;
    /**
     * Stringify the select value
     */
    private stringify;
    private getValue;
    /**
     * Renders the selects option elements
     */
    private renderOptions;
}
export { SelectControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, SelectControlClassNameContract, {}>,
    any
>;
export default _default;
