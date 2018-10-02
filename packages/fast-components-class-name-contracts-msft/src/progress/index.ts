import {
    IProgressClassNameContract as IBaseProgressClassNameContract
} from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the progress component
 */
export interface IProgressClassNameContract extends IBaseProgressClassNameContract {
    /**
     * The progress value indicator
     */
    progress_valueIndicator?: string;

    /**
     * The indeterminate progress indicator
     */
    progress_indicator?: string;

    /**
     * The determinate progress value indicator
     */
    progress_indicator__determinate?: string;

    /**
     * The indeterminate progress indicator
     */
    progress_dot?: string;

    /**
     * The indeterminate progress indicator 1 modifier
     */
    progress_dot__1?: string;

    /**
     * The indeterminate progress indicator 2 modifier
     */
    progress_dot__2?: string;

    /**
     * The indeterminate progress indicator 3 modifier
     */
    progress_dot__3?: string;

    /**
     * The indeterminate progress indicator 4 modifier
     */
    progress_dot__4?: string;

    /**
     * The indeterminate progress indicator 5 modifier
     */
    progress_dot__5?: string;

    /**
     * The keyframes for the dots animation
     */
    "@keyframes dots"?: string;
}
