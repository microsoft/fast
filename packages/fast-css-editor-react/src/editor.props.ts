import { ManagedClasses } from "@microsoft/fast-jss-manager";
import { CSSEditorClassNameContract } from "./editor.style";
import { CSSPositionHandledProps } from "./";

export interface CSSEditorUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export type CSSEditorComponentsHandledProps = CSSPositionHandledProps &
    ManagedClasses<CSSEditorClassNameContract>;

export interface CSSEditorHandledProps extends CSSEditorComponentsHandledProps {}

export type CSSEditorProps = CSSEditorHandledProps & CSSEditorUnhandledProps;
