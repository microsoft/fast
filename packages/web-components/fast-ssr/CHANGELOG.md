# Change Log - @microsoft/fast-ssr

This log was last generated on Fri, 18 Aug 2023 22:48:12 GMT and should not be manually modified.

<!-- Start content -->

## 1.0.0-beta.31

Fri, 18 Aug 2023 22:48:12 GMT

### Changes

- Bump @microsoft/fast-foundation to v3.0.0-alpha.31

## 1.0.0-beta.30

Fri, 18 Aug 2023 00:04:37 GMT

### Changes

- Breaking: update fast-ssr export paths to include extensions (chhol@microsoft.com)
- Bump @microsoft/fast-element to v2.0.0-beta.26
- Bump @microsoft/fast-foundation to v3.0.0-alpha.30

## 1.0.0-beta.29

Sat, 12 Aug 2023 00:26:36 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.25
- Bump @microsoft/fast-foundation to v3.0.0-alpha.29

## 1.0.0-beta.28

Fri, 16 Jun 2023 18:17:13 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.24
- Bump @microsoft/fast-foundation to v3.0.0-alpha.28

## 1.0.0-beta.27

Tue, 28 Mar 2023 22:14:10 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.23
- Bump @microsoft/fast-foundation to v3.0.0-alpha.27

## 1.0.0-beta.26

Sat, 11 Mar 2023 00:09:49 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.22
- Bump @microsoft/fast-foundation to v3.0.0-alpha.26

## 1.0.0-beta.25

Tue, 14 Feb 2023 04:02:36 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.21
- Bump @microsoft/fast-foundation to v3.0.0-alpha.25

## 1.0.0-beta.24

Wed, 11 Jan 2023 22:07:44 GMT

### Changes

- fix(fast-ssr): update to use html.partial (roeisenb@microsoft.com)
- Bump @microsoft/fast-element to v2.0.0-beta.20
- Bump @microsoft/fast-foundation to v3.0.0-alpha.24

## 1.0.0-beta.23

Fri, 02 Dec 2022 01:18:22 GMT

### Changes

- feat: shim DOMTokenList for class and part properties on HTMLElement (roeisenb@microsoft.com)
- Bump @microsoft/fast-element to v2.0.0-beta.19
- Bump @microsoft/fast-foundation to v3.0.0-alpha.23

## 1.0.0-beta.22

Tue, 15 Nov 2022 02:40:34 GMT

### Changes

- Added configuration option to fast-ssr to render custom directives (nicholasrice@users.noreply.github.com)
- add new DOM Policy protection throughout (roeisenb@microsoft.com)
- Bump @microsoft/fast-element to v2.0.0-beta.18
- Bump @microsoft/fast-foundation to v3.0.0-alpha.22

## 1.0.0-beta.21

Fri, 04 Nov 2022 22:28:49 GMT

### Changes

- export features from DOM shim, refactor for better TypeScript support (nicholasrice@users.noreply.github.com)
- Adds export path for RequestStorage (nicholasrice@users.noreply.github.com)
- Fix boolean attribute rendering issues and throw error for unknown/object type of attributes (daviwu@microsoft.com)
- Bump @microsoft/fast-foundation to v3.0.0-alpha.21

## 1.0.0-beta.20

Tue, 01 Nov 2022 23:26:26 GMT

### Changes

- Adds `defer-hydration` attribute emission during rendering (nicholasrice@users.noreply.github.com)
- Fixed bug preventing dist files from being included in the published package (nicholasrice@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.0.0-beta.17
- Bump @microsoft/fast-foundation to v3.0.0-alpha.20

## 1.0.0-beta.19

Fri, 28 Oct 2022 20:44:44 GMT

### Changes

- Adds shim for MediaQueryList.addEventListener and updates matchMedia to always use the window's MediaQueryList (nicholasrice@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.0.0-beta.16
- Bump @microsoft/fast-foundation to v3.0.0-alpha.19

## 1.0.0-beta.18

Tue, 25 Oct 2022 20:24:32 GMT

### Changes

- add feature to disable rendering of a component by the element renderer (nicholasrice@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.0.0-beta.15
- Bump @microsoft/fast-foundation to v3.0.0-alpha.18

## 1.0.0-beta.17

Fri, 14 Oct 2022 18:26:11 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.14
- Bump @microsoft/fast-foundation to v3.0.0-alpha.17

## 1.0.0-beta.16

Mon, 10 Oct 2022 20:28:02 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.13
- Bump @microsoft/fast-foundation to v3.0.0-alpha.16

## 1.0.0-beta.15

Thu, 06 Oct 2022 23:21:20 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.12
- Bump @microsoft/fast-foundation to v3.0.0-alpha.15

## 1.0.0-beta.14

Wed, 05 Oct 2022 23:26:01 GMT

### Changes

- Added RequestStorageManager.uninstallDOMShim() method to support uninstalling installed DOM shims (nicholasrice@users.noreply.github.com)
- add {shadowOptions: null} support (nicholasrice@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.0.0-beta.11
- Bump @microsoft/fast-foundation to v3.0.0-alpha.14

## 1.0.0-beta.13

Mon, 03 Oct 2022 23:44:38 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.10
- Bump @microsoft/fast-foundation to v3.0.0-alpha.13

## 1.0.0-beta.12

Wed, 28 Sep 2022 20:45:51 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.9
- Bump @microsoft/fast-foundation to v3.0.0-alpha.12

## 1.0.0-beta.11

Tue, 27 Sep 2022 22:31:52 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.8
- Bump @microsoft/fast-foundation to v3.0.0-alpha.11

## 1.0.0-beta.10

Fri, 23 Sep 2022 22:53:27 GMT

### Changes

- update playwright (863023+radium-v@users.noreply.github.com)
- Refactor core components to support Promise return types (nicholasrice@users.noreply.github.com)
- Adds support for async component rendering through the PendingTask protocol (nicholasrice@users.noreply.github.com)
- fix: updae SSR to use the new behavior API (roeisenb@microsoft.com)
- Bump @microsoft/fast-element to v2.0.0-beta.7
- Bump @microsoft/fast-foundation to v3.0.0-alpha.10

## 1.0.0-beta.9

Thu, 01 Sep 2022 21:53:34 GMT

### Changes

- feat: expose backend of RequestStorageManager for advanced integration (roeisenb@microsoft.com)
- add default renderInfo implementation to TemplateRenderer.render (nicholasrice@users.noreply.github.com)
- Bump @microsoft/fast-element to v2.0.0-beta.6
- Bump @microsoft/fast-foundation to v3.0.0-alpha.9

## 1.0.0-beta.8

Fri, 26 Aug 2022 18:06:43 GMT

### Changes

- After install DOM Shim, globals will now return the original global instead of the shimmed version in async local storage if code is not in storage scope. (erhuan@microsoft.com)
- Bump @microsoft/fast-foundation to v3.0.0-alpha.8

## 1.0.0-beta.7

Thu, 18 Aug 2022 20:46:10 GMT

### Changes

- add subpath export for package.json to packages (32497422+KingOfTac@users.noreply.github.com)
- implement CSSStyleSheet behavior to support DesignToken in SSR (nicholasrice@users.noreply.github.com)
- feat: implement Declarative Shadow DOM polyfill as an optional plugin for FAST Server Side Rendering (roeisenb@microsoft.com)
- Bump @microsoft/fast-element to v2.0.0-beta.5
- Bump @microsoft/fast-foundation to v3.0.0-alpha.7

## 1.0.0-beta.6

Wed, 27 Jul 2022 17:36:33 GMT

### Changes

- Bump @microsoft/fast-foundation to v3.0.0-alpha.6

## 1.0.0-beta.5

Mon, 18 Jul 2022 21:10:01 GMT

### Changes

- feat: update SSR to new binding APIs (roeisenb@microsoft.com)
- feat: enable the render directive to work in SSR (roeisenb@microsoft.com)
- fix: update server-side-rendering of the repeat directive to use the renamed dataBinding property of the repeat directive (roeisenb@microsoft.com)
- feat: add request storage to support per-request context in server side rendering (roeisenb@microsoft.com)
- fix: server side rendering foundation tests (roeisenb@microsoft.com)
- Bump @microsoft/fast-element to v2.0.0-beta.4
- Bump @microsoft/fast-foundation to v3.0.0-alpha.5

## 1.0.0-beta.4

Wed, 22 Jun 2022 20:17:50 GMT

### Changes

- Bump @microsoft/fast-element to v2.0.0-beta.3 (nicholasrice@users.noreply.github.com)

## 1.0.0-beta.3

Wed, 15 Jun 2022 17:41:10 GMT

### Changes

- Implemented Event support into SSR (nicholasrice@users.noreply.github.com)
- feat: simplify execution context to align closer with v1 (roeisenb@microsoft.com)
- chore: fix package.json type fields (roeisenb@microsoft.com)

## 1.0.0-beta.2

Wed, 01 Jun 2022 22:21:24 GMT

### Changes

- Bump @microsoft/fast-foundation to v3.0.0-alpha.2 (nicholasrice@users.noreply.github.com)

## 1.0.0-beta.1

Wed, 01 Jun 2022 17:53:14 GMT

### Changes

- update npmignore file w/ new project structure (nicholasrice@users.noreply.github.com)
- remove private field from package.json (nicholasrice@users.noreply.github.com)
- chore: configure fast-ssr for internals stripping (roeisenb@microsoft.com)
- Set prerelease version (nicholasrice@users.noreply.github.com)
- Adds DOM shim support for APIs in @microsoft/fast-foundation (nicholasrice@users.noreply.github.com)
