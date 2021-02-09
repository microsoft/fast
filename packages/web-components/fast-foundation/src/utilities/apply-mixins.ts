/**
 * Apply mixins to a constructor.
 * Sourced from {@link https://www.typescriptlang.org/docs/handbook/mixins.html | TypeScript Documentation }.
 * @public
 */
export function applyMixins(derivedCtor: any, ...baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!
            );
        });

        if (baseCtor.attributes) {
            const existing = derivedCtor.attributes || [];
            derivedCtor.attributes = existing.concat(baseCtor.attributes);
        }
    });
}
