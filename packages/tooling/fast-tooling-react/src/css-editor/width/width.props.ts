import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSWidthClassNameContract } from "./width.style";

export interface CSSWidthValues {
    width?: string;
}

export interface CSSWidthUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSWidthHandledProps extends ManagedClasses<CSSWidthClassNameContract> {
    /**
     * The data
     */
    data?: CSSWidthValues;

    /**
     * The onChange callback
     */
    onChange?: (width: CSSWidthValues) => void;
}

export type CSSWidthProps = CSSWidthHandledProps & CSSWidthUnhandledProps;
