# Introduction

This document (and the linked documents) explains how the exports and side effects of `@microsoft/fast-element` are used to create custom elements.

## Glossary

- [Overview](./ARCHITECTURE_OVERVIEW.md): How the `@microsoft/fast-element` should be used by a developer and what code is executed during the first render.
- [`FASTElement`](./ARCHITECTURE_FASTELEMENT.md): How the `FASTElement` is architected.
- [`html` tagged template literal](./ARCHITECTURE_HTML_TAGGED_TEMPLATE_LITERAL.md): How the `html` tagged template literal takes and converts the contents into a `VIEWTemplate`.
- [`Updates` queue](./ARCHITECTURE_UPDATES.md): How updates to attributes and observables are processed.