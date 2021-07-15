import { FormAttributeSettingsMappingToPropertyNames } from "../../src/form/types";
import React from "react";
import { DataDictionary } from "@microsoft/fast-tooling";
export declare type componentDataOnChange = (
    e: React.ChangeEvent<HTMLFormElement>
) => void;
export interface FormTestPageState {
    schema: any;
    data: any;
    dataDictionary: DataDictionary<unknown>;
    navigation: any;
    attributeAssignment?: FormAttributeSettingsMappingToPropertyNames;
    showExtendedControls: boolean;
    defaultBrowserErrors?: boolean;
    inlineErrors?: boolean;
    dataSet?: any;
    cssPropertyOverrides: boolean;
}
export interface GroupItem {
    items: any;
    type: string;
}
export interface DataSet {
    displayName: string;
    data: any;
}
declare class FormTestPage extends React.Component<{}, FormTestPageState> {
    /**
     * These are the children that can be added
     */
    private childOptions;
    /**
     * The custom control plugins used in the form
     */
    private controlPlugins;
    constructor(props: {});
    render(): JSX.Element;
    private renderDataSetComponentOptions;
    private generateSchemaDictionary;
    /**
     * Gets the child options for the schema form
     */
    private getChildOptions;
    private getComponentDataSets;
    private coerceFormProps;
    private handleMessageSystem;
    private handleCSSOverrideUpdate;
    private handleDataSetUpdate;
    private handleShowInlineErrors;
    private handleShowBrowserErrors;
    private handleComponentUpdate;
    private getComponentOptions;
}
export { FormTestPage };
