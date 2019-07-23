import { ProgressClassNameContract as BaseProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the progress component
 */
export interface ProgressClassNameContract extends BaseProgressClassNameContract {
    /**
     * The root of the circular progress component
     */
    progress_circular?: string;

    /**
     * The progress size control modifier
     */
    progress_circular__control: string;

    /**
     * The progress size container modifier
     */
    progress_circular__container: string;

    /**
     * The progress size page modifier
     */
    progress_circular__page: string;

    /**
     * The progress value indicator
     */
    progress_valueIndicator?: string;

    /**
     * The indeterminate progress value indicator
     */
    progress_valueIndicator__indeterminate?: string;

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
     * @Deprecated 3.4.0
     */
    progress_dot__3?: string;

    /**
     * @Deprecated 3.4.0
     */
    progress_dot__4?: string;

    /**
     * @Deprecated 3.4.0
     */
    progress_dot__5?: string;
}
