import { Data } from "@microsoft/fast-tooling";

export interface WebComponentDefinition {
    /**
     * The display name for the component
     */
    displayName: string;

    /**
     * The JSON schema for the component
     */
    schema: { [key: string]: unknown };

    /**
     * An example to use when a component is newly added
     */
    example: Data<unknown>;
}

export interface NativeElementLibraryDefinition {
    /**
     * This makes the library optional which will affect the UI.
     */
    optional: boolean;

    /**
     * The unique ID for the component library
     */
    id: string;

    /**
     * The dictionary of components in this component library
     */
    componentDictionary: { [key: string]: WebComponentDefinition };

    /**
     * The display name for the component library
     */
    displayName: string;
}

export interface WebComponentLibraryDefinition extends NativeElementLibraryDefinition {
    /**
     * The script location
     */
    import: () => void;

    /**
     * Register web components within this function
     */
    register: () => void;
}

export type ElementLibraryDefinition =
    | NativeElementLibraryDefinition
    | WebComponentLibraryDefinition;
