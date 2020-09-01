import { DataDictionary, SchemaDictionary } from "@microsoft/fast-tooling";
import { Direction } from "@microsoft/fast-web-utilities";
import { PreviewClassNameContract } from "./preview.style";

export type PreviewUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface PreviewHandledProps {
    managedClasses: PreviewClassNameContract;
}

export type PreviewProps = PreviewHandledProps & PreviewUnhandledProps;

export enum StandardLuminance {
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
