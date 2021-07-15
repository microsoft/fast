import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { AlignControlClassNameContract } from "./control.align.style";
import { AlignControlProps } from "./control.align.props";
/**
 * Custom form control definition
 */
declare class AlignControl extends React.Component<
    AlignControlProps & ManagedClasses<AlignControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        AlignControlProps & ManagedClasses<AlignControlClassNameContract>
    >;
    render(): React.ReactNode;
    private isChecked;
    private handleChange;
    private renderInput;
}
export { AlignControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, AlignControlClassNameContract, {}>,
    any
>;
export default _default;
