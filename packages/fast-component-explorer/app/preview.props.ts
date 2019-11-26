import { PreviewClassNameContract } from "./preview.style";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

export interface PreviewUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface PreviewHandledProps {
    managedClasses: PreviewClassNameContract;
}

export type PreviewProps = PreviewHandledProps & PreviewUnhandledProps;

/* tslint:disable-next-line */
export interface PreviewState extends DesignSystem {}
