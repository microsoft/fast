import type { DOMSink } from "./dom.js";
import { DOMAspect } from "./dom-aspect.js";
import type { DOMSinkGuards } from "./dom-policy.js";
import { Message } from "./interfaces.js";
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
    return (target: Node, name: string, value: unknown, ...rest: any[]) => {
        if (value !== null && value !== undefined) {
            value = sanitizeURL(`${value}`);
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

const sharedElementGuards: DOMSinkGuards = {
    "a.href": safeURL,
    "area.href": safeURL,
    "embed.src": block,
    "form.action": safeURL,
    "frame.src": safeURL,
    "iframe.src": safeURL,
    "iframe.srcdoc": block,
    "link.href": block,
    "object.data": block,
    "script.src": block,
    "script.text": block,
};

const attributeElementGuards: DOMSinkGuards = {
    "button.formaction": safeURL,
    "input.formaction": safeURL,
    "object.codebase": block,
};

const propertyElementGuards: DOMSinkGuards = {
    "button.formAction": safeURL,
    "input.formAction": safeURL,
    "object.codeBase": block,
    "script.innerText": block,
    "script.textContent": block,
    "style.innerText": block,
    "style.textContent": block,
};

export function getDefaultElementGuard(
    tagName: string,
    aspect: DOMAspect,
    aspectName: string,
): DOMSinkGuards[string] | undefined {
    const guards =
        aspect === DOMAspect.attribute
            ? attributeElementGuards
            : aspect === DOMAspect.property
              ? propertyElementGuards
              : undefined;
    if (guards) {
        const key = `${tagName}.${aspectName}`;
        return guards[key] ?? sharedElementGuards[key];
    }
}

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

export function getDefaultAspectGuard(
    aspect: DOMAspect,
    aspectName: string,
): DOMSinkGuards[string] | undefined {
    if (aspect === DOMAspect.property && aspectName === "innerHTML") {
        return block;
    }
    if (
        aspect === DOMAspect.attribute ||
        aspect === DOMAspect.property ||
        aspect === DOMAspect.event
    ) {
        return blockedEvents[aspectName];
    }
}

export function protectDOMSink(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink,
): DOMSink {
    const guard =
        getDefaultElementGuard((tagName ?? "").toLowerCase(), aspect, aspectName) ??
        getDefaultAspectGuard(aspect, aspectName);
    return guard ? guard(tagName, aspect, aspectName, sink) : sink;
}
