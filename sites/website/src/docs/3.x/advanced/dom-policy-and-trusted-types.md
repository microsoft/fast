---
id: dom-policy-and-trusted-types
title: DOMPolicy and Trusted Types
layout: 3x
eleventyNavigation:
  key: dom-policy-and-trusted-types3x
  parent: advanced3x
  title: DOMPolicy and Trusted Types
navigationOptions:
  activeKey: dom-policy-and-trusted-types3x
description: Configure DOMPolicy and Trusted Types for FAST Element templates and DOM bindings.
keywords:
  - DOMPolicy
  - Trusted Types
  - security
  - XSS
  - templates
---

# DOMPolicy and Trusted Types

FAST Element renders templates by compiling HTML strings and updating DOM sinks such as text content, attributes, properties, token lists, and event listeners. A `DOMPolicy` is the security boundary FAST uses for those operations.

Use a policy to:

- integrate FAST template compilation with the browser's [Trusted Types](https://developer.mozilla.org/docs/Web/API/Trusted_Types_API) enforcement;
- block, wrap, or sanitize sensitive binding sinks before FAST writes to them;
- document which application code is allowed to render raw HTML.

## Configure a policy at startup

`DOM.setPolicy()` installs the default policy used by FAST's templating system. It can only be called once, so configure it from an application entry module before custom elements are defined, templates are compiled, or templates are rendered.

```ts
import { DOM } from "@microsoft/fast-element/dom.js";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";

function sanitizeHTML(value: string): string {
    // Use your application's HTML sanitizer here.
    return value;
}

const trustedType = globalThis.trustedTypes?.createPolicy("app-fast-html", {
    createHTML: sanitizeHTML,
}) ?? { createHTML: sanitizeHTML };

DOM.setPolicy(DOMPolicy.create({ trustedType }));
```

If your Content Security Policy uses a `trusted-types` directive, the policy name you create must be allowed by that directive. If you rely on FAST's built-in Trusted Types policy, allow the `fast-element` policy name.

:::important
Application owners should configure the global policy. Reusable component libraries should not call `DOM.setPolicy()` because doing so would prevent the host application from installing its own policy.
:::

## Create policies with `DOMPolicy.create()`

`DOMPolicy.create()` creates an immutable policy with two responsibilities:

| Responsibility | What FAST uses it for |
|---|---|
| `createHTML(value)` | Converts the HTML string passed to template compilation into trusted HTML before FAST assigns it to a `<template>` element's `innerHTML`. |
| `protect(tagName, aspect, aspectName, sink)` | Returns the DOM sink FAST should use when a binding writes to an attribute, property, content node, token list, or event. |

By default, `DOMPolicy.create()` creates a Trusted Types policy named `fast-element` when `globalThis.trustedTypes` is available. It also installs guard rules for common dangerous sinks, including inline event attributes, `innerHTML`, selected URL attributes/properties, script text, and `iframe[srcdoc]`.

You can extend or replace guards for your own application requirements. The guard receives the sink FAST would normally call and returns the sink FAST should call instead.

```ts
import { DOMAspect } from "@microsoft/fast-element/dom.js";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";

const httpsOnly = (_tagName, _aspect, _aspectName, sink) => {
    return (target, name, value, ...rest) => {
        const url = new URL(String(value), document.baseURI);

        if (url.protocol === "https:") {
            sink(target, name, url.href, ...rest);
        }
    };
};

const policy = DOMPolicy.create({
    guards: {
        elements: {
            img: {
                [DOMAspect.attribute]: {
                    src: httpsOnly,
                },
                [DOMAspect.property]: {
                    src: httpsOnly,
                },
            },
        },
    },
});
```

## Default policy limitations

The default policy is a framework baseline, not a complete application sanitizer.

- The default Trusted Types `createHTML()` implementation returns the input HTML. It marks framework-authored template strings as trusted, but it does not sanitize user content.
- Guard rules protect only DOM writes that go through FAST binding sinks. They do not protect manual `element.innerHTML = ...` assignments, third-party libraries, server output, or DOM writes outside FAST.
- Guard rules are intentionally generic. They cannot validate application-specific URL allowlists, rich text schemas, or business rules.
- `DOMPolicy.create({ trustedType })` still includes the default guard rules. For example, `:innerHTML` remains blocked unless you replace the `innerHTML` property guard with one that sanitizes and writes safe HTML.

## Rendering raw HTML safely

Prefer normal content bindings for dynamic values. FAST writes content bindings with `textContent`, so values are rendered as text rather than parsed as HTML.

```ts
const template = html<MessageView>`
    <p>${x => x.message}</p>
`;
```

Avoid building template strings from user input. APIs such as `ViewTemplate.create()` and `RenderInstruction.create()` accept raw strings for template HTML, attributes, or content. Only use those APIs with trusted source strings, and pass a policy that matches the risk of the string source.

When you must bind sanitized HTML, provide a policy for that binding and replace the `innerHTML` guard with a sink that sanitizes before writing.

```ts
import { DOMAspect } from "@microsoft/fast-element/dom.js";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";
import { html, oneWay } from "@microsoft/fast-element";

function sanitizeHTML(value: string): string {
    // Use your application's HTML sanitizer here.
    return value;
}

const trustedType = globalThis.trustedTypes?.createPolicy("app-rich-text", {
    createHTML: sanitizeHTML,
}) ?? { createHTML: sanitizeHTML };

const richTextPolicy = DOMPolicy.create({
    trustedType,
    guards: {
        aspects: {
            [DOMAspect.property]: {
                innerHTML: (_tagName, _aspect, _aspectName, sink) => {
                    return (target, name, value, ...rest) => {
                        sink(target, name, trustedType.createHTML(String(value)), ...rest);
                    };
                },
            },
        },
    },
});

const template = html<MessageView>`
    <article :innerHTML="${oneWay(x => x.messageHtml, richTextPolicy)}"></article>
`;
```

Declarative templates follow the same rule. Double-brace content bindings are escaped. Triple-brace bindings render unescaped HTML, so use them only with trusted or sanitized content and a policy appropriate for the containing component.

## Template-specific policies

Use the global policy for application-wide defaults. Use a template-specific or binding-specific policy when a single component has stricter requirements.

```ts
const componentPolicy = DOMPolicy.create();

export const template = html<MyElement>`
    <a href="${x => x.url}">${x => x.label}</a>
`.withPolicy(componentPolicy);
```

`withPolicy()` must be called before the template is compiled. After a template has been rendered, hydrated, or otherwise compiled, its policy cannot be changed.

## Checklist

- Configure the global policy once, during application startup.
- Use path imports for early policy setup before importing modules that define and render components.
- Treat static templates as trusted source code; do not concatenate user input into template strings.
- Render user text with content bindings, not raw HTML.
- Sanitize rich HTML before it reaches `:innerHTML`, triple-brace declarative bindings, or render-instruction strings.
- Add Trusted Types CSP policy names for every policy your application creates.
