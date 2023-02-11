import { DOMAspect, DOMPolicy, DOMSink } from "./dom.js";
import { isString, Message, TrustedTypesPolicy } from "./interfaces.js";
import { FAST } from "./platform.js";

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
        sink: DOMSink
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

function safeURL(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
): DOMSink {
    return (target: Node, name: string, value: string, ...rest: any[]) => {
        if (isString(value)) {
            value = value.replace("javascript:", "");
        }

        sink(target, name, value, ...rest);
    };
}

function block(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
): DOMSink {
    throw FAST.error(Message.blockedByDOMPolicy, {
        aspectName,
        tagName: tagName ?? "text",
    });
}

const defaultDOMElementGuards = {
    a: {
        [DOMAspect.attribute]: {
            href: safeURL,
        },
        [DOMAspect.property]: {
            href: safeURL,
        },
    },
    area: {
        [DOMAspect.attribute]: {
            href: safeURL,
        },
        [DOMAspect.property]: {
            href: safeURL,
        },
    },
    button: {
        [DOMAspect.attribute]: {
            formaction: safeURL,
        },
        [DOMAspect.property]: {
            formAction: safeURL,
        },
    },
    embed: {
        [DOMAspect.attribute]: {
            src: block,
        },
        [DOMAspect.property]: {
            src: block,
        },
    },
    form: {
        [DOMAspect.attribute]: {
            action: safeURL,
        },
        [DOMAspect.property]: {
            action: safeURL,
        },
    },
    frame: {
        [DOMAspect.attribute]: {
            src: safeURL,
        },
        [DOMAspect.property]: {
            src: safeURL,
        },
    },
    iframe: {
        [DOMAspect.attribute]: {
            src: safeURL,
        },
        [DOMAspect.property]: {
            src: safeURL,
            srcdoc: block,
        },
    },
    input: {
        [DOMAspect.attribute]: {
            formaction: safeURL,
        },
        [DOMAspect.property]: {
            formAction: safeURL,
        },
    },
    link: {
        [DOMAspect.attribute]: {
            href: block,
        },
        [DOMAspect.property]: {
            href: block,
        },
    },
    object: {
        [DOMAspect.attribute]: {
            codebase: block,
            data: block,
        },
        [DOMAspect.property]: {
            codeBase: block,
            data: block,
        },
    },
    script: {
        [DOMAspect.attribute]: {
            src: block,
            text: block,
        },
        [DOMAspect.property]: {
            src: block,
            text: block,
            innerText: block,
            textContent: block,
        },
    },
    style: {
        [DOMAspect.property]: {
            innerText: block,
            textContent: block,
        },
    },
};

const blockedEvents = {
    onabort: block,
    onauxclick: block,
    onbeforeinput: block,
    onbeforematch: block,
    onblur: block,
    oncancel: block,
    oncanplay: block,
    oncanplaythrough: block,
    onchange: block,
    onclick: block,
    onclose: block,
    oncontextlost: block,
    oncontextmenu: block,
    oncontextrestored: block,
    oncopy: block,
    oncuechange: block,
    oncut: block,
    ondblclick: block,
    ondrag: block,
    ondragend: block,
    ondragenter: block,
    ondragleave: block,
    ondragover: block,
    ondragstart: block,
    ondrop: block,
    ondurationchange: block,
    onemptied: block,
    onended: block,
    onerror: block,
    onfocus: block,
    onformdata: block,
    oninput: block,
    oninvalid: block,
    onkeydown: block,
    onkeypress: block,
    onkeyup: block,
    onload: block,
    onloadeddata: block,
    onloadedmetadata: block,
    onloadstart: block,
    onmousedown: block,
    onmouseenter: block,
    onmouseleave: block,
    onmousemove: block,
    onmouseout: block,
    onmouseover: block,
    onmouseup: block,
    onpaste: block,
    onpause: block,
    onplay: block,
    onplaying: block,
    onprogress: block,
    onratechange: block,
    onreset: block,
    onresize: block,
    onscroll: block,
    onsecuritypolicyviolation: block,
    onseeked: block,
    onseeking: block,
    onselect: block,
    onslotchange: block,
    onstalled: block,
    onsubmit: block,
    onsuspend: block,
    ontimeupdate: block,
    ontoggle: block,
    onvolumechange: block,
    onwaiting: block,
    onwebkitanimationend: block,
    onwebkitanimationiteration: block,
    onwebkitanimationstart: block,
    onwebkittransitionend: block,
    onwheel: block,
};

const defaultDOMGuards = {
    elements: defaultDOMElementGuards,
    aspects: {
        [DOMAspect.attribute]: {
            ...blockedEvents,
        },
        [DOMAspect.property]: {
            innerHTML: block,
            ...blockedEvents,
        },
        [DOMAspect.event]: {
            ...blockedEvents,
        },
    },
};

function createDomSinkGuards(
    config: Partial<DOMSinkGuards>,
    defaults: DOMSinkGuards
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
    defaults: DOMAspectGuards
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
    defaults: DOMElementGuards
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
                result[tag] = createDOMAspectGuards(overrideValue, {});
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

function tryGuard(
    aspectGuards: DOMAspectGuards,
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
) {
    const sinkGuards = aspectGuards[aspect];

    if (sinkGuards) {
        const guard = sinkGuards[aspectName];
        if (guard) {
            return guard(tagName, aspect, aspectName, sink);
        }
    }
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
const DOMPolicy = Object.freeze({
    /**
     * Creates a new DOM Policy object.
     * @param options The options to use in creating the policy.
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
                sink: DOMSink
            ): DOMSink {
                // Check for element-specific guards.
                const key = (tagName ?? "").toLowerCase();
                const elementGuards = guards.elements[key];
                if (elementGuards) {
                    const guard = tryGuard(
                        elementGuards,
                        tagName,
                        aspect,
                        aspectName,
                        sink
                    );

                    if (guard) {
                        return guard;
                    }
                }

                // Check for guards applicable to all nodes.
                return (
                    tryGuard(guards.aspects, tagName, aspect, aspectName, sink) ?? sink
                );
            },
        });
    },
});

export { DOMPolicy };
