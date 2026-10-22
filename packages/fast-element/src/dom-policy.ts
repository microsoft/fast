import type { DOMSink } from "./dom.js";
import { DOMAspect } from "./dom-aspect.js";
import { defaultDOMGuards, protectDOMSink } from "./dom-policy-defaults.js";
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

function createDomSinkGuards(
    config: Partial<DOMSinkGuards>,
    defaults: DOMSinkGuards,
): DOMSinkGuards {
    const result = {};

    for (const name in defaults) {
        const overrideValue = config[name];
        const defaultValue = defaults[name];

        switch (overrideValue) {
            case null:
                // remove the default
                break;
            case undefined:
                // keep the default
                result[name] = defaultValue;
                break;
            default:
                // override the default
                result[name] = overrideValue;
                break;
        }
    }

    // add any new sinks that were not overrides
    for (const name in config) {
        if (!(name in result)) {
            result[name] = config[name];
        }
    }

    return Object.freeze(result);
}

function createDOMAspectGuards(
    config: DOMAspectGuards,
    defaults: DOMAspectGuards,
): DOMAspectGuards {
    const result = {};

    for (const aspect in defaults) {
        const overrideValue = config[aspect];
        const defaultValue = defaults[aspect];

        switch (overrideValue) {
            case null:
                // remove the default
                break;
            case undefined:
                // keep the default
                result[aspect] = createDomSinkGuards(defaultValue, {});
                break;
            default:
                // override the default
                result[aspect] = createDomSinkGuards(overrideValue, defaultValue);
                break;
        }
    }

    // add any new aspect guards that were not overrides
    for (const aspect in config) {
        if (!(aspect in result)) {
            result[aspect] = createDomSinkGuards(config[aspect], {});
        }
    }

    return Object.freeze(result);
}

function createElementGuards(
    config: DOMElementGuards,
    defaults: DOMElementGuards,
): DOMElementGuards {
    const result = {};

    for (const tag in defaults) {
        const overrideValue = config[tag];
        const defaultValue = defaults[tag];

        switch (overrideValue) {
            case null:
                // remove the default
                break;
            case undefined:
                // keep the default
                result[tag] = createDOMAspectGuards(defaultValue, {});
                break;
            default:
                // override the default aspects
                result[tag] = createDOMAspectGuards(overrideValue, defaultValue);
                break;
        }
    }

    // Add any new element guards that were not overrides
    for (const tag in config) {
        if (!(tag in result)) {
            result[tag] = createDOMAspectGuards(config[tag], {});
        }
    }

    return Object.freeze(result);
}

function createDOMGuards(config: Partial<DOMGuards>, defaults: DOMGuards): DOMGuards {
    return Object.freeze({
        elements: config.elements
            ? createElementGuards(config.elements, defaults.elements)
            : defaults.elements,
        aspects: config.aspects
            ? createDOMAspectGuards(config.aspects, defaults.aspects)
            : defaults.aspects,
    });
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
        const guards = createDOMGuards(options.guards ?? {}, defaultDOMGuards);

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
                return protectDOMSink(tagName, aspect, aspectName, sink, guards);
            },
        });
    },
});
