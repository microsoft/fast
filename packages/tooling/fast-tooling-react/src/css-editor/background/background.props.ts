import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSBackgroundClassNameContract } from "./background.style";

export interface CSSBackgroundValues {
    background?: string;
}

export interface CSSBackgroundUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSBackgroundHandledProps
    extends ManagedClasses<CSSBackgroundClassNameContract> {
    /**
     * The data
     */
    data?: CSSBackgroundValues;

    /**
     * The onChange callback
     */
    onChange?: (background: CSSBackgroundValues) => void;
}

export type CSSBackgroundProps = CSSBackgroundHandledProps & CSSBackgroundUnhandledProps;
