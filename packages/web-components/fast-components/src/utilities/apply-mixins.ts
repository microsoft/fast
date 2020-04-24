/**
 * Apply mixins to a constructor.
 *
 * Shamelessly stolen from https://www.typescriptlang.org/docs/handbook/mixins.html
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
    });
}
