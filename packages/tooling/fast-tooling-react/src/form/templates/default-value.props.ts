import { FormStrings } from "../form.props";

export interface DefaultValueProps {
    /**
     * The class name
     */
    className: string;

    /**
     * The onChange callback to set
     * the value to the default
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
