import type { Constructable } from "./interfaces.js";
import { initializeMetadataReflection } from "./metadata-reflection.js";
import { emptyArray } from "./platform.js";

const reflection = initializeMetadataReflection();
const annotationParamTypesKey = "annotation:paramtypes";
const designParamTypesKey = "design:paramtypes";

/**
 * Provides basic metadata capabilities used by Context and Dependency Injection.
 * @public
 */
export const Metadata = Object.freeze({
    /**
     * Gets the "design:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or a frozen empty array if no metadata is found.
     */
    getDesignParamTypes: (Type: Constructable) =>
        (reflection.getOwnMetadata(designParamTypesKey, Type) ??
            emptyArray) as readonly any[],

    /**
     * Gets the "annotation:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or a frozen empty array if no metadata is found.
     */
    getAnnotationParamTypes: (Type: Constructable) =>
        (reflection.getOwnMetadata(annotationParamTypesKey, Type) ??
            emptyArray) as readonly any[],

    /**
     * Gets the "annotation:paramtypes" metadata for the specified type. If none is found,
     * an empty, mutable metadata array is created and added.
     * @param Type - The type to get or create the metadata for.
     * @returns A mutable metadata array.
     */
    getOrCreateAnnotationParamTypes(Type: Constructable): any[] {
        let types = this.getAnnotationParamTypes(Type);

        if (types === emptyArray) {
            reflection.defineMetadata(annotationParamTypesKey, (types = []), Type);
        }

        return types;
    },
});
