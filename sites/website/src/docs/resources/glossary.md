---
id: glossary
title: Glossary
sidebar_label: Glossary
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/sites/website/src/docs/resources/glossary.md
---

#### ES2015

The official name of the JavaScript specification released in 2015. The committee governing EcmaScript, tc39, releases a spec each year. The designation ES2015+ refers to any version of the language from 2015 onward. 

#### Evergreen Browser

Refers to the collection of modern browsers that auto-update to frequently make available the latest web standard features to their customers. 

#### Houdini

An umbrella term referring to a collection of new CSS capabilities that enable web developers to “break out” of the black box of CSS. Capabilities include a typed object model for CSS, custom painting, custom layout algorithms, animation and scrolling control, etc. 

#### Polyfill

JavaScript code which attempts to emulate a native browser feature as close as possible to spec, for browsers which do not yet support the feature. Polyfills enable adopting more web standards, typically at the cost of increased download size and performance degradation on downlevel browsers. 

#### Time to Interactive (TTI)

The amount of time it takes a web page to become interactive. The smaller the TTI, the better. 

#### Transpiler

Similar to a compiler, but rather than transforming a high-level language to machine instructions, it transforms one high-level language to another high-level language. E.g. TypeScript to JavaScript or ES2015 to ES5. On the web, this allows new JavaScript syntax to be used even if not supported by all target browsers, as the new syntax can sometimes be converted to a more verbose version of the old syntax. However, transpilers often produce output that is not only less performant than the native language feature but often exhibiting spec-compliance issues in particularly nuanced ways. 

#### Web Components

An umbrella term referring to a collection of new HTML and CSS capabilities aimed at enabling a native, extensible component model for the web. Typically, the term refers to the following specs: HTMLTemplateElement, Custom Elements, and Shadow DOM. Sometimes CSS properties are included in the list. The list also continues to expand with features like Adopted Style Sheets, CSS Shadow Parts and Themes, and native HTML/CSS modules. 