# Change Log - @microsoft/fast-element

This log was last generated on Wed, 22 Jun 2022 20:17:50 GMT and should not be manually modified.

<!-- Start content -->

## 2.0.0-beta.3

Wed, 22 Jun 2022 20:17:50 GMT

### Changes

- fix: correct aspect type for content that looks like an attribute (nicholasrice@users.noreply.github.com)

## 2.0.0-beta.2

Wed, 15 Jun 2022 17:41:10 GMT

### Changes

- doc: add note to FASTElement.metadata API (roeisenb@microsoft.com)
- when recycle is set to false while itemBinding stays the same, views should be recreated (wendy.hsu@microsoft.com)
- feat: simplify execution context to align closer with v1 (roeisenb@microsoft.com)
- feat: ergo improvements to context, array length, and metadata (roeisenb@microsoft.com)
- feat: move optional bindings out of rollup and list as exports (roeisenb@microsoft.com)
- fix: make SyntheticViewTemplate type a string so it is generally usable (roeisenb@microsoft.com)
- feat: implement W3C WC community context protocol and integrate with DI (roeisenb@microsoft.com)

## 2.0.0-beta.1

Wed, 01 Jun 2022 17:53:14 GMT

### Changes

- `DOM` - Tree Walker methods are no longer used and are thus removed. The API for removing child nodes has been removed as well since it was only used in one place and could be inlined. The helper `createCustomAttributePlaceholder()` no longer requires an attribute name. It will be uniquely generated internally. (roeisenb@microsoft.com)
- `class` - Bindings to `class` are now more nuanced. Binding directly to `class` will simply set the `className` property. If you need to bind to `class` knowing that manual JS will also manipulate the `classList` in addition to the binding, then you should now bind to `:classList` instead. This allows for performance optimizations in the simple, most common case. (roeisenb@microsoft.com)
- `Behavior` and `ViewBehavior` - `Behavior` now requires an `ExecutionContext` for `unbind`. Behaviors can be used for elements or views. `ViewBehavior` has been introduced for use exclusively with views, and provides some optimization opportunities. (roeisenb@microsoft.com)
- `RefBehavior` has been replaced with `RefDirective`. The directive also implements `ViewBehavior` allowing a single directive instance to be shared across all template instances that use the ref. (roeisenb@microsoft.com)
- Removed `SlottedBehavior` and `ChildrenBehavior` have been replaced with `SlottedDirective` and `ChildrenDirective`. These directives allow a single directive instance to be shared across all template instances that use the ref. (roeisenb@microsoft.com)
- Removed `AttachedBehaviorHTMLDirective` and `AttachedBehaviorType` since they are no longer used in the new directive/behavior architecture for ref, slotted, and children. (roeisenb@microsoft.com)
- Renamed `Notifier#source` to `Notifier#subject` to align with other observable terminology and prevent name clashes with `BindingObserver` properties. (roeisenb@microsoft.com)
- feat: create unified API for parsing markers (roeisenb@microsoft.com)
- allow null values in attributeChangedCallback (nicholasrice@users.noreply.github.com)
- feat: add splice strategies for array observation (roeisenb@microsoft.com)
- feat: handle existing shadow roots when upgrading (roeisenb@microsoft.com)
- fix: enable safer type inference on the repeat helper (roeisenb@microsoft.com)
- Set prerelease version (nicholasrice@users.noreply.github.com)
- refactor: separate update queue from DOM and fix architectural layers (roeisenb@microsoft.com)
- feat: aspected html directive exposes metadata (roeisenb@microsoft.com)
- `HTMLDirective` - The `targetIndex: number` property has been replaced by a `targetId: string` property. The `createBehavior` method no longer takes a target `Node` but instead takes a `BehaviorTargets` instance. The actual target can be looked up on the `BehaviorTargets` instance by indexing with the `targetId` property. (roeisenb@microsoft.com)
- `compileTemplate()` - Internals have been significantly changed. The implementation no longer uses a TreeWalker. The return type has change to an `HTMLTemplateCompilationResult` with different properties. (roeisenb@microsoft.com)
- refactor: move template/style resolution to lazy getter (roeisenb@microsoft.com)
- refactor: enable pluggable template compiler for SSR scenarios (roeisenb@microsoft.com)
- feat: enable pluggable style handling strategies (roeisenb@microsoft.com)
- fix(fast-element): do not notify splices for changes pre-subscription (roeisenb@microsoft.com)
- feat: new directive registration/identification model (roeisenb@microsoft.com)
- fix: prevent duplicative array observation patch (roeisenb@microsoft.com)
- Adds Aspect as public export (nicholasrice@users.noreply.github.com)
- feat: expose official Markup and Parser APIs (roeisenb@microsoft.com)
- refactor: refine binding mode types (roeisenb@microsoft.com)
- feat: add two-way binding (roeisenb@microsoft.com)
- fix: defend against for/in use on arrays (roeisenb@microsoft.com)
- fix: merge bug related to moved APIs (roeisenb@microsoft.com)
- feat: enable multiple instances of fast-element on a page at once (roeisenb@microsoft.com)
- Upgrade TypeScript (nicholasrice@users.noreply.github.com)
- enumerate fast-element package as a ES module package (nicholasrice@users.noreply.github.com)
- feat: enable array length observation (roeisenb@microsoft.com)
- feat: add utilities and hooks, and change exports (roeisenb@microsoft.com)
- refactor: new design for execution context (roeisenb@microsoft.com)
- chore: fast-element package and build modernization (roeisenb@microsoft.com)
- feat: new CSSDirective design (roeisenb@microsoft.com)
- chore: configure fast-element for internal stripping (roeisenb@microsoft.com)
- feat: enable synchronous dom updates for SSR (roeisenb@microsoft.com)
- refactor: extract polyfill and polyfill-like code to an optional module (roeisenb@microsoft.com)
- feat: add warn/error message infrastructure (roeisenb@microsoft.com)
- `View` and `HTMLView` - Type parameters added to enable strongly typed views based on their data source. The constructor of `HTMLView` has a new signature based on changes to the compiler's output. Internals have been cleaned up and no longer rely on the Range type. (roeisenb@microsoft.com)
- `ElementViewTemplate`, `SyntheticViewTemplate`, and `ViewTemplate` - Added type parameters throughout. Logic to instantiate and apply behaviors moved out of the template and into the view where it can be lazily executed. Removed the ability of the `render` method to take a string id of the node to render to. You must provide a node. (roeisenb@microsoft.com)

## 1.10.2

Tue, 24 May 2022 07:10:02 GMT

### Patches

- fix(fast-element): do not notify splices for changes pre-subscription (roeisenb@microsoft.com)

## 1.10.1

Tue, 03 May 2022 07:15:44 GMT

### Patches

- Upgraded api-extractor (44823142+williamw2@users.noreply.github.com)

## 1.10.0

Wed, 27 Apr 2022 07:21:09 GMT

### Minor changes

- update to typescript 4.6.2 and update ARIAMixin typings (chhol@microsoft.com)

## 1.9.0

Wed, 06 Apr 2022 07:12:42 GMT

### Minor changes

- convert fast-element to type:module (nicholasrice@users.noreply.github.com)

## 1.8.0

Tue, 08 Mar 2022 07:12:45 GMT

### Minor changes

- feat: enable multiple fast-element instances in browser at once (roeisenb@microsoft.com)

## 1.7.2

Fri, 25 Feb 2022 17:09:32 GMT

### Patches

- fix: defend against for/in use on arrays (roeisenb@microsoft.com)

## 1.7.1

Thu, 24 Feb 2022 22:21:55 GMT

### Patches

- fix: prevent duplicative array observation patch (roeisenb@microsoft.com)

## 1.7.0

Sun, 23 Jan 2022 07:13:56 GMT

### Minor changes

- add recyle option to repeat directive (scomea@microsoft.com)

## 1.6.2

Sun, 31 Oct 2021 07:17:45 GMT

### Patches

- update fast eslint package version (chhol@microsoft.com)

## 1.6.1

Wed, 13 Oct 2021 22:45:16 GMT

### Patches

- build(fast-element): exclude empty js files from esm index.js (markwhitfeld@users.noreply.github.com)

## 1.6.0

Fri, 08 Oct 2021 19:53:11 GMT

### Minor changes

- feat(fast-element): expose a method for processing the update queue (roeisenb@microsoft.com)

## 1.5.1

Wed, 08 Sep 2021 07:16:17 GMT

### Patches

- perf(Controller): reduce object allocation needed for isConnected prop (roeisenb@microsoft.com)

## 1.5.0

Fri, 27 Aug 2021 14:14:26 GMT

### Minor changes

- Adds capability to Observable to subscribe to any observable property change for an object (nicholasrice@users.noreply.github.com)
- ensure HTMLStyleElement DOM order matches call addStylesTo() call order (nicholasrice@users.noreply.github.com)

## 1.4.2

Thu, 26 Aug 2021 07:17:43 GMT

### Patches

- feat(fast-element): make the task queue resilient to task exceptions (roeisenb@microsoft.com)

## 1.4.1

Wed, 28 Jul 2021 07:17:22 GMT

### Patches

- implement patch to work around Angular optimization bug (nicholasrice@users.noreply.github.com)

## 1.4.0

Fri, 21 May 2021 17:48:08 GMT

### Minor changes

- Add cssPartial template function to facilitate partial CSS abstractions. (nicholasrice@users.noreply.github.com)

## 1.3.0

Wed, 19 May 2021 23:37:36 GMT

### Minor changes

- undefined (nicholasrice@users.noreply.github.com)
- fix: ensure that custom events are cancelable by default (roeisenb@microsoft.com)
- perf: improve startup time and reduce library size (roeisenb@microsoft.com)

## [1.0.2](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@1.0.1...@microsoft/fast-element@1.0.2) (2021-04-06)


### Bug Fixes

* ensures proper re-observation and notification of a disconnected BindingObserver ([#4477](https://github.com/Microsoft/fast/issues/4477)) ([e315a69](https://github.com/Microsoft/fast/commit/e315a69ac7cf22bd9e0c50eb0458f5b23dae2aee))





## [1.0.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@1.0.0...@microsoft/fast-element@1.0.1) (2021-03-16)


### Bug Fixes

* ensure embedded templates dispose correctly ([#4432](https://github.com/Microsoft/fast/issues/4432)) ([cb8ae10](https://github.com/Microsoft/fast/commit/cb8ae10c0e84efe510d465525dd2dadae0dfb232))





# [1.0.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.22.2...@microsoft/fast-element@1.0.0) (2021-03-06)


* refactor(fast-element)!: rename Directive, disambiguate types, and reorganize (#4414) ([a96d364](https://github.com/Microsoft/fast/commit/a96d364af74524cb40cf8a8dfe220e4fe3c1e75a)), closes [#4414](https://github.com/Microsoft/fast/issues/4414)


### Features

* adds CSSDirective for use with the css tagged template literal ([#4383](https://github.com/Microsoft/fast/issues/4383)) ([6928afa](https://github.com/Microsoft/fast/commit/6928afae5b3734997bc8065b16c000e4965542d1))


### BREAKING CHANGES

* rename Directive and other types to disambiguate





## [0.22.2](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.22.0...@microsoft/fast-element@0.22.2) (2021-02-08)

**Note:** Version bump only for package @microsoft/fast-element





## [0.22.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.22.0...@microsoft/fast-element@0.22.1) (2021-02-08)

**Note:** Version bump only for package @microsoft/fast-element





# [0.22.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.21.1...@microsoft/fast-element@0.22.0) (2021-01-30)


### Bug Fixes

* increase sophistication of behavior binding and unbinding ([#4288](https://github.com/Microsoft/fast/issues/4288)) ([9c24ee6](https://github.com/Microsoft/fast/commit/9c24ee6f865673cfa8f32ae5141f139484d79f73))
* **repeat:** observe arrays after unbound then rebound ([#4211](https://github.com/Microsoft/fast/issues/4211)) ([cec8e69](https://github.com/Microsoft/fast/commit/cec8e69d3b72b672605bf3f77a702ca0d6ba1a5b))


### Features

* add support for attachment test to ElementStyles ([#4289](https://github.com/Microsoft/fast/issues/4289)) ([df6f765](https://github.com/Microsoft/fast/commit/df6f7652083ea71e3419976281ee393744606018))





## [0.21.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.21.0...@microsoft/fast-element@0.21.1) (2020-12-16)

**Note:** Version bump only for package @microsoft/fast-element





# [0.21.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.20.0...@microsoft/fast-element@0.21.0) (2020-12-02)


### Features

* add default slot change method ([#4148](https://github.com/Microsoft/fast/issues/4148)) ([5e9fb05](https://github.com/Microsoft/fast/commit/5e9fb0590833fe89d0a12132abdc0e88f64fbbcb))





# [0.20.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.19.1...@microsoft/fast-element@0.20.0) (2020-11-19)


### Bug Fixes

* **fast-element:** ensure all nodes removed in repeat when array emptied ([#4073](https://github.com/Microsoft/fast/issues/4073)) ([cacfefe](https://github.com/Microsoft/fast/commit/cacfefe78de27f19b7774af338bed27513437623))
* **fast-element:** remove mergeSplice array length cache ([#4067](https://github.com/Microsoft/fast/issues/4067)) ([751eef8](https://github.com/Microsoft/fast/commit/751eef8ae070a20741a412b22371a46efb1e2b86))


### Features

* add select component ([#4074](https://github.com/Microsoft/fast/issues/4074)) ([6984027](https://github.com/Microsoft/fast/commit/698402773e77b2766e995770b0d34c6d129e2ec3))
* convert FormAssociated to a constructable function ([#4115](https://github.com/Microsoft/fast/issues/4115)) ([da8d54b](https://github.com/Microsoft/fast/commit/da8d54b5a057812622471e1261200b8f9b290d12))
* makes Controller.isConnected an observable property ([#4093](https://github.com/Microsoft/fast/issues/4093)) ([3d49aa2](https://github.com/Microsoft/fast/commit/3d49aa290bc7ea04a90038529d34b884ed053cbc))
* **fast-element:** introduce NamedTargetDirective for extensibility ([#4079](https://github.com/Microsoft/fast/issues/4079)) ([c93bc26](https://github.com/Microsoft/fast/commit/c93bc26c1fa438d86d049e6e0d8a09c65fda5781))
* support HTMLStyleElement from Controller.addStyles and Controller.removeStyles ([#4043](https://github.com/Microsoft/fast/issues/4043)) ([cf20187](https://github.com/Microsoft/fast/commit/cf201871838479593b3377d667643a409418dad2))





## [0.19.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.19.0...@microsoft/fast-element@0.19.1) (2020-10-14)

**Note:** Version bump only for package @microsoft/fast-element





# [0.19.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.18.0...@microsoft/fast-element@0.19.0) (2020-09-28)


### Bug Fixes

* **fast-element:** enable subtree observation in the children decorator ([#3945](https://github.com/Microsoft/fast/issues/3945)) ([c69c7d9](https://github.com/Microsoft/fast/commit/c69c7d977d33a706721ea1546cf8d045aade99da))


### Features

* **fast-element:** enable parent context references in repeat scenarios ([#3948](https://github.com/Microsoft/fast/issues/3948)) ([0b2234b](https://github.com/Microsoft/fast/commit/0b2234b93d5cd2387cc5466a5c88ff632d265aac))





# [0.18.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.17.0...@microsoft/fast-element@0.18.0) (2020-09-10)


### Bug Fixes

* **fast-element:** better global support for older browsers ([#3864](https://github.com/Microsoft/fast/issues/3864)) ([61e85d8](https://github.com/Microsoft/fast/commit/61e85d85553ea1ea6bf128bc8add434d0e4d98aa))
* **fast-element:** workaround for adoptedStyleSheets Chromium bug ([#3838](https://github.com/Microsoft/fast/issues/3838)) ([1b6570a](https://github.com/Microsoft/fast/commit/1b6570ae6a00c740320b8f1748676f0bed50b67d))


### Features

* **fast-element:** enable custom element to accept a styles array ([#3871](https://github.com/Microsoft/fast/issues/3871)) ([ae611a9](https://github.com/Microsoft/fast/commit/ae611a960af7d2bcab8f30de984582c7a2c09deb))





# [0.17.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.16.0...@microsoft/fast-element@0.17.0) (2020-08-27)


### Bug Fixes

* **fast-element:** add globalThis polyfill to fix trustedTypes polyfill ([#3797](https://github.com/Microsoft/fast/issues/3797)) ([e848800](https://github.com/Microsoft/fast/commit/e84880048d857f1f6806753bd0cf68361b86b2ef))
* **fast-element:** do not remove user comments when compiling templates ([#3786](https://github.com/Microsoft/fast/issues/3786)) ([0478709](https://github.com/Microsoft/fast/commit/0478709d76bc8187aeaa28d022708cda12559419))
* **fast-element:** observable callbacks on sub-classes should be invoked ([#3768](https://github.com/Microsoft/fast/issues/3768)) ([969d5dd](https://github.com/Microsoft/fast/commit/969d5ddeb6698208ba279742022fb5f2e7f96c18))


### Features

* **fast-element:** improve trustedTypes to not use globalThis ([#3784](https://github.com/Microsoft/fast/issues/3784)) ([5eca0a8](https://github.com/Microsoft/fast/commit/5eca0a8dbe23a98a066d3c148c2c98ead29fca10))





# [0.16.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.15.2...@microsoft/fast-element@0.16.0) (2020-08-13)


### Bug Fixes

* use higher bits for DOM marker ([#3649](https://github.com/Microsoft/fast/issues/3649)) ([2d1acd8](https://github.com/Microsoft/fast/commit/2d1acd8622aba481bfa3dad5340f8d045dfaef9a))


### Features

* **fast-element:** move template instance timing and enable dynamic templates and styles ([#3621](https://github.com/Microsoft/fast/issues/3621)) ([2e73088](https://github.com/Microsoft/fast/commit/2e730885a485febfbc2b993040f039ef4b85b4ec))





## [0.15.2](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.15.1...@microsoft/fast-element@0.15.2) (2020-07-31)

**Note:** Version bump only for package @microsoft/fast-element





## [0.15.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.15.0...@microsoft/fast-element@0.15.1) (2020-07-23)


### Bug Fixes

* rollup minify selectors should retain spaces ([#3524](https://github.com/Microsoft/fast/issues/3524)) ([cbdfc45](https://github.com/Microsoft/fast/commit/cbdfc45c2543fe9f94e0edc7687cc9f04a38e118))





# [0.15.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.14.0...@microsoft/fast-element@0.15.0) (2020-07-14)


### Bug Fixes

* **fast-element:** style element styles should work with the document ([#3489](https://github.com/Microsoft/fast/issues/3489)) ([d288390](https://github.com/Microsoft/fast/commit/d28839059313f5bab9eabeb561dc50b64ca8340f))


### Features

* simplify rollup configs and compress tagged template literals ([#3452](https://github.com/Microsoft/fast/issues/3452)) ([7533e92](https://github.com/Microsoft/fast/commit/7533e927f2467dd6f8dd46c1d3cef6c0df773fc4))
* update typescript version and remove utility types dependencies for react packages ([#3422](https://github.com/Microsoft/fast/issues/3422)) ([09d07b5](https://github.com/Microsoft/fast/commit/09d07b580cda3bcc5d28f83d3568521f710c9576))





# [0.14.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.13.0...@microsoft/fast-element@0.14.0) (2020-07-02)


### Bug Fixes

* **fast-element:** do not notify when binding observer is disconnected ([#3418](https://github.com/Microsoft/fast/issues/3418)) ([dbf3093](https://github.com/Microsoft/fast/commit/dbf3093ddf3e45295c67e1b63260a9d68bf2f307))


### Features

* **fast-element:** support bindings and observables with volatile dependencies ([#3402](https://github.com/Microsoft/fast/issues/3402)) ([a00a907](https://github.com/Microsoft/fast/commit/a00a9070de4f454f477bfa1feada9cacc9b10284))





# [0.13.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.12.0...@microsoft/fast-element@0.13.0) (2020-06-26)


### Bug Fixes

* **fast-element:** default event handler behavior should be no capture ([#3337](https://github.com/Microsoft/fast/issues/3337)) ([a59e4df](https://github.com/Microsoft/fast/commit/a59e4df10457ff84cba0697cc8f1649c136ac848))
* **fast-element:** export missing elements filter helper ([#3331](https://github.com/Microsoft/fast/issues/3331)) ([46de565](https://github.com/Microsoft/fast/commit/46de5652508092a37a83c17c99be0ca2e3653589))


### Features

* **fast-element:** enable CSSStyleSheet and string to be used as styles ([#3345](https://github.com/Microsoft/fast/issues/3345)) ([70e2f7f](https://github.com/Microsoft/fast/commit/70e2f7f0fc33d658b9e52eb50c9dc1af26816515))
* **fast-element:** expand element filter to support selectors ([#3374](https://github.com/Microsoft/fast/issues/3374)) ([f275366](https://github.com/Microsoft/fast/commit/f2753668fe6e9981c1de9280e6edeaab37de25d6))





# [0.12.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.11.0...@microsoft/fast-element@0.12.0) (2020-06-17)


### Features

* **fast-element:** enable children and slotted filters ([#3323](https://github.com/Microsoft/fast/issues/3323)) ([224df54](https://github.com/Microsoft/fast/commit/224df5474c2ee4a6f2c1582204f8947e65a931dc))





# [0.11.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.10.2...@microsoft/fast-element@0.11.0) (2020-06-15)


### Bug Fixes

* correct anchor and button stylesheets ([#3308](https://github.com/Microsoft/fast/issues/3308)) ([78feda2](https://github.com/Microsoft/fast/commit/78feda2460f814c7995f0168a5180bfe54913a5b))
* **fast-element:** generalize value converter and move out of beta ([#3267](https://github.com/Microsoft/fast/issues/3267)) ([14706c9](https://github.com/Microsoft/fast/commit/14706c9582596e240a201dfc284b37f285c35fed))
* **fast-element:** seal the default execution context ([#3268](https://github.com/Microsoft/fast/issues/3268)) ([131cacb](https://github.com/Microsoft/fast/commit/131cacbb21db77ba3efcf0791eeff7e11b4960aa))
* corrects behavior of style removal ([#3261](https://github.com/Microsoft/fast/issues/3261)) ([e37b7ab](https://github.com/Microsoft/fast/commit/e37b7abb911124992bf5fd595ea66cd7459e8bf8))


### Features

* **fast-element:** enable repeat template binding ([#3287](https://github.com/Microsoft/fast/issues/3287)) ([00129bc](https://github.com/Microsoft/fast/commit/00129bc9262c5de04df92b421793257d3be9f2d6))





## [0.10.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.10.0...@microsoft/fast-element@0.10.1) (2020-06-09)

**Note:** Version bump only for package @microsoft/fast-element





# [0.10.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.9.0...@microsoft/fast-element@0.10.0) (2020-06-05)


### Features

* **fast-element:** add content composition ([#3182](https://github.com/Microsoft/fast/issues/3182)) ([26c59ea](https://github.com/Microsoft/fast/commit/26c59ead7829f9e54f827811cd6aabfb92d0391b))
* **website:**  new docusaurus v2 setup with launch toc configuration ([#3159](https://github.com/Microsoft/fast/issues/3159)) ([f12ba16](https://github.com/Microsoft/fast/commit/f12ba1687bb46fd3f6717790b1687b441363671e))





# [0.9.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.8.1...@microsoft/fast-element@0.9.0) (2020-05-18)


### Bug Fixes

* **fast-element:** every third subscriber not registered ([#3086](https://github.com/Microsoft/fast/issues/3086)) ([bd26083](https://github.com/Microsoft/fast/commit/bd2608379d38da62cfe3b6d6d02e6925a8652125))
* **fast-element:** html helper should handle literal and directive interpolated together ([#3106](https://github.com/Microsoft/fast/issues/3106)) ([627f06c](https://github.com/Microsoft/fast/commit/627f06c899f2e308fa402148f1130995f6fb0fb8))
* add exports that were removed during circular reference refactor [#3038](https://github.com/Microsoft/fast/issues/3038) ([eb1cb91](https://github.com/Microsoft/fast/commit/eb1cb91fb545acf5e88e1280ebde5b15cc80bca3))


### Features

* **fast-element:** more granular content compilation with tests ([#3127](https://github.com/Microsoft/fast/issues/3127)) ([c96fef2](https://github.com/Microsoft/fast/commit/c96fef26ee8397866050c3785cdb958105535ea9))
* **web-components:** new build/test/docs setup ([#3156](https://github.com/Microsoft/fast/issues/3156)) ([51d909a](https://github.com/Microsoft/fast/commit/51d909ad6a616cb63f7c62defe1ee1f3d2abaf02))





## [0.8.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.8.0...@microsoft/fast-element@0.8.1) (2020-04-29)


### Bug Fixes

* removes circular dependencies from web-component packages ([#3037](https://github.com/Microsoft/fast/issues/3037)) ([0f84942](https://github.com/Microsoft/fast/commit/0f849429ca930bcea474e6e4f73f1f8e21248a0f))





# [0.8.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.7.0...@microsoft/fast-element@0.8.0) (2020-04-27)


### Bug Fixes

* **fast-element:** attr bindings preserved during upgrade ([#3010](https://github.com/Microsoft/fast/issues/3010)) ([e9b14cc](https://github.com/Microsoft/fast/commit/e9b14ccf70efa7eac4b055d7a34fc4e2d775fa0c))


### Features

* **fast-element:** add a render method to templates for pure templating ([#3018](https://github.com/Microsoft/fast/issues/3018)) ([c4ac6b2](https://github.com/Microsoft/fast/commit/c4ac6b2a20d67992d5d820e9ae56eb75db7e2e3a))





# [0.7.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.6.0...@microsoft/fast-element@0.7.0) (2020-04-22)


### Bug Fixes

* **fast-element:** remove unnecessary references ([#2966](https://github.com/Microsoft/fast/issues/2966)) ([5b724c2](https://github.com/Microsoft/fast/commit/5b724c21476a1abbc3c52b15bdb790565d43d60d))
* align Fast to FAST ([#2950](https://github.com/Microsoft/fast/issues/2950)) ([94c8744](https://github.com/Microsoft/fast/commit/94c874455eccbb8609715c7fa96095a226428813))


### Features

* **fast-element:** add functioning execution context ([#2935](https://github.com/Microsoft/fast/issues/2935)) ([707d4e7](https://github.com/Microsoft/fast/commit/707d4e7ef3b7bee5b77f4b63b1c71666bbb2bd02))
* **fast-element:** safe class binding ([#2957](https://github.com/Microsoft/fast/issues/2957)) ([e06d73c](https://github.com/Microsoft/fast/commit/e06d73cc2c819bd0683e24a6bd7631beac4a2390))





# [0.6.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.5.0...@microsoft/fast-element@0.6.0) (2020-04-10)


### Bug Fixes

* **fast-element:** always reflect latest value to attribute ([#2903](https://github.com/Microsoft/fast/issues/2903)) ([48cca59](https://github.com/Microsoft/fast/commit/48cca5923c571c4df697e3501cb879125d3a79eb))
* **fast-element:** batch attr reflect ([#2885](https://github.com/Microsoft/fast/issues/2885)) ([e863752](https://github.com/Microsoft/fast/commit/e8637528fa0ef162cbf166738bd4a2e519422efe))
* **fast-element:** ensure node exists when checking if it's a marker ([#2876](https://github.com/Microsoft/fast/issues/2876)) ([ae656b8](https://github.com/Microsoft/fast/commit/ae656b860c66557700ca1bbf1989fbd8ef7da689))
* **fast-element:** only use Range for batch disposal ([#2901](https://github.com/Microsoft/fast/issues/2901)) ([7e5bf5c](https://github.com/Microsoft/fast/commit/7e5bf5c438fcd53c44b096dc5b52d1449a3368fe))
* **fast-element:** preserve observable values from before upgrade ([#2889](https://github.com/Microsoft/fast/issues/2889)) ([d84884a](https://github.com/Microsoft/fast/commit/d84884afc8bf023b16dde47e81833026e8605018))


### Features

* **fast-element:** add directives for children and slotted references ([#2896](https://github.com/Microsoft/fast/issues/2896)) ([5dc8911](https://github.com/Microsoft/fast/commit/5dc8911868841425079123c7b5c48da937891362))
* **fast-element:** add multi property binding support ([#2911](https://github.com/Microsoft/fast/issues/2911)) ([46049ea](https://github.com/Microsoft/fast/commit/46049ea73f7b63452229746c6dda52e369bf1c8d))
* design system provider and recipe implementation ([#2860](https://github.com/Microsoft/fast/issues/2860)) ([8c04e15](https://github.com/Microsoft/fast/commit/8c04e15a3d1809210891643e97686635b36e5a0f))





# [0.5.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.4.0...@microsoft/fast-element@0.5.0) (2020-04-02)


### Features

* **fast-element:** add trusted types for HTML ([#2855](https://github.com/Microsoft/fast/issues/2855)) ([69d44a2](https://github.com/Microsoft/fast/commit/69d44a289ce6ca43a7f536edb600af61f453728f))





# [0.4.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.3.1...@microsoft/fast-element@0.4.0) (2020-03-30)


### Bug Fixes

* attribute bindings in fast components ([#2847](https://github.com/Microsoft/fast/issues/2847)) ([0d25806](https://github.com/Microsoft/fast/commit/0d25806360b987a3f3c3a69dc5dd005415f70795))
* **fast-element:** ensure host attributes have a target name ([#2846](https://github.com/Microsoft/fast/issues/2846)) ([4bd99c9](https://github.com/Microsoft/fast/commit/4bd99c91279d5abf642e73b10acf0459fc9035c8))


### Features

* **fast-element:** attribute/property binding revamp ([#2843](https://github.com/Microsoft/fast/issues/2843)) ([ffe7a57](https://github.com/Microsoft/fast/commit/ffe7a57a7978868d28f583de3a3b254904ba3db5))
* add progress web component ([#2828](https://github.com/Microsoft/fast/issues/2828)) ([5f2be52](https://github.com/Microsoft/fast/commit/5f2be52738396aa1985a49eac667bd6e397abfa7))





## [0.3.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.3.0...@microsoft/fast-element@0.3.1) (2020-03-25)


### Bug Fixes

* **fast-element:** add docs and ensure boolean attrs true when empty ([#2833](https://github.com/Microsoft/fast/issues/2833)) ([4bf2c41](https://github.com/Microsoft/fast/commit/4bf2c41efb4520152fe041fb3e67eaf31fbe8e66))





# [0.3.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.2.1...@microsoft/fast-element@0.3.0) (2020-03-25)


### Bug Fixes

* **fast-element:** type fixes, api docs, and one op order correction ([#2810](https://github.com/Microsoft/fast/issues/2810)) ([0548e89](https://github.com/Microsoft/fast/commit/0548e89b64d7081b0024434dd6bbaf5fb3ca8366))
* **view:** ensure first/last child correct after removing view ([#2819](https://github.com/Microsoft/fast/issues/2819)) ([7d82ddc](https://github.com/Microsoft/fast/commit/7d82ddc161fd519cb44db1ae6e0b7aa403b58806))


### Features

* **fast-element:** boolean attributes and type conversion ([#2829](https://github.com/Microsoft/fast/issues/2829)) ([03f64cd](https://github.com/Microsoft/fast/commit/03f64cd890e764fd72363993fae3724d9da647ff))


### Performance Improvements

* **fast-element:** optimize view removal and disposal ([#2806](https://github.com/Microsoft/fast/issues/2806)) ([59cc3be](https://github.com/Microsoft/fast/commit/59cc3becd5f188e6d6122f5dff2a8a163dc075dc))





## [0.2.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.2.0...@microsoft/fast-element@0.2.1) (2020-03-18)

**Note:** Version bump only for package @microsoft/fast-element





# [0.2.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-element@0.1.0...@microsoft/fast-element@0.2.0) (2020-03-13)


### Bug Fixes

* **fast-element:** undefined/null should remove the html attribute ([#2749](https://github.com/Microsoft/fast/issues/2749)) ([82dbf74](https://github.com/Microsoft/fast/commit/82dbf74))


### Features

* **fast-element:** attached behaviors ([#2784](https://github.com/Microsoft/fast/issues/2784)) ([170eed7](https://github.com/Microsoft/fast/commit/170eed7))
* **fast-element:** base shadow and element options on defaults ([#2782](https://github.com/Microsoft/fast/issues/2782)) ([73fabda](https://github.com/Microsoft/fast/commit/73fabda))
* **fast-element:** enable host instructions ([#2760](https://github.com/Microsoft/fast/issues/2760)) ([8675585](https://github.com/Microsoft/fast/commit/8675585))
* **fast-element:** streamline custom event emit ([#2777](https://github.com/Microsoft/fast/issues/2777)) ([b3250ec](https://github.com/Microsoft/fast/commit/b3250ec))
* export when from the root of fast-element ([#2739](https://github.com/Microsoft/fast/issues/2739)) ([3e290d3](https://github.com/Microsoft/fast/commit/3e290d3))
* **fast-element:** simpler element definition without decorators ([#2730](https://github.com/Microsoft/fast/issues/2730)) ([d89e9ca](https://github.com/Microsoft/fast/commit/d89e9ca))


### Performance Improvements

* **fast-element:** simplify expressions ([#2755](https://github.com/Microsoft/fast/issues/2755)) ([e1c2bfa](https://github.com/Microsoft/fast/commit/e1c2bfa))





# 0.1.0 (2020-02-28)


### Bug Fixes

* **fast-element:** prevent duplicate subscription and queuing ([#2678](https://github.com/Microsoft/fast/issues/2678)) ([99a24d8](https://github.com/Microsoft/fast/commit/99a24d8))


### Features

* **fast-element:** add initial source from prototype ([#2675](https://github.com/Microsoft/fast/issues/2675)) ([f8c3226](https://github.com/Microsoft/fast/commit/f8c3226))


### Performance Improvements

* **fast-element:** improve subscribe/unsubscribe by reducing alloc ([#2679](https://github.com/Microsoft/fast/issues/2679)) ([1957c6f](https://github.com/Microsoft/fast/commit/1957c6f))
* **fast-element:** improve synthetic view creation speed ([#2680](https://github.com/Microsoft/fast/issues/2680)) ([2e2b549](https://github.com/Microsoft/fast/commit/2e2b549))
* **fast-element:** new strategy for array observation and repeat ([#2684](https://github.com/Microsoft/fast/issues/2684)) ([6f2f272](https://github.com/Microsoft/fast/commit/6f2f272))
