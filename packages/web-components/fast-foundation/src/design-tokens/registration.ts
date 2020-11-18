import { DI, InterfaceSymbol } from "../di";

export interface DesignTokenDefinition<V = string, K = string> {
    /**
     * The key for which the token can be accessed.
     */
    readonly key: K;

    /**
     * The CSS custom property name
     */
    readonly customProperty?: string;

    /**
     * The default value.
     */
    readonly value?: V;
}

export interface DesignTokenRegistry {
    /**
     * Register a Design Token definition
     * @param definition - The definition to register
     */
    register<T>(definition: DesignTokenDefinition<T>);

    /**
     * Gets the CSS custom property name of a Design Token, or undefined if the Token is
     * not associated to CSS custom property.
     * @param key - The Design Token key to get the CSS custom property name of
     */
    customProperty(key: string): string | undefined;

    /**
     * Gets the value a property key was registered with, or otherwise undefined.
     * @param key - THe key for which to get the value of
     */
    value(key: string): string | undefined;

    /**
     * Determines if a Design Token has been registered
     * @param key - The key for which to check if a Design Token has been registered
     */
    isRegistered(key: string): boolean;

    /**
     * Returns a {@link DesignTokenDefinition} for a key, or undefined if one does not exist.
     * @param key - The key for which to get a {@link DesignTokenDefinition }
     */
    getRegistree<T = any>(key: string): DesignTokenDefinition<T> | undefined;
}

export class DesignTokenRegistryImpl implements DesignTokenRegistry {
    #definitions = new Map<string, DesignTokenDefinition<any>>();

    /** @inheritdoc DesignTokenRegistry.register */
    public register<T>(definition: DesignTokenDefinition<T>) {
        this.#definitions.set(definition.key, definition);
    }

    /** @inheritdoc DesignTokenRegistry.customProperty */
    public customProperty(key: string): string | undefined {
        return this.getRegistree(key)?.customProperty || undefined;
    }

    /** @inheritdoc DesignTokenRegistry.value */
    public value(key: string): string | undefined {
        return this.getRegistree(key)?.value || undefined;
    }

    /** @inheritdoc DesignTokenRegistry.has */
    public isRegistered(key: string): boolean {
        return this.#definitions.has(key);
    }

    /** @inheritdoc DesignTokenRegistry.get */
    public getRegistree<T = any>(key: string): DesignTokenDefinition<T> | undefined {
        return this.#definitions.get(key);
    }
}

export const DIDesignTokenRegistry = DI.createInterface<DesignTokenRegistry>(
    "DesignTokenRegistration"
).noDefault();
