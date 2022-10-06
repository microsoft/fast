# Change Log - @microsoft/fast-ssr

This log was last generated on Thu, 06 Oct 2022 23:21:20 GMT and should not be manually modified.

<!-- Start content -->

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
