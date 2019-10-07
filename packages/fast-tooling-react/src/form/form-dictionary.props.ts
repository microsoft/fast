import { ControlTemplateUtilitiesProps } from "./templates";
import { FormChildOptionItem } from "./form.props";
import { Controls } from "./form-section.props";

export interface FormDictionaryProps extends ControlTemplateUtilitiesProps {
    /**
     * The possible child options
     */
    childOptions: FormChildOptionItem[];

    /**
     * Control plugins
     */
    controls: Controls;

    /**
     * A list of enumerated properties that should be excluded from
     * the dictionary
     */
    enumeratedProperties: string[];

    /**
     * An array of example data
     */
    examples: any[];

    /**
     * A label for the dictionary property key
     */
    propertyLabel: string;

    /**
     * The additional properties in JSON schema
     */
    additionalProperties: any;
}

export interface FormDictionaryState {
    /**
     * The current property key being edited
     */
    focusedPropertyKey: string | null;

    /**
     * The current property key value
     */
    focusedPropertyKeyValue: string | null;
}
