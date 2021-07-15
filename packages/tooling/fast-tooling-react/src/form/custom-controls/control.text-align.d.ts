import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { TextAlignControlClassNameContract } from "./control.text-align.style";
import { TextAlignControlProps } from "./control.text-align.props";
/**
 * Custom form control definition
 */
declare class TextAlignControl extends React.Component<
    TextAlignControlProps & ManagedClasses<TextAlignControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        TextAlignControlProps & ManagedClasses<TextAlignControlClassNameContract>
    >;
    render(): React.ReactNode;
    private onChange;
    private isChecked;
    private getInputClassName;
    private getDirectionLabel;
    private renderInput;
}
export { TextAlignControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, TextAlignControlClassNameContract, {}>,
    any
>;
export default _default;
