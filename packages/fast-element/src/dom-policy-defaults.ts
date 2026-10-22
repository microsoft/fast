import type { DOMSink } from "./dom.js";
import { DOMAspect } from "./dom-aspect.js";
import type { DOMAspectGuards, DOMGuards } from "./dom-policy.js";
import { isString, Message } from "./interfaces.js";
import { FAST } from "./platform.js";

const surroundingWhitespaceAndControlChars =
    /^[\u0000-\u0020\u007F]+|[\u0000-\u0020\u007F]+$/g;

const whitespaceAndControlChars = /[\u0000-\u0020\u007F]+/g;

const unsafeURLProtocol = /^(?:javascript|vbscript|data):/;

function trimURL(value: string): string {
    return value.replace(surroundingWhitespaceAndControlChars, "");
}

function decodeURL(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function hasUnsafeURLProtocol(value: string): boolean {
    let normalized = trimURL(value);

    for (let i = 0; i < 3; ++i) {
        const decoded = decodeURL(normalized);

        if (decoded === normalized) {
            break;
        }

        normalized = trimURL(decoded);
    }

    normalized = normalized.replace(whitespaceAndControlChars, "").toLowerCase();

    return unsafeURLProtocol.test(normalized);
}

function sanitizeURL(value: string): string {
    const trimmed = trimURL(value);
    return hasUnsafeURLProtocol(trimmed) ? "" : trimmed;
}

function safeURL(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink,
): DOMSink {
    return (target: Node, name: string, value: string, ...rest: any[]) => {
        if (isString(value)) {
            value = sanitizeURL(value);
        }

        sink(target, name, value, ...rest);
    };
}

function block(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink,
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
            srcdoc: block,
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

export const defaultDOMGuards: DOMGuards = {
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

function tryGuard(
    aspectGuards: DOMAspectGuards,
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink,
) {
    const sinkGuards = aspectGuards[aspect];

    if (sinkGuards) {
        const guard = sinkGuards[aspectName];
        if (guard) {
            return guard(tagName, aspect, aspectName, sink);
        }
    }
}

export function protectDOMSink(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink,
    guards: DOMGuards = defaultDOMGuards,
): DOMSink {
    // Check for element-specific guards.
    const key = (tagName ?? "").toLowerCase();
    const elementGuards = guards.elements[key];
    if (elementGuards) {
        const guard = tryGuard(elementGuards, tagName, aspect, aspectName, sink);

        if (guard) {
            return guard;
        }
    }

    // Check for guards applicable to all nodes.
    return tryGuard(guards.aspects, tagName, aspect, aspectName, sink) ?? sink;
}
