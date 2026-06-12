# Introduction

This document (and the linked documents) explains how the exports and side effects of `@microsoft/fast-element` are used to create custom elements.

`@microsoft/fast-element` is designed to run in a client-side browser `Window`
runtime. Its element lifecycle, rendering, and update queue assume browser DOM,
Custom Elements, Shadow DOM, and `requestAnimationFrame` are available. Workers,
server-side JavaScript runtimes, and other non-window hosts are not supported
targets for the FAST Element client runtime.

## Glossary

- [Overview](./overview.md): How the `@microsoft/fast-element` should be used by a developer and what code is executed during the first render.
- [`FASTElement`](./fastelement.md): How the `FASTElement` is architected.
- [`html` tagged template literal](./html-tagged-template-literal.md): How the `html` tagged template literal takes and converts the contents into a `ViewTemplate`.
- [`Updates` queue](./updates.md): How updates to attributes and observables are processed.