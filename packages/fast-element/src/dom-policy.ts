import type { DOMSink } from "./dom.js";
import { DOMAspect } from "./dom-aspect.js";
import { getDefaultAspectGuard, getDefaultElementGuard } from "./dom-policy-defaults.js";
import type { TrustedTypesPolicy } from "./interfaces.js";

/**
 * A policy that controls whether values can be written to DOM sinks.
 * @public
 */
export interface DOMPolicy {
    /**
     * Creates safe HTML from the provided value.
     * @param value - The source to convert to safe HTML.
     */
    createHTML(value: string): string;

    /**
     * Protects a DOM sink that intends to write to the DOM.
     * @param tagName - The tag name for the element to write to.
     * @param aspect - The aspect of the DOM to write to.
     * @param aspectName - The name of the aspect to write to.
     * @param sink - The sink that is used to write to the DOM.
     */
    protect(
        tagName: string | null,
        aspect: DOMAspect,
        aspectName: string,
        sink: DOMSink,
    ): DOMSink;
}

/**
 * A specific DOM sink guard for a node aspect.
 * @public
 */
export type DOMSinkGuards = Record<
    string,
    (
        tagName: string | null,
        aspect: DOMAspect,
        aspectName: string,
        sink: DOMSink,
    ) => DOMSink
>;

/**
 * Aspect-specific guards for a DOM Policy.
 * @public
 */
export type DOMAspectGuards = {
    /**
     * Guards for attributes.
     */
    [DOMAspect.attribute]?: DOMSinkGuards;
    /**
     * Guards for boolean attributes.
     */
    [DOMAspect.booleanAttribute]?: DOMSinkGuards;
    /**
     * Guards for properties.
     */
    [DOMAspect.property]?: DOMSinkGuards;
    /**
     * Guards for content.
     */
    [DOMAspect.content]?: DOMSinkGuards;
    /**
     * Guards for token list manipulation.
     */
    [DOMAspect.tokenList]?: DOMSinkGuards;
    /**
     * Guards for events.
     */
    [DOMAspect.event]?: DOMSinkGuards;
};

/**
 * Element-specific guards for a DOM Policy.
 * @public
 */
export type DOMElementGuards = Record<string, DOMAspectGuards>;

/**
 * Guard configuration for a DOM Policy.
 * @public
 */
export type DOMGuards = {
    /**
     * Guards for specific elements.
     */
    elements: DOMElementGuards;

    /**
     * General aspect guards independent of the element type.
     */
    aspects: DOMAspectGuards;
};

function snapshotGuards<T extends object>(config: T, depth: number): Readonly<T>;
function snapshotGuards(config: object, depth: number): object {
    const result = {};

    for (const key in config) {
        const value = config[key];
        result[key] = depth && value ? snapshotGuards(value, depth - 1) : value;
    }

    return Object.freeze(result);
}

function createDOMGuards(config: Partial<DOMGuards>): DOMGuards {
    return Object.freeze({
        elements: snapshotGuards(config.elements ?? {}, 2),
        aspects: snapshotGuards(config.aspects ?? {}, 1),
    });
}

function getGuard(
    config: DOMAspectGuards | undefined,
    aspect: DOMAspect,
    aspectName: string,
    defaultGuard: DOMSinkGuards[string] | undefined,
): DOMSinkGuards[string] | undefined {
    if (config === null) {
        return;
    }
    const aspectGuards = config?.[aspect];
    if (aspectGuards === null) {
        // A removed aspect retains the lookup behavior of an empty guard map.
        return {}[aspectName];
    }
    const guard = aspectGuards?.[aspectName];
    return guard === null ? undefined : (guard ?? defaultGuard);
}

function createTrustedType() {
    const createHTML = html => html;
    return globalThis.trustedTypes
        ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML })
        : { createHTML };
}

/**
 * Options for creating a DOM Policy.
 * @public
 */
export type DOMPolicyOptions = {
    /**
     * The trusted type to use for HTML creation.
     */
    trustedType?: TrustedTypesPolicy;

    /**
     * The DOM guards used to override or extend the defaults.
     */
    guards?: Partial<DOMGuards>;
};

/**
 * A helper for creating DOM policies.
 * @public
 */
export const DOMPolicy = Object.freeze({
    /**
     * Creates a new DOM Policy object.
     * @param options - The options to use in creating the policy.
     * @returns The newly created DOMPolicy.
     */
    create(options: DOMPolicyOptions = {}): Readonly<DOMPolicy> {
        const trustedType = options.trustedType ?? createTrustedType();
        const guards = createDOMGuards(options.guards ?? {});

        return Object.freeze({
            createHTML(value: string): string {
                return trustedType.createHTML(value);
            },

            protect(
                tagName: string | null,
                aspect: DOMAspect,
                aspectName: string,
                sink: DOMSink,
            ): DOMSink {
                const key = (tagName ?? "").toLowerCase();
                const elementGuard = getGuard(
                    guards.elements[key],
                    aspect,
                    aspectName,
                    getDefaultElementGuard(key, aspect, aspectName),
                );
                const guardedSink = elementGuard?.(tagName, aspect, aspectName, sink);
                if (guardedSink) {
                    return guardedSink;
                }
                const aspectGuard = getGuard(
                    guards.aspects,
                    aspect,
                    aspectName,
                    getDefaultAspectGuard(aspect, aspectName),
                );
                return aspectGuard?.(tagName, aspect, aspectName, sink) ?? sink;
            },
        });
    },
});
