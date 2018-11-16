import { ManagedClasses } from "@microsoft/fast-jss-manager";
import { CSSEditorClassNameContract } from "./editor.style";
import { Subtract } from "utility-types";
import { CSSPositionHandledProps } from "./";
import { CSSPositionClassNameContract } from "./position/position.style";

export interface CSSEditorUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSEditorHandledProps
    extends Subtract<
            CSSPositionHandledProps,
            ManagedClasses<CSSPositionClassNameContract>
        >,
        ManagedClasses<CSSEditorClassNameContract> {}

export type CSSEditorProps = CSSEditorHandledProps & CSSEditorUnhandledProps;
