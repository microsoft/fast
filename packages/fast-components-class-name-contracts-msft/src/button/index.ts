import {
    IButtonClassNameContract as IBaseButtonClassNameContract
} from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the button component
 */
export interface IButtonClassNameContract extends IBaseButtonClassNameContract {
    /**
     * The primary appearance modifier
     */
    button__primary?: string;

    /**
     * The outline appearance modifier
     */
    button__outline?: string;

    /**
     * The lightweight appearance modifier
     */
    button__lightweight?: string;

    /**
     * The justified appearance modifier
     */
    button__justified?: string;

    /**
     * The button content region
     */
    button_contentRegion?: string;

    /**
     * The disabled modifier
     */
    button__disabled?: string;
}
