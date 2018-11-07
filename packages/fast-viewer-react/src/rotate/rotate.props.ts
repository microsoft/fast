import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { RotateClassNameContract } from "./rotate.class-name-contract";

export enum Orientation {
    landscape = "landscape",
    portrait = "portrait",
}

export interface RotateManagedClasses extends ManagedClasses<RotateClassNameContract> {}
export interface RotateUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
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

export type RotateProps = RotateUnhandledProps & RotateHandledProps;
