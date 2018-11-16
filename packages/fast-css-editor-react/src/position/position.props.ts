import { ManagedClasses } from "@microsoft/fast-jss-manager";
import { CSSPositionClassNameContract } from "./position.style";

export enum PositionValue {
    static = "static",
    absolute = "absolute",
}

export enum Location {
    top = "top",
    left = "left",
    right = "right",
    bottom = "bottom",
}

export interface LocationsMappedToClassNames {
    location: Location;
    className: string;
}

export interface CSSPositionUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSPositionHandledProps
    extends ManagedClasses<CSSPositionClassNameContract> {
    position?: PositionValue;
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    onChange?: (positionValues: any) => void;
}

export type CSSPositionProps = CSSPositionHandledProps & CSSPositionUnhandledProps;
