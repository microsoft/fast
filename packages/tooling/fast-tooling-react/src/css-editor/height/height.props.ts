import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSHeightClassNameContract } from "./height.style";

export interface CSSHeightValues {
    height?: string;
}

export type CSSHeightUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface CSSHeightHandledProps
    extends ManagedClasses<CSSHeightClassNameContract> {
    /**
     * The data
     */
    data?: CSSHeightValues;

    /**
     * The onChange callback
     */
    onChange?: (height: CSSHeightValues) => void;
}

export type CSSHeightProps = CSSHeightHandledProps & CSSHeightUnhandledProps;
