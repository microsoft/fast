import type { Constructable } from "./interfaces.js";

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

function getParamTypes(key: string): (Type) => readonly any[] | undefined {
    return Type => {
        return (Reflect as any).getOwnMetadata(key, Type);
    };
}

export const Metadata = Object.freeze({
    /**
     * Gets the "design:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getDesignParamtypes: getParamTypes("design:paramtypes"),

    /**
     * Gets the "di:paramtypes" metadata for the specified type.
     * @param Type - The type to get the metadata for.
     * @returns The metadata array or undefined if no metadata is found.
     */
    getAnnotationParamtypes: getParamTypes("di:paramtypes"),

    /**
     *
     * @param Type - Gets the "di:paramtypes" metadata for the specified type. If none is found,
     * an empty metadata array is created and added.
     * @returns The metadata array.
     */
    getOrCreateAnnotationParamTypes(Type: Constructable): any[] {
        let annotationParamtypes = this.getAnnotationParamtypes(Type);

        if (annotationParamtypes === void 0) {
            (Reflect as any).defineMetadata(
                "di:paramtypes",
                (annotationParamtypes = []),
                Type
            );
        }

        return annotationParamtypes;
    },
});
