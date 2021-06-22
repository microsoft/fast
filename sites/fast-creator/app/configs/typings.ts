import { Data } from "@microsoft/fast-tooling";

interface WebComponentDefinition {
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
     * The unique ID for the component library
     */
    id: string;

    /**
     * The dictionary of components in this component library
     */
    componentDictionary: { [key: string]: WebComponentDefinition };
}

export interface WebComponentLibraryDefinition extends NativeElementLibraryDefinition {
    /**
     * The unique ID for the component library
     */
    id: string;

    /**
     * The display name for the component library
     */
    displayName: string;

    /**
     * The script location
     */
    import: string;
}

export type ElementDefinition =
    | NativeElementLibraryDefinition
    | WebComponentLibraryDefinition;
