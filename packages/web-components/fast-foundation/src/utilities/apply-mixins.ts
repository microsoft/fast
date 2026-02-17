import { AttributeConfiguration } from "@microsoft/fast-element";

/**
 * Apply mixins to a constructor.
 * Sourced from {@link https://www.typescriptlang.org/docs/handbook/mixins.html | TypeScript Documentation }.
 * @internal
 */
export function applyMixins(derivedCtor: any, ...baseCtors: any[]) {
    const derivedAttributes = AttributeConfiguration.locate(derivedCtor);

    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== "constructor") {
                Object.defineProperty(
                    derivedCtor.prototype,
                    name,
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!
                );
            }
        });

        const baseAttributes = AttributeConfiguration.locate(baseCtor);
        baseAttributes.forEach(x => derivedAttributes.push(x));
    });
}
