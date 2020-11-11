import { FormStrings } from "../form.props";

export interface ConstValueProps {
    /**
     * The class name
     */
    className: string;

    /**
     * The onChange callback to set
     * the value to the const
     */
    onChange: () => void;

    /**
     * The disabled state
     */
    disabled: boolean;

    /**
     * Localized strings
     */
    strings: FormStrings;
}
