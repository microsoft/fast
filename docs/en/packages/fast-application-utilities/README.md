---
id: index
title: FAST Application Utilities
sidebar_label: Application Utilities
---

# FAST application utilities
**FAST application utilities has been deprecated. Use [FAST web utilities](https://www.npmjs.com/package/@microsoft/fast-web-utilities) instead.**

A list of utilities used by FAST applications.

## Localization

The `isRTL` utility determines if a string which should correspond to a language or language-locale is right to left.

```typescript
import { isRTL } from "@microsoft/fast-application-utilities";

isRTL("en");
```

### Typescript enum

The `Direction` enum contains the `ltr` and `rtl` enum for use in a Typescript project.

```typescript
import { Direction } from "@microsoft/fast-application-utilities";

let direction: Direction = Direction.ltr;
```