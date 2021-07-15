import React from "react";
import { DataType } from "@microsoft/fast-tooling";
export interface NavigationTestPageState {
    navigation: any;
    cssPropertyOverrides: boolean;
    types?: DataType[];
    activeDictionaryId: string;
}
declare class NavigationTestPage extends React.Component<{}, NavigationTestPageState> {
    constructor(props: {});
    render(): React.ReactNode;
    private renderAllLinkedData;
    private renderLinkedDataItems;
    private handleLinkedDataNavigationOnChange;
    private handleIncludeType;
    private handleMessageSystem;
    private handleCSSOverrideUpdate;
}
export { NavigationTestPage };
