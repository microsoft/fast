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

FAST guards a small set of DOM sinks that are common vectors for cross-site scripting, most notably the `innerHTML` property and the event-handler attributes that take string values. By default, binding to one of these sinks throws when the template compiles. To bind to a guarded sink, the template must carry a `DOMPolicy` that authorizes the operation.

A `DOMPolicy` is a frozen object that wraps two things:

1. A `TrustedTypesPolicy` that produces HTML strings the platform treats as safe.
2. A set of *guards* that the template engine consults before it applies each binding.

The platform's [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) specification gives the browser a way to require that HTML strings pass through an application-controlled sanitization step. When Trusted Types are enforced through CSP headers, the browser rejects any assignment to `innerHTML` or a similar sink that did not come from a registered policy. FAST's `DOMPolicy` plugs into that platform feature, so the same sanitization runs during template binding whether or not CSP enforcement is active.

## Configuring the global policy

`DOM.setPolicy()` installs the policy that FAST's templating system uses by default. You can call it only once, so set it from an application entry module before any custom element is defined, any template is compiled, or any template renders.

```ts
import { DOM } from "@microsoft/fast-element/dom.js";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";

const trustedType = globalThis.trustedTypes?.createPolicy("app-fast-html", {
    createHTML(html) {
        // FAST templates are framework-authored source, so this policy only
        // wraps them for Trusted Types. Sanitize user HTML in a sink guard.
        return html;
    },
}) ?? { createHTML: html => html };

DOM.setPolicy(DOMPolicy.create({ trustedType }));
```

Import `DOMPolicy` from its module path rather than the package barrel, so the policy is in place before the modules that define and render components load.

If your Content Security Policy uses a `trusted-types` directive, that directive has to allow the policy name you create. When you rely on FAST's built-in policy instead, allow the `fast-element` name.

:::important
Application owners configure the global policy. A reusable component library should never call `DOM.setPolicy()`, because that would stop the host application from installing its own.
:::

## Creating a policy

Use `DOMPolicy.create()` to build a policy. The `trustedType` option takes a `TrustedTypesPolicy` from `trustedTypes.createPolicy()`. The function you pass to `createPolicy()` is where the application inspects or rewrites HTML before it reaches the DOM.

```ts
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";

const trustedType = trustedTypes.createPolicy("my-app", {
    createHTML(value) {
        // Run the value through a sanitizer such as DOMPurify before returning it.
        return sanitize(value);
    },
});

const policy = DOMPolicy.create({ trustedType });
```

A `TrustedTypesPolicy` name can be created only once, so policies are usually built during startup and shared across templates.

Every policy carries two responsibilities. `createHTML(value)` converts the HTML string handed to template compilation into trusted HTML before FAST assigns it to a `<template>` element. `protect(tagName, aspect, aspectName, sink)` returns the DOM sink FAST should use when a binding writes to an attribute, property, content node, token list, or event.

`DOMPolicy.create()` installs guard rules for the sinks that are dangerous by default: inline event attributes, `innerHTML`, selected URL attributes and properties, script text, and `iframe[srcdoc]`. When `globalThis.trustedTypes` is available, it also creates a Trusted Types policy named `fast-element`.

You can add or replace guards for your own rules. A guard receives the sink FAST would call and returns the sink it should call instead. This one allows an `img` `src` only when the value resolves to an `https:` URL:

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
                [DOMAspect.attribute]: { src: httpsOnly },
                [DOMAspect.property]: { src: httpsOnly },
            },
        },
    },
});
```

## What the default policy does not cover

The default policy is a framework baseline, not a full application sanitizer.

- The default `createHTML()` returns its input. It marks framework-authored template strings as trusted, but it does not sanitize user content.
- Guards protect only the DOM writes that pass through FAST binding sinks. A manual `element.innerHTML = ...`, a third-party library, server output, or any write outside FAST goes unguarded.
- Guards are generic by design. They cannot enforce an application's URL allowlist, rich-text schema, or business rules.
- `DOMPolicy.create({ trustedType })` keeps the default guards. `:innerHTML`, for instance, stays blocked until you replace the `innerHTML` guard with one that sanitizes and writes safe HTML.

## Associating a policy with a template

Use `withPolicy()` to attach a policy to a template. It returns the same template instance, so you can chain it at the point of creation.

```ts
import { html } from "@microsoft/fast-element";

const template = html<ArticleView>`
    <article :innerHTML="${x => x.body}"></article>
`.withPolicy(policy);
```

Attach the policy before the template compiles, and attach it only once. Once a template has rendered, its policy is locked. This keeps later code from swapping in a more permissive policy after content has already been authored against the original one. Reach for a template-specific policy when one component needs stricter rules than the global default provides.

## Binding to `innerHTML`

With a policy attached, the `:innerHTML` binding is allowed, and FAST passes the binding's return value through the policy's `createHTML()` before assigning it. Without a policy, the same binding throws at compile time with a message that a Trusted Types policy is required.

The component is responsible for making sure the value it passes to the binding is something the policy's sanitizer will accept. The policy is a final, application-wide checkpoint; it does not replace the need to know where the HTML came from.

For most dynamic values, skip `innerHTML` entirely. A normal content binding writes through `textContent`, so the value renders as text instead of parsed markup.

```ts
const template = html<MessageView>`
    <p>${x => x.message}</p>
`;
```

When you do need to render sanitized HTML, give that binding a policy whose `innerHTML` guard sanitizes before it writes, and bind the value with `oneWay()`.

```ts
import { DOMAspect } from "@microsoft/fast-element/dom.js";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";
import { html, oneWay } from "@microsoft/fast-element";

function sanitizeHTML(value: string): string {
    // Use your application's HTML sanitizer here.
    return value;
}

const trustedType = globalThis.trustedTypes?.createPolicy("app-rich-text", {
    createHTML(html) {
        // Only sanitized rich-text values reach this policy.
        return html;
    },
}) ?? { createHTML: html => html };

const richTextPolicy = DOMPolicy.create({
    guards: {
        aspects: {
            [DOMAspect.property]: {
                innerHTML: (_tagName, _aspect, _aspectName, sink) => {
                    return (target, name, value, ...rest) => {
                        const sanitized = sanitizeHTML(String(value));
                        sink(target, name, trustedType.createHTML(sanitized), ...rest);
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

Declarative templates follow the same rule. Double-brace content bindings are escaped, while triple-brace bindings render through an `innerHTML` binding, so the default policy blocks them until the containing component supplies an `innerHTML` guard. Use them only with trusted or sanitized content. The same caution applies to `ViewTemplate.create()` and `RenderInstruction.create()`, which accept raw template strings: pass them trusted source, never concatenated user input.

:::important
Set the policy on the template during construction and treat it as immutable. Components and libraries should not swap policies at runtime, and consumers should not assume they can attach a different policy to a template that has already rendered.
:::

## Checklist

- Configure the global policy once, during startup, using path imports so it loads before your components.
- Treat static templates as trusted source code, and keep user input out of template strings.
- Render user text with content bindings rather than raw HTML.
- Sanitize rich HTML before it reaches `:innerHTML`, a triple-brace declarative binding, or a render-instruction string.
- Add a Trusted Types CSP policy name for every policy your application creates.

## See Also

- [`DOMPolicy`](/docs/3.x/api/fast-element.dompolicy/) is the policy interface.
- [`DOMPolicyOptions`](/docs/3.x/api/fast-element.dompolicyoptions/) lists the options `DOMPolicy.create()` accepts.
- [`TrustedTypesPolicy`](/docs/3.x/api/fast-element.trustedtypespolicy/) is the platform Trusted Types interface.
- [Trusted Types specification](https://w3c.github.io/trusted-types/dist/spec/)
