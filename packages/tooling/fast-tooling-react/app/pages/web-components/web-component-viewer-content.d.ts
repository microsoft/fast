import React from "react";
import { DataDictionary, SchemaDictionary } from "@microsoft/fast-tooling";
interface WebComponentViewerContentState {
    message: string;
    dataDictionary: DataDictionary<unknown>;
    schemaDictionary: SchemaDictionary;
    activeDictionaryId: string;
}
declare class WebComponentViewerContent extends React.Component<
    {},
    WebComponentViewerContentState
> {
    private ref;
    constructor(props: {});
    render(): React.ReactNode;
    private handlePostMessage;
}
export default WebComponentViewerContent;
