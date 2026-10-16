/**
 * Core registration strategy; hydration replaces it only when enabled.
 * @internal
 */
export const ElementRegistration = {
    define(
        name: string,
        type: CustomElementConstructor,
        options: ElementDefinitionOptions,
        registry: CustomElementRegistry,
        wasDefined: boolean,
    ): void {
        registry.define(name, type, options);
    },
};
