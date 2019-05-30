import { TextFieldClassNameContract as BaseTextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the text field component
 */
export interface TextFieldClassNameContract extends BaseTextFieldClassNameContract {
    /**
     * The filled appearance modifier
     */
    textField__filled?: string;

    /**
     * The outline appearance modifier
     */
    textField__outline?: string;
}
