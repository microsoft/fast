import type { FASTElementExtension } from "../components/fast-definitions.js";

/**
 * A node in the observer-map path tree.
 *
 * - `true`  → observe this path and all descendants (unless overridden by children).
 * - `false` → do NOT observe this path or its descendants (unless overridden by children).
 * - `ObserverMapPathNode` → configure child paths individually;
 *       the node itself is observed if `$observe` is true (default when parent is observed).
 * @public
 */
export type ObserverMapPathEntry = boolean | ObserverMapPathNode;

/**
 * A node object in the observer-map path tree.
 *
 * `$observe` controls whether this node itself is observed.
 * When omitted the value is inherited from the nearest ancestor
 * that explicitly sets `$observe`. At the root level the default is `true`.
 *
 * Child property overrides are keyed by property name.
 * @public
 */
export interface ObserverMapPathNode {
    $observe?: boolean;
    [propertyName: string]: ObserverMapPathEntry | undefined;
}

/**
 * Configuration object for the {@link observerMap} extension.
 * When `properties` is omitted (i.e. `observerMap()`), behaves like `"all"` —
 * every root property is observed. When `properties` is present, only listed
 * root properties participate in observer-map observation.
 * @public
 */
export interface ObserverMapConfig {
    /**
     * Per-root-property observation control.
     * Keys are root property names discovered in the template schema.
     * Only root properties listed here participate in observer-map observation.
     * Omitting this field is equivalent to `"all"`.
     */
    properties?: {
        [rootProperty: string]: ObserverMapPathEntry;
    };
}

/**
 * Registry of pending observer-map configurations keyed by element name.
 * Consumed during `TemplateElement` connected callback.
 * @internal
 */
export const pendingObserverMaps: Map<string, ObserverMapConfig | undefined> =
    new Map();

/**
 * Creates a {@link @microsoft/fast-element#FASTElementExtension | FASTElementExtension}
 * that registers observer-map configuration for a custom element.
 * The configuration is stored in a pending registry and consumed by
 * `TemplateElement` during template parsing.
 *
 * @param config - Optional configuration for per-property observation control.
 * @returns A `FASTElementExtension` callback.
 *
 * @example
 * ```ts
 * // Observe all root properties (auto-detect from template)
 * MyElement.define({ name: "my-element", templateOptions: "defer-and-hydrate" }, [
 *     observerMap(),
 * ]);
 *
 * // Selective property observation
 * MyElement.define({ name: "my-element", templateOptions: "defer-and-hydrate" }, [
 *     observerMap({ properties: { user: true, settings: false } }),
 * ]);
 * ```
 * @public
 */
export function observerMap(config?: ObserverMapConfig): FASTElementExtension {
    return definition => {
        pendingObserverMaps.set(definition.name, config);
    };
}
