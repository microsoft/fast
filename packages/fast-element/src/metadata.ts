import "reflect-metadata/lite";
import type { Constructable } from "./interfaces.js";
import { emptyArray } from "./platform.js";

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
        (Reflect.getOwnMetadata(designParamTypesKey, Type) ??
            emptyArray) as readonly any[],

    /**
     * Gets the "annotation:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or a frozen empty array if no metadata is found.
     */
    getAnnotationParamTypes: (Type: Constructable) =>
        (Reflect.getOwnMetadata(annotationParamTypesKey, Type) ??
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
            Reflect.defineMetadata(annotationParamTypesKey, (types = []), Type);
        }

        return types;
    },
});
