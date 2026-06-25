import type { Constructable } from "./interfaces.js";
import { emptyArray } from "./platform.js";

// Tiny polyfill for TypeScript's Reflect metadata API.
const metadataByTarget = new Map<any, Map<any, any>>();

if (!("metadata" in Reflect)) {
    (Reflect as any).metadata = function (key: any, value: any) {
        return function (target: any) {
            (Reflect as any).defineMetadata(key, value, target);
        };
    };

    (Reflect as any).defineMetadata = function (key: any, value: any, target: any) {
        let metadata = metadataByTarget.get(target);

        if (metadata === void 0) {
            metadataByTarget.set(target, (metadata = new Map()));
        }

        metadata.set(key, value);
    };

    (Reflect as any).getOwnMetadata = function (key: any, target: any): any {
        const metadata = metadataByTarget.get(target);

        if (metadata !== void 0) {
            return metadata.get(key);
        }

        return void 0;
    };
}

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
        ((Reflect as any).getOwnMetadata(designParamTypesKey, Type) ??
            emptyArray) as readonly any[],

    /**
     * Gets the "annotation:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or a frozen empty array if no metadata is found.
     */
    getAnnotationParamTypes: (Type: Constructable) =>
        ((Reflect as any).getOwnMetadata(annotationParamTypesKey, Type) ??
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
            (Reflect as any).defineMetadata(annotationParamTypesKey, (types = []), Type);
        }

        return types;
    },
});
