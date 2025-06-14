# Change Log - @microsoft/fast-html

<!-- This log was last generated on Sat, 14 Jun 2025 20:48:12 GMT and should not be manually modified. -->

<!-- Start content -->

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
