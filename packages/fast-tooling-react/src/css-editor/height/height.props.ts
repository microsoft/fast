import { ManagedClasses } from "@microsoft/fast-jss-manager";
import { CSSHeightClassNameContract } from "./height.style";

export interface CSSHeightValues {
    height?: string;
}

export interface CSSHeightUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

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
