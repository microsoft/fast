import React from "react";
export declare type componentDataOnChange = (
    e: React.ChangeEvent<HTMLFormElement>
) => void;
export interface WebComponentTestPageState {
    data: any;
    navigation: any;
    width: number;
    height: number;
}
export interface GroupItem {
    items: any;
    type: string;
}
declare class WebComponentTestPage extends React.Component<
    {},
    WebComponentTestPageState
> {
    constructor(props: {});
    render(): JSX.Element;
    private generateSchemaDictionary;
    private coerceFormProps;
    private handleViewerUpdateHeight;
    private handleViewerUpdateWidth;
    private handleMessageSystem;
    private handleComponentUpdate;
    private getComponentOptions;
}
export { WebComponentTestPage };
