import { ManagedClasses } from "@microsoft/fast-jss-manager";
import { CSSEditorClassNameContract } from "./editor.style";
import { Subtract } from "utility-types";
import { CSSPositionHandledProps, CSSSpacingHandledProps } from "./";
import { CSSSpacingClassNameContract } from "./spacing/spacing.style";
import { CSSPositionClassNameContract } from "./position/position.style";

export type CSSOnChange = (CSS: any) => void;

export interface CSSEditorUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSEditorHandledProps
    extends Subtract<
            CSSPositionHandledProps,
            ManagedClasses<CSSPositionClassNameContract>
        >,
        Subtract<CSSSpacingHandledProps, ManagedClasses<CSSSpacingClassNameContract>>,
        ManagedClasses<CSSEditorClassNameContract> {
    /**
     * The onChange event for updating the data
     */
    onChange?: CSSOnChange;
}

export type CSSEditorProps = CSSEditorHandledProps & CSSEditorUnhandledProps;
