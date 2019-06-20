import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the button component
 */
export interface ButtonBaseClassNameContract extends ButtonClassNameContract {
    /**
     * The button content region
     */
    button_contentRegion?: string;

    /**
     * The before content
     */
    button_beforeContent?: string;

    /**
     * The after content
     */
    button_afterContent?: string;

    /**
     * Class name used when button has either beforeContent or afterContent and children
     */
    button__hasBeforeOrAfterAndChildren?: string;
}
