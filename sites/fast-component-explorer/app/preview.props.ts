import { DataDictionary, SchemaDictionary } from "@microsoft/fast-tooling";
import { PreviewClassNameContract } from "./preview.style";
import { Direction } from "@microsoft/fast-web-utilities";

export type PreviewUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface PreviewHandledProps {
    managedClasses: PreviewClassNameContract;
}

export type PreviewProps = PreviewHandledProps & PreviewUnhandledProps;

export interface PreviewState {
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    transparentBackground: boolean;
    direction: Direction;
}
