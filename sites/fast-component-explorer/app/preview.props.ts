import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { DataDictionary, SchemaDictionary } from "@microsoft/fast-tooling";
import { PreviewClassNameContract } from "./preview.style";

export type PreviewUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface PreviewHandledProps {
    managedClasses: PreviewClassNameContract;
}

export type PreviewProps = PreviewHandledProps & PreviewUnhandledProps;

export interface PreviewState {
    dataDictionary: DataDictionary<unknown> | void;
    schemaDictionary: SchemaDictionary;
    theme: StandardLuminance;
}
