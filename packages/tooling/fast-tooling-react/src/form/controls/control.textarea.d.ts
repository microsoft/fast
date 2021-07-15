import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { TextareaControlProps } from "./control.textarea.props";
import { TextareaControlClassNameContract } from "./control.textarea.style";
export interface TextareaControlState {
    isFocused: boolean;
}
/**
 * Form control definition
 */
declare class TextareaControl extends React.Component<
    TextareaControlProps & ManagedClasses<TextareaControlClassNameContract>,
    TextareaControlState
> {
    static displayName: string;
    static defaultProps: Partial<
        TextareaControlProps & ManagedClasses<TextareaControlClassNameContract>
    >;
    constructor(
        props: TextareaControlProps & ManagedClasses<TextareaControlClassNameContract>
    );
    render(): React.ReactNode;
    private getRows;
    private getValue;
    private handleFocus;
    private handleBlur;
    private handleChange;
}
export { TextareaControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, TextareaControlClassNameContract, {}>,
    any
>;
export default _default;
