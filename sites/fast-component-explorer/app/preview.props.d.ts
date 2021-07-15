/// <reference types="react" />
import { DataDictionary, SchemaDictionary } from "@microsoft/fast-tooling";
import { Direction } from "@microsoft/fast-web-utilities";
export declare type PreviewUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
export declare type PreviewProps = PreviewUnhandledProps;
export declare enum StandardLuminance {
    LightMode = 1,
    DarkMode = 0.1,
}
export interface PreviewState {
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    transparentBackground: boolean;
    direction: Direction;
    theme: StandardLuminance;
}
