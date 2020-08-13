---
id: faq
title: FAQ
sidebar_label: FAQ
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/faq.md
---

### Who is behind FAST?

The Microsoft FAST team builds and maintains all the `@microsoft/fast-*` packages as well as the `@fluentui/web-components` package. We are a collection of UX Engineers and Designers who are passionate about solving real-world UX challenges using web standard technologies. You can find us on [GitHub](https://github.com/microsoft/fast).

### What does FAST stand for?

When the project was originally founded, it went by the name FAST-DNA, which stood for "Functional, Adaptive, Secure, and Timeless Design Network Architecture". Over time we began to refer to the project as "FAST" which reflects our desire to create libraries and tools that enable leading designer and developer productivity.

### What's the difference between FAST and Fluent?

Fluent is Microsoft's design language, independent of any particular implementation technology. FAST is an agnostic tech stack that enables implementing web components, design systems, and apps. `fast-element` is the lowest level of FAST, providing core features for building performant web components. `fast-foundation` is layered on top of `fast-element` and provides primarily two things: core features for building design systems, and a core set of components that are design-system-independent. With `fast-foundation` you can implement any design system. For example, you could implement Fluent Design, Material Design, Lightning Design, Bootstrap, etc. Once the design system is implemented, it can connect with any component built with `fast-element` or `fast-foundation` to enable a particular component to present itself using the visual language of the chosen design system. The FAST team ships two design systems: `fast-components`, which provide our team's own FAST Design system, and `@fluentui/web-components`, located in the [Fluent UI repo](https://github.com/microsoft/fluentui/), which provides Microsoft's Fluent Design system. If you want to build an app or site with Fluent Design, and you want to use web components as a technology solution, you can use `@fluentui/web-components` to meet that need today.

### How does `fast-element` compare to "Framework X"?

At this time, `fast-element` has a focus that's a bit different from the typical front-end framework. Rather than focusing on being a "mega SPA framework", `fast-element` endeavors to enable the creation of web components. As a result, you can use `fast-element` or any component built on `fast-element` in tandem with your favorite front-end framework.

### What are Web Components?

"Web Components" is an umbrella term that refers to a collection of web standards focused on enabling the creation of custom HTML elements. Some of the standards that are under the umbrella include the ability to define new HTML tags, plug into a standard component lifecycle, encapsulate HTML rendering and CSS, parameterize CSS, skin components, and more. Each of these platform features is defined by the W3C and has shipped in every major browsers today.

### Are Web Components "done"?

The work on Web Component standards, like the rest of the web, is ongoing. New APIs continue to be designed and released. Some recent APIs include Form Associated Custom Element APIs and CSS Shadow Parts. The W3C is currently working on standards for things like Constructible Style Sheets, Declarative Shadow DOM, Scoped Element Registries, Custom Pseudo Selectors, and more.