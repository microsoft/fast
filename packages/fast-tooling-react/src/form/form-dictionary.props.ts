import { ControlTemplateUtilitiesProps, StandardControlPlugin } from "./templates";
import { FormChildOptionItem } from "./form.props";
import { Controls } from "./form-section.props";
import { Omit } from "utility-types";
import ajv from "ajv";

export interface FormDictionaryProps
    extends Omit<ControlTemplateUtilitiesProps, "invalidMessage"> {
    /**
     * The possible child options
     */
    childOptions: FormChildOptionItem[];

    /**
     * Control plugins
     */
    controls: Controls;

    /**
     * The custom control plugins which will be used
     * instead of the default control plugins
     */
    controlPlugins?: StandardControlPlugin[];

    /**
     * A string identifying a custom form control
     * as identified in the JSON schema by the `formControlId`
     * property
     */
    formControlId?: string;

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

    /**
     * The validation errors
     */
    validationErrors: ajv.ErrorObject[] | void;
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
