# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.3.0...@microsoft/fast-foundation@1.4.0) (2020-07-14)


### Bug Fixes

* correct spelling of aria-labelledby in tabs ([#3463](https://github.com/Microsoft/fast/issues/3463)) ([c0385d9](https://github.com/Microsoft/fast/commit/c0385d97ec56ef8aef27047f6011261c2484a99d))
* correct web component menu keyboarding and aria-expanded ([#3496](https://github.com/Microsoft/fast/issues/3496)) ([0530a42](https://github.com/Microsoft/fast/commit/0530a4230946d2aee39861001f3deea3b8816038))
* move setAttribute calls for proxy elements to connectedCallback ([#3494](https://github.com/Microsoft/fast/issues/3494)) ([cdaf0ba](https://github.com/Microsoft/fast/commit/cdaf0bae4de3c995611e2e02313cc19e8e259b27))
* reflect aria-hidden attribute in the DOM for the flipper component ([#3468](https://github.com/Microsoft/fast/issues/3468)) ([2f7b897](https://github.com/Microsoft/fast/commit/2f7b8977f4d5ea3173a70f719706155831bfa1bd))
* removing un-needed nbsp; in slider-label and radio-group templates ([#3506](https://github.com/Microsoft/fast/issues/3506)) ([7cd003e](https://github.com/Microsoft/fast/commit/7cd003e5877d34ad926ee8268852176158cafc4b))


### Features

* adds mixin to support global aria-* attributes for components delegating focus ([#3470](https://github.com/Microsoft/fast/issues/3470)) ([054c890](https://github.com/Microsoft/fast/commit/054c89000d8931d9e203cb7f831c1e7f11c9038a))
* export MatchMediaStylesheetBehavior constructor ([#3445](https://github.com/Microsoft/fast/issues/3445)) ([ffc59f8](https://github.com/Microsoft/fast/commit/ffc59f80166768550bf2488cd8b66e2d6b55b503))
* move appearance attributes of anchor and button out of fast-foundation ([#3420](https://github.com/Microsoft/fast/issues/3420)) ([069e1ee](https://github.com/Microsoft/fast/commit/069e1ee000fc2f8e184919b16df0cb84bc610838))
* simplify rollup configs and compress tagged template literals ([#3452](https://github.com/Microsoft/fast/issues/3452)) ([7533e92](https://github.com/Microsoft/fast/commit/7533e927f2467dd6f8dd46c1d3cef6c0df773fc4))
* update typescript version and remove utility types dependencies for react packages ([#3422](https://github.com/Microsoft/fast/issues/3422)) ([09d07b5](https://github.com/Microsoft/fast/commit/09d07b580cda3bcc5d28f83d3568521f710c9576))





# [1.3.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.2.2...@microsoft/fast-foundation@1.3.0) (2020-07-02)


### Bug Fixes

* slider thumb does not respond to touch events, vertical sliders track parameters incorrect after scrolling page ([#3414](https://github.com/Microsoft/fast/issues/3414)) ([02f9ac4](https://github.com/Microsoft/fast/commit/02f9ac4306031aab1702e98083effc0ce858dec5))


### Features

* add tree-vew and tree-item components ([#3240](https://github.com/Microsoft/fast/issues/3240)) ([57eaa83](https://github.com/Microsoft/fast/commit/57eaa83293358383d03cbd3c5b6a9e6ffa797254))
* make tabs adjust method public ([#3426](https://github.com/Microsoft/fast/issues/3426)) ([0dd2a5e](https://github.com/Microsoft/fast/commit/0dd2a5e016fd032b0a51ab441d3b3977220cf073))





## [1.2.2](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.2.1...@microsoft/fast-foundation@1.2.2) (2020-06-26)


### Bug Fixes

* selected tab becoming undefined when tab slot pass anything except icon or text node ([#3350](https://github.com/Microsoft/fast/issues/3350)) ([eda1aef](https://github.com/Microsoft/fast/commit/eda1aef79aeb612b05ea73b3861a93f5241c382f))





## [1.2.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.2.0...@microsoft/fast-foundation@1.2.1) (2020-06-17)

**Note:** Version bump only for package @microsoft/fast-foundation





# [1.2.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.1.2...@microsoft/fast-foundation@1.2.0) (2020-06-15)


### Bug Fixes

* correct css part name for dialog component ([#3260](https://github.com/Microsoft/fast/issues/3260)) ([62eff11](https://github.com/Microsoft/fast/commit/62eff11685248f6e686eb761d2614f1f4a70d20e))
* ensure all component internals have part names ([#3306](https://github.com/Microsoft/fast/issues/3306)) ([95360a7](https://github.com/Microsoft/fast/commit/95360a76ccb4ec40b2623dc01b55ea123d522b62))


### Features

* add live code examples to docs site ([#3216](https://github.com/Microsoft/fast/issues/3216)) ([763054f](https://github.com/Microsoft/fast/commit/763054f36433f9b87e620c0c8d03c229dcd8560f))
* design-system-provider now paints CSS color and background color ([#3278](https://github.com/Microsoft/fast/issues/3278)) ([8e97ac4](https://github.com/Microsoft/fast/commit/8e97ac4aae18c8b17b90e61e139ad3fb0b7f7c3d))
* provides access to the CSS variable created by CSSCustomProprtyBehaviors ([#3256](https://github.com/Microsoft/fast/issues/3256)) ([391f029](https://github.com/Microsoft/fast/commit/391f029da2d5a5502ee484af10aaef771d3c297c))





## [1.1.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.1.0...@microsoft/fast-foundation@1.1.1) (2020-06-09)


### Bug Fixes

* correct css part name for dialog component ([6e0c7a0](https://github.com/Microsoft/fast/commit/6e0c7a01fa3d28e0a725eb5e5bbc6462ca0b5d57))





# [1.1.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.0.0...@microsoft/fast-foundation@1.1.0) (2020-06-05)


### Bug Fixes

* children components not always added to the internal slotted radio control collection ([#3169](https://github.com/Microsoft/fast/issues/3169)) ([1d1ce86](https://github.com/Microsoft/fast/commit/1d1ce861f936800768b706de3b2175019c0cc18c))
* remove static class from start/end template ([#3225](https://github.com/Microsoft/fast/issues/3225)) ([ea6e790](https://github.com/Microsoft/fast/commit/ea6e7906ef621f1875e7e24e5b79a3ed33189e33))
* slider vertical navigation and value setting bugs ([#3176](https://github.com/Microsoft/fast/issues/3176)) ([f46d87d](https://github.com/Microsoft/fast/commit/f46d87d8d7dfe9101e0d1d8bec7d8a08097751bb))


### Features

* add accordion web component ([#3067](https://github.com/Microsoft/fast/issues/3067)) ([f551378](https://github.com/Microsoft/fast/commit/f55137803551711bef9eeb2c55c8d6f01a3eb74f))
* **fast-foundation:** add element test helper ([#3184](https://github.com/Microsoft/fast/issues/3184)) ([a27161d](https://github.com/Microsoft/fast/commit/a27161d38526a7fb8cb39fe9b0d4addeb0c9ad11))
* **website:**  new docusaurus v2 setup with launch toc configuration ([#3159](https://github.com/Microsoft/fast/issues/3159)) ([f12ba16](https://github.com/Microsoft/fast/commit/f12ba1687bb46fd3f6717790b1687b441363671e))





# 1.0.0 (2020-05-18)


### Bug Fixes

* replaces childNodes.length check with slotted ([#3130](https://github.com/Microsoft/fast/issues/3130)) ([b69d70c](https://github.com/Microsoft/fast/commit/b69d70c97d21660193c3cbcf9369b94135cfddb3))
* update decorator signature to align with customElement ([#3131](https://github.com/Microsoft/fast/issues/3131)) ([10256b5](https://github.com/Microsoft/fast/commit/10256b59acbdfecfaaa1617ecf29eebe2cff47e4))


### Features

* **web-components:** new build/test/docs setup ([#3156](https://github.com/Microsoft/fast/issues/3156)) ([51d909a](https://github.com/Microsoft/fast/commit/51d909ad6a616cb63f7c62defe1ee1f3d2abaf02))
* add fast-components-msft as a new package ([#3096](https://github.com/Microsoft/fast/issues/3096)) ([0515fff](https://github.com/Microsoft/fast/commit/0515fff5a1b7163e6f63f609e1efdba338e773c7))
* add fast-foundation as a new package ([#3122](https://github.com/Microsoft/fast/issues/3122)) ([322af95](https://github.com/Microsoft/fast/commit/322af95b7b7b33e7db3e0689647ac301ea5be2f1))
* update badge API and styles ([#3147](https://github.com/Microsoft/fast/issues/3147)) ([23eca38](https://github.com/Microsoft/fast/commit/23eca38c0c0ca4ac0d219315fcc1308e093f3363))
* wrap attr and observable into designSystemProperty decorator ([#3132](https://github.com/Microsoft/fast/issues/3132)) ([b6d4d59](https://github.com/Microsoft/fast/commit/b6d4d594d7d91e3588f1b461db1054ed0e4daf22))


### BREAKING CHANGES

* fundamentally changes and breaks the badge component API and styles
* breaks certain package exports
