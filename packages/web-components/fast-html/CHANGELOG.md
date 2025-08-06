# Change Log - @microsoft/fast-html

<!-- This log was last generated on Wed, 06 Aug 2025 07:15:14 GMT and should not be manually modified. -->

<!-- Start content -->

## 1.0.0-alpha.18

Wed, 06 Aug 2025 07:15:14 GMT

### Changes

- Add an optional observer map (7559015+janechu@users.noreply.github.com)
- Fix left hand expression logic (7559015+janechu@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.6.0

## 1.0.0-alpha.17

Mon, 28 Jul 2025 00:36:37 GMT

### Changes

- convert RenderableFASTElement to a mixin function (863023+radium-v@users.noreply.github.com)

## 1.0.0-alpha.16

Wed, 16 Jul 2025 22:43:52 GMT

### Changes

- Update component lifecycles with async methods to allow for a deferred define step (7559015+janechu@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.5.0

## 1.0.0-alpha.15

Mon, 07 Jul 2025 00:35:58 GMT

### Changes

- Fix the RenderableFASTElement to account for rendering when not hydrating and add an optional function to await if the user needs to perform additional hydratable actions (7559015+janechu@users.noreply.github.com)
- feat: supports filter in f-slotted directive (machi@microsoft.com)

## 1.0.0-alpha.14

Sat, 14 Jun 2025 20:48:12 GMT

### Changes

- Remove setting explicit DOM policy as this causes an issue with CSP duplicate policy creation (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.13

Fri, 30 May 2025 05:02:03 GMT

### Changes

- Add a RenderableFASTElement and default shadow options (7559015+janechu@users.noreply.github.com)
- fix: event handler binding (machi@microsoft.com)
- Bump @microsoft/fast-element to v2.4.1

## 1.0.0-alpha.12

Fri, 23 May 2025 23:52:29 GMT

### Changes

- Keep a f-repeat context when creating bindings for f-when (7559015+janechu@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.4.0

## 1.0.0-alpha.11

Wed, 14 May 2025 05:27:34 GMT

### Changes

- Resolve chained expressions and fix an issue with single quotes in f-when binding (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.10

Tue, 06 May 2025 20:54:32 GMT

### Changes

- Fixes an issue with transforming innerHTML where the inner contents were not slicing correctly (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.9

Mon, 05 May 2025 00:33:41 GMT

### Changes

- Add an options method for the TemplateElement that can pass additional configuration details to components (7559015+janechu@users.noreply.github.com)
- Add some utilities for converting html tag templates (7559015+janechu@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.3.0

## 1.0.0-alpha.8

Mon, 28 Apr 2025 16:06:00 GMT

### Changes

- Add unescaped bindings syntax interpretation (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.7

Wed, 16 Apr 2025 15:53:12 GMT

### Changes

- Change client only bindings to single curly braces and categorize single, double, and tripe curly brace bindings (7559015+janechu@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.2.1

## 1.0.0-alpha.6

Thu, 10 Apr 2025 21:08:35 GMT

### Changes

- Allow passing events or context to event handlers (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.5

Wed, 09 Apr 2025 23:46:40 GMT

### Changes

- Add parent context access to bindings (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.4

Fri, 04 Apr 2025 21:01:38 GMT

### Changes

- Add logic to the when directive for a subset of operators (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.3

Mon, 31 Mar 2025 00:32:15 GMT

### Changes

- Remove inclusion of alpha tag as there is no stable version yet (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.2

Tue, 25 Mar 2025 19:31:26 GMT

### Changes

- Includes correct files for published package (7559015+janechu@users.noreply.github.com)

## 1.0.0-alpha.1

Mon, 24 Mar 2025 18:26:13 GMT

### Changes

- Update private flag for initial release (7559015+janechu@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.2.0
