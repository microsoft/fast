# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
