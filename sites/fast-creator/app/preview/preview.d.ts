import React from "react";
import { DataDictionary, MessageSystem, SchemaDictionary } from "@microsoft/fast-tooling";
import { DisplayMode } from "../utilities";
export declare const previewReady: string;
export interface PreviewState {
    activeDictionaryId: string;
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    designSystemDataDictionary: DataDictionary<unknown> | void;
    htmlRenderMessageSystem: MessageSystem;
    htmlRenderReady: boolean;
    displayMode: DisplayMode;
}
declare const _default: React.ComponentType<{}>;
export default _default;
