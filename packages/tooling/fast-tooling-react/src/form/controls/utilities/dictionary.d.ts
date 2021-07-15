import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { DictionaryClassNameContract } from "./dictionary.style";
import { DictionaryProps, DictionaryState } from "./dictionary.props";
/**
 *  control definition
 */
declare class Dictionary extends React.Component<
    DictionaryProps & ManagedClasses<DictionaryClassNameContract>,
    DictionaryState
> {
    static displayName: string;
    private rootElementRef;
    constructor(props: DictionaryProps);
    render(): React.ReactNode;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private updateValidity;
    private renderControl;
    private renderItemControl;
    private renderControls;
    private handleOnAddItem;
    private handleOnRemoveItem;
    private handleKeyPress;
    private handleKeyChange;
    private handleKeyFocus;
    private handleKeyBlur;
    private getSchemaLocation;
    private getDataLocation;
    private getData;
    private isRequired;
}
export { Dictionary };
declare const _default: React.ComponentClass<
    ManagedJSSProps<DictionaryProps, DictionaryClassNameContract, {}>,
    any
>;
export default _default;
