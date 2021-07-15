import React from "react";
import { FormAttributeSettingsMappingToPropertyNames } from "../../src/form/types";
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
    dataLocation: string;
    defaultBrowserErrors?: boolean;
    inlineErrors?: boolean;
}
export interface GroupItem {
    items: any;
    type: string;
}
declare class FormAndNavigationTestPage extends React.Component<{}, FormTestPageState> {
    /**
     * These are the children that can be added
     */
    private childOptions;
    constructor(props: {});
    render(): JSX.Element;
    private renderNavigation;
    private generateSchemaDictionary;
    /**
     * Gets the child options for the schema form
     */
    private getChildOptions;
    private coerceFormProps;
    private handleShowInlineErrors;
    private handleShowBrowserErrors;
    private handleMessageSystem;
    private handleComponentUpdate;
    private getComponentOptions;
}
export { FormAndNavigationTestPage };
