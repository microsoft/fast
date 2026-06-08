---
id: dom-policy
title: DOM Policies
layout: 3x
eleventyNavigation:
  key: dom-policy3x
  parent: advanced3x
  title: DOM Policies
navigationOptions:
  activeKey: dom-policy3x
description: Configure a DOMPolicy to safely render HTML and to control which DOM sinks bindings may write to.
keywords:
  - DOMPolicy
  - trusted types
  - innerHTML
  - security
---

# DOM Policies

FAST guards a small set of DOM sinks that are common vectors for cross-site scripting, most notably the `innerHTML` property and event handler attributes that take string values. By default, attempts to bind to these sinks throw at template compilation time. To bind to a guarded sink, the template must be associated with a `DOMPolicy` that authorizes the operation.

A `DOMPolicy` is a frozen object that wraps two things:

1. A `TrustedTypesPolicy` used to produce HTML strings that the platform considers safe.
2. A set of *guards* that the template engine consults before applying each binding.

The platform's [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) specification gives the browser a way to enforce that HTML strings have passed through an application-controlled sanitization step. When Trusted Types are enforced through CSP headers, the browser will reject assignments to `innerHTML` and similar sinks that have not been produced by a registered policy. FAST's `DOMPolicy` integrates with this platform feature so the same sanitization is applied during template binding regardless of whether CSP enforcement is active.

## Creating a Policy

Use `DOMPolicy.create()` to build a policy. The `trustedType` option accepts a `TrustedTypesPolicy` produced by `trustedTypes.createPolicy()`. The sanitization function passed to `createPolicy()` is the application's opportunity to inspect or rewrite the HTML before it reaches the DOM.

```ts
import { DOMPolicy } from "@microsoft/fast-element";

const trustedType = trustedTypes.createPolicy("my-app", {
  createHTML(value) {
    // Run the value through a sanitizer such as DOMPurify
    // before returning it.
    return sanitize(value);
  },
});

const policy = DOMPolicy.create({ trustedType });
```

The policy can only be created once per `TrustedTypesPolicy` name, so policies are typically created during application startup and shared across templates.

## Associating a Policy with a Template

Use `withPolicy()` to attach a policy to a template. The call returns the same template instance, so it can be chained at template creation time.

```ts
import { html } from "@microsoft/fast-element";

const template = html<ArticleView>`
  <article :innerHTML="${x => x.body}"></article>
`.withPolicy(policy);
```

A policy can be attached to a template only once, and only before the template is compiled. Once a template has rendered, its policy is locked in. This restriction prevents a later piece of code from substituting a more permissive policy after content has already been authored against the original one.

## Binding to `innerHTML`

With a policy attached, the `:innerHTML` property binding is allowed and the binding's return value is passed through the policy's `createHTML()` function before being assigned. Without a policy, the same binding throws at compilation time with a message indicating that a Trusted Types policy is required.

```ts
import { html } from "@microsoft/fast-element";

const articleTemplate = html<ArticleView>`
  <article :innerHTML="${x => x.body}"></article>
`.withPolicy(policy);
```

The component is responsible for ensuring that the value passed to the binding is something the policy's sanitizer will accept. The policy provides a final, application-wide checkpoint; it does not replace the need for component authors to think about where the HTML originates.

:::important
Set the policy on the template during construction and treat it as immutable. Components and libraries should not attempt to swap policies at runtime, and consumers of a template should not assume they can attach a different policy to an already-rendered template.
:::

## See Also

- [`DOMPolicy`](/docs/3.x/api/fast-element.dompolicy/) — the policy interface
- [`DOMPolicyOptions`](/docs/3.x/api/fast-element.dompolicyoptions/) — options accepted by `DOMPolicy.create()`
- [`TrustedTypesPolicy`](/docs/3.x/api/fast-element.trustedtypespolicy/) — the platform Trusted Types policy interface
- [Trusted Types specification](https://w3c.github.io/trusted-types/dist/spec/)
