import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { PreviewClassNameContract } from "./preview.style";

export type PreviewUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface PreviewHandledProps {
    managedClasses: PreviewClassNameContract;
}

export type PreviewProps = PreviewHandledProps & PreviewUnhandledProps;

export type PreviewState = DesignSystem;
