# Introduction

This document (and the linked documents) explains how the exports and side effects of `@microsoft/fast-element` are used to create custom elements.

## Glossary

- [Overview](./overview.md): How the `@microsoft/fast-element` should be used by a developer and what code is executed during the first render.
- [`FASTElement`](./fastelement.md): How the `FASTElement` is architected.
- [`html` tagged template literal](./html-tagged-template-literal.md): How the `html` tagged template literal takes and converts the contents into a `ViewTemplate`.
- [`Updates` queue](./updates.md): How updates to attributes and observables are processed.