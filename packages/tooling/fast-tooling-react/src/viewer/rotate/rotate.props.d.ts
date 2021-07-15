/// <reference types="react" />
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { RotateClassNameContract } from "./rotate.class-name-contract";
export declare enum Orientation {
    landscape = "landscape",
    portrait = "portrait",
}
export declare type RotateManagedClasses = ManagedClasses<RotateClassNameContract>;
export declare type RotateUnhandledProps = React.AllHTMLAttributes<HTMLElement>;
export interface RotateHandledProps extends RotateManagedClasses {
    /**
     * A callback used when the orientation has been updated
     */
    onUpdateOrientation: (orientation: Orientation) => void;
    /**
     * The orientation
     */
    orientation: Orientation;
    /**
     * Landscape orientation input disabled
     */
    landscapeDisabled?: boolean;
    /**
     * Portrait orientation input disabled
     */
    portraitDisabled?: boolean;
    /**
     * The label for the landscape input
     */
    landscapeLabel?: string;
    /**
     * The label for the portrait input
     */
    portraitLabel?: string;
}
export declare type RotateProps = RotateUnhandledProps & RotateHandledProps;
