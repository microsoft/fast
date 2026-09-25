---
id: faq
title: FAQ
sidebar_label: FAQ
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/resources/faq.md
description: A list of frequently asked questions.
keywords:
  - frequently asked questions
---

### Who is behind FAST?

The Microsoft FAST team builds and maintains all the `@microsoft/fast-*` packages. We are a collection of UX Engineers and Designers who are passionate about solving real-world UX challenges using web standard technologies. You can find us on [GitHub](https://github.com/microsoft/fast).

### What does FAST stand for?

When the project was originally founded, it went by the name FAST-DNA, which stood for "Functional, Adaptive, Secure, and Timeless Design Network Architecture". Over time we began to refer to the project as "FAST" which reflects our desire to create libraries and tools that enable leading designer and developer productivity.

### How does `fast-element` compare to "Framework X"?

At this time, `fast-element` has a focus that's a bit different from the typical front-end framework. Rather than focusing on being a "mega SPA framework", `fast-element` endeavors to enable the creation of web components. As a result, you can use `fast-element` or any component built on `fast-element` in tandem with your favorite front-end framework.

### What are Web Components?

"Web Components" is an umbrella term that refers to a collection of web standards focused on enabling the creation of custom HTML elements. Some of the standards that are under the umbrella include the ability to define new HTML tags, plug into a standard component lifecycle, encapsulate HTML rendering and CSS, parameterize CSS, skin components, and more. Each of these platform features is defined by the W3C and has shipped in every major browser today.

### Why should I choose Web Components over [other JavaScript framework]?
Great question! Check out [why you might choose Web Components](./why-web-components.md) for your project.

### Are Web Components "done"?

The work on Web Component standards, like the rest of the web, is ongoing. New APIs continue to be designed and released. Some recent APIs include Form Associated Custom Element APIs and CSS Shadow Parts. The W3C is currently working on standards for things like Constructible Style Sheets, Declarative Shadow DOM, Scoped Element Registries, Custom Pseudo Selectors, and more.

### Why does FAST have components that are already available in HTML?

Various members of our community have wondered why FAST has components that seem to mirror native elements. Examples include `fast-anchor`, `fast-button`, and `fast-divider`. There are several reasons for this:
* CSS Encapsulation - By using Shadow DOM, FAST is able to provide a set of styles for these elements and guarantee that they will not conflict with your site or app. Your site styles will not break FAST and FAST will not break your site.
* CSS Behaviors - Custom elements enable FAST to dynamically add/remove styles based on runtime conditions, such as toggling high contrast mode. They also enable components to hook into the *design system* and respond to design changes over time.
* Enhanced Anatomies - The FAST team refers to the DOM structure of a component as its "anatomy". This is an important detail of [a component spec](https://github.com/microsoft/fast/tree/master/specs). Our research as part of [OpenUI](https://open-ui.org/) has revealed common anatomies across many design systems and component libraries that are not reflected by a single standard HTML element. We leverage this research to design the structure of our FAST components so that they are built in a way that meets real-world needs, particularly regarding composition with other components. Some basic components, such as `anchor`, benefit from an expanded anatomy, based on industry usage. Through custom elements, we are able to implement this anatomy without inflicting an HTML authoring burden on our community.
