import type { FASTElementExtension } from "../components/fast-definitions.js";

/**
 * Configuration object for the {@link attributeMap} extension.
 * Passing no config (`attributeMap()`) is equivalent to `"all"`.
 * @public
 */
export interface AttributeMapConfig {
    /**
     * Strategy for mapping template binding keys to HTML attribute names.
     *
     * - `"none"` (default): the binding key is used as-is for both the
     *   property name and the attribute name (e.g. `{{foo-bar}}` →
     *   property `foo-bar`, attribute `foo-bar`).
     * - `"camelCase"`: the binding key is treated as a camelCase property
     *   name and the attribute name is derived by converting it to
     *   kebab-case (e.g. `{{fooBar}}` → property `fooBar`, attribute
     *   `foo-bar`). This matches the build-time `attribute-name-strategy`
     *   option in `@microsoft/fast-build`.
     */
    attributeNameStrategy?: "none" | "camelCase";
}

/**
 * Registry of pending attribute-map configurations keyed by element name.
 * Consumed during `TemplateElement` connected callback.
 * @internal
 */
export const pendingAttributeMaps: Map<string, AttributeMapConfig | undefined> =
    new Map();

/**
 * Creates a {@link @microsoft/fast-element#FASTElementExtension | FASTElementExtension}
 * that registers attribute-map configuration for a custom element.
 * The configuration is stored in a pending registry and consumed by
 * `TemplateElement` during template parsing.
 *
 * @param config - Optional configuration for attribute mapping strategy.
 * @returns A `FASTElementExtension` callback.
 *
 * @example
 * ```ts
 * // Map all leaf properties as attributes (default strategy)
 * MyElement.define({ name: "my-element", templateOptions: "defer-and-hydrate" }, [
 *     attributeMap(),
 * ]);
 *
 * // Use camelCase naming strategy
 * MyElement.define({ name: "my-element", templateOptions: "defer-and-hydrate" }, [
 *     attributeMap({ attributeNameStrategy: "camelCase" }),
 * ]);
 * ```
 * @public
 */
export function attributeMap(config?: AttributeMapConfig): FASTElementExtension {
    return definition => {
        pendingAttributeMaps.set(definition.name, config);
    };
}
