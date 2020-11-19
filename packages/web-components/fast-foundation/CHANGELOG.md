# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.9.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.8.1...@microsoft/fast-foundation@1.9.0) (2020-11-19)


### Bug Fixes

* active indicator losing track if double click ([#4085](https://github.com/Microsoft/fast/issues/4085)) ([fcecc75](https://github.com/Microsoft/fast/commit/fcecc759ed1cdddd3a5c73d38514dfce7edf432d))
* active indicator no longer animating ([#4126](https://github.com/Microsoft/fast/issues/4126)) ([49e2608](https://github.com/Microsoft/fast/commit/49e26089c9275c5794af5d4e47427237363d333f))
* corrects ElementInternals feature detection ([#4087](https://github.com/Microsoft/fast/issues/4087)) ([58b3e54](https://github.com/Microsoft/fast/commit/58b3e540c77eafa95ade021fd90b184d6f929a50))
* ensure form elements reset when the parent form's reset() method is invoked. ([#4075](https://github.com/Microsoft/fast/issues/4075)) ([f19894e](https://github.com/Microsoft/fast/commit/f19894e746f0e1b7cffcce9d1269b9e6080f723a))
* ensure StyleElementCustomPropertyManager works with disconnected elements ([#4112](https://github.com/Microsoft/fast/issues/4112)) ([e903bfa](https://github.com/Microsoft/fast/commit/e903bfa38b3ce2e8689c4eef4b552d9e7f8a9b88))
* ensure tree items with children have a value for aria-expanded ([#4114](https://github.com/Microsoft/fast/issues/4114)) ([e7a7553](https://github.com/Microsoft/fast/commit/e7a7553c8e2fb205927d4d913de0d2790720ced7))
* fast-slider sets value to NaN if developer tools open ([#4033](https://github.com/Microsoft/fast/issues/4033)) ([35d6903](https://github.com/Microsoft/fast/commit/35d6903cdc73fb4c5283bdfc5dcb0955b09d9b4c))
* handle initially set value in FormAssociated ([#4047](https://github.com/Microsoft/fast/issues/4047)) ([bf7e874](https://github.com/Microsoft/fast/commit/bf7e87403883efcd438902bbfb43a74491a47b3f))
* move component options to independent modules ([#4048](https://github.com/Microsoft/fast/issues/4048)) ([f8a88a8](https://github.com/Microsoft/fast/commit/f8a88a8b14b2eee4dd26619f7927be73bea94277))
* revert radio to using class selector instead of attr, update slider-label to use internal styles for orientation ([#4108](https://github.com/Microsoft/fast/issues/4108)) ([c6ecedf](https://github.com/Microsoft/fast/commit/c6ecedf8427caf686bfebe89e78d2a6c2b7153f2))


### Features

* Add disabled attr to fast-tab ([#4013](https://github.com/Microsoft/fast/issues/4013)) ([caef4b1](https://github.com/Microsoft/fast/commit/caef4b15ce729ab1c1762bf0578edcf4d809351c)), closes [#4017](https://github.com/Microsoft/fast/issues/4017)
* add fast-breadcrumb and fast-breadcrumb-item web components ([#3627](https://github.com/Microsoft/fast/issues/3627)) ([e2e142c](https://github.com/Microsoft/fast/commit/e2e142c8ab91eb10906e74853f34afd5081ca12b))
* add select component ([#4074](https://github.com/Microsoft/fast/issues/4074)) ([6984027](https://github.com/Microsoft/fast/commit/698402773e77b2766e995770b0d34c6d129e2ec3))
* add show and hide methods to dialog ([#4030](https://github.com/Microsoft/fast/issues/4030)) ([00b69ff](https://github.com/Microsoft/fast/commit/00b69fff994035e769906563190cca86e3ae61f7))
* convert FormAssociated to a constructable function ([#4115](https://github.com/Microsoft/fast/issues/4115)) ([da8d54b](https://github.com/Microsoft/fast/commit/da8d54b5a057812622471e1261200b8f9b290d12))
* enable shared CSSStyleSheets in DesignSystemProvider ([#4065](https://github.com/Microsoft/fast/issues/4065)) ([5579c2e](https://github.com/Microsoft/fast/commit/5579c2ef424f8f63e00c8e29b5c4d43acb32c6db))





## [1.8.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.8.0...@microsoft/fast-foundation@1.8.1) (2020-10-14)


### Bug Fixes

* allow child radio buttons to be changed multiple times from javascript ([#3976](https://github.com/Microsoft/fast/issues/3976)) ([8ea7cc8](https://github.com/Microsoft/fast/commit/8ea7cc81cb34cf52d944136c9dc771fd03997bb1))
* corrects keyboard behavior of tree view and tree view item. ([#4003](https://github.com/Microsoft/fast/issues/4003)) ([9d80632](https://github.com/Microsoft/fast/commit/9d806322c632ddf6294bddd782f39ec6c0300798))
* designSystem property resolution behavior correction ([#4032](https://github.com/Microsoft/fast/issues/4032)) ([7e82cae](https://github.com/Microsoft/fast/commit/7e82caeb78c86898c38bd24d171d5ded8fc8473a))
* leverage FASTController.addStyles to attach css custom property target sheet ([#4031](https://github.com/Microsoft/fast/issues/4031)) ([2ca2ed0](https://github.com/Microsoft/fast/commit/2ca2ed075879f6e1ec04d0ee2753cbf23dcaff9f))
* tabs directional arrow key bug ([#3986](https://github.com/Microsoft/fast/issues/3986)) ([2d797a5](https://github.com/Microsoft/fast/commit/2d797a525eafd163aa9cba59823bc76d6b5b7d1f))





# [1.8.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.7.2...@microsoft/fast-foundation@1.8.0) (2020-09-28)


### Bug Fixes

* active id should update selected tab ([#3931](https://github.com/Microsoft/fast/issues/3931)) ([ff956ba](https://github.com/Microsoft/fast/commit/ff956ba15c7b4078e1a38283d1d45f763d761940))
* adds constraint validation to all form-associated elements ([#3932](https://github.com/Microsoft/fast/issues/3932)) ([60fbec0](https://github.com/Microsoft/fast/commit/60fbec074d94606951311a2db4feff93a96a11e1))
* aria attributes for slider should have explicit values ([#3915](https://github.com/Microsoft/fast/issues/3915)) ([8335702](https://github.com/Microsoft/fast/commit/8335702e28295e216fb7c673457a09285a388be4))
* click does not uncheck radio if it was already checked ([#3888](https://github.com/Microsoft/fast/issues/3888)) ([989c785](https://github.com/Microsoft/fast/commit/989c7856fe5a8233a4744627d1710f0dd0467b69))
* ensure a dsp pulls all relevant properties from the parent provider ([#3939](https://github.com/Microsoft/fast/issues/3939)) ([c70c519](https://github.com/Microsoft/fast/commit/c70c5190337890775f29b863b00d703ffda3a853))
* ensure attributes are passed to text field template ([#3923](https://github.com/Microsoft/fast/issues/3923)) ([31afcd4](https://github.com/Microsoft/fast/commit/31afcd430d80fe2fb13d921b11b7ec92cf1a0bc8))
* ensure badge always applies inline-style when attributes exist ([#3905](https://github.com/Microsoft/fast/issues/3905)) ([7624cba](https://github.com/Microsoft/fast/commit/7624cba3a7ec74bebc199a038a054fab8816684e))
* fixed typos ([#3934](https://github.com/Microsoft/fast/issues/3934)) ([f82468c](https://github.com/Microsoft/fast/commit/f82468c730165983d64e51ce74abaa8a27a8fb64))
* for tree-view removing space bar key handler and match aria spec ([#3954](https://github.com/Microsoft/fast/issues/3954)) ([4cb03e8](https://github.com/Microsoft/fast/commit/4cb03e86995efcd52c24ef4a0a606e0221df334a)), closes [/w3c.github.io/aria-practices/#keyboard-interaction-23](https://github.com//w3c.github.io/aria-practices//issues/keyboard-interaction-23)
* remove placeholder functions for boolean attributes in dialog component ([#3913](https://github.com/Microsoft/fast/issues/3913)) ([ab21eb7](https://github.com/Microsoft/fast/commit/ab21eb760ba2f84858b24dbf6c459f1602a3f7b0))
* tree view item should have a click handler on root element ([#3951](https://github.com/Microsoft/fast/issues/3951)) ([913c2bd](https://github.com/Microsoft/fast/commit/913c2bd3a8f28622788c1f87a9f320ba7dbc1297))
* tree-view right and left arrow keyboarding should behave as wai-aria spec suggests ([#3890](https://github.com/Microsoft/fast/issues/3890)) ([f866359](https://github.com/Microsoft/fast/commit/f8663590879ef2b1a064d10f9302f14cb7be0293))


### Features

*  Anchored region reliability/perf improvements ([#3876](https://github.com/Microsoft/fast/issues/3876)) ([0e697f6](https://github.com/Microsoft/fast/commit/0e697f6ab6bd8f40894b9791d3eec8fe97a97d26))
* add skeleton component ([#3877](https://github.com/Microsoft/fast/issues/3877)) ([aff7d30](https://github.com/Microsoft/fast/commit/aff7d3010574183744cf7105ae51a275c2c70a12))
* add tooltip component ([#3549](https://github.com/Microsoft/fast/issues/3549)) ([cb7aa98](https://github.com/Microsoft/fast/commit/cb7aa98ccaaad00e9e86b4575ef011986c054d08))





## [1.7.2](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.7.1...@microsoft/fast-foundation@1.7.2) (2020-09-10)


### Bug Fixes

* able to keyboard tab back in the tree view ([#3867](https://github.com/Microsoft/fast/issues/3867)) ([d3e3cde](https://github.com/Microsoft/fast/commit/d3e3cde2fc3efd034569f6ade35a739aaf3e2738)), closes [#3801](https://github.com/Microsoft/fast/issues/3801)
* implicit form-associated submission ([#3861](https://github.com/Microsoft/fast/issues/3861)) ([8342912](https://github.com/Microsoft/fast/commit/8342912802b0cff20b38d16d28ccff49147088fa))
* move right and move left functionality of radio-group in RTL ([f2735aa](https://github.com/Microsoft/fast/commit/f2735aa2fdb3c9ac71e143fddee84397f045afec))
* tabs right and left keyboarding in rtl ([#3836](https://github.com/Microsoft/fast/issues/3836)) ([d9ac1b1](https://github.com/Microsoft/fast/commit/d9ac1b13bafbb94a204b58dcc56a02321fbc8fbd))





## [1.7.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.7.0...@microsoft/fast-foundation@1.7.1) (2020-08-27)


### Bug Fixes

* consistent with min-width, min-height is at least the thumb size add default height ([#3746](https://github.com/Microsoft/fast/issues/3746)) ([b3f9aee](https://github.com/Microsoft/fast/commit/b3f9aee644261ddcdd029fbafed69186db070c77))
* proxy element causes empty check on slots to fail ([#3779](https://github.com/Microsoft/fast/issues/3779)) ([78787c3](https://github.com/Microsoft/fast/commit/78787c35631edb2b86f985dbfbc68036797f60d0))
* **docs:** correct typos in readme and spec files ([#3740](https://github.com/Microsoft/fast/issues/3740)) ([9bdb11f](https://github.com/Microsoft/fast/commit/9bdb11f7eab686ab6de32eda352f1a0493ee9545))





# [1.7.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.6.0...@microsoft/fast-foundation@1.7.0) (2020-08-13)


### Bug Fixes

* anchored region fails on firefox ([#3701](https://github.com/Microsoft/fast/issues/3701)) ([1fd02e0](https://github.com/Microsoft/fast/commit/1fd02e013fc3798da8686ad2923d3bfcdeb796d7))
* changed setupDefault to set initialValue which will set dirtyValue false after changing ([#3642](https://github.com/Microsoft/fast/issues/3642)) ([0b30fdf](https://github.com/Microsoft/fast/commit/0b30fdf78ebc6635ffb63e6b083f072871945d8c))
* correct tabs animation when using home/end touch ([#3718](https://github.com/Microsoft/fast/issues/3718)) ([24ed0e5](https://github.com/Microsoft/fast/commit/24ed0e5262f8201f465db8798f7b01bcbbb21135))
* correct typos on aria attributes ([#3690](https://github.com/Microsoft/fast/issues/3690)) ([d1c9ba4](https://github.com/Microsoft/fast/commit/d1c9ba4903dabe16487389917ad762d744356060))
* fix radiogroup tabfocus ([#3650](https://github.com/Microsoft/fast/issues/3650)) ([59536fe](https://github.com/Microsoft/fast/commit/59536fe959c6d4ab2b48fa7636e11f8e68ecc0eb))
* hitting enter key when in the text-field did not submit form ([#3687](https://github.com/Microsoft/fast/issues/3687)) ([3bc4384](https://github.com/Microsoft/fast/commit/3bc4384190af70ca082ef4e24a10f030e22a09e0))
* turn off animation when dragging ([#3664](https://github.com/Microsoft/fast/issues/3664)) ([49e9d02](https://github.com/Microsoft/fast/commit/49e9d0294e3a98b0da443b4194d0006aaf5ff422))
* wrapping set focus in dom.queueupdate ([#3703](https://github.com/Microsoft/fast/issues/3703)) ([7cb4616](https://github.com/Microsoft/fast/commit/7cb4616a9947639d6fb7a06e56db3d3900841674))


### Features

* anchored region revision ([#3527](https://github.com/Microsoft/fast/issues/3527)) ([63f3658](https://github.com/Microsoft/fast/commit/63f3658659a113bdc304f32e22b958e0d56ab7bf))
* export form-associated under alpha flag ([#3618](https://github.com/Microsoft/fast/issues/3618)) ([cbcb217](https://github.com/Microsoft/fast/commit/cbcb2177c81740f6d6fc0be98973217dbb001e00))


### Reverts

* Revert "chore: update all http to https to resolve WS1262 security vulnerability (#3658)" (#3699) ([0cac64a](https://github.com/Microsoft/fast/commit/0cac64a869e1b65a94ef14ed50b1324d0e15be46)), closes [#3658](https://github.com/Microsoft/fast/issues/3658) [#3699](https://github.com/Microsoft/fast/issues/3699)





# [1.6.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.5.0...@microsoft/fast-foundation@1.6.0) (2020-07-31)


### Bug Fixes

* add form submission and reset behavior to Button ([#3603](https://github.com/Microsoft/fast/issues/3603)) ([f646343](https://github.com/Microsoft/fast/commit/f6463436a001d07a7cfbd5d87460c76cf8584e65))
* various fixes for form-associated custom elements ([#3581](https://github.com/Microsoft/fast/issues/3581)) ([ccba229](https://github.com/Microsoft/fast/commit/ccba229c6c1133485d0fac92eae88cb3a6369495))


### Features

* adding directional stylesheet behavior ([#3559](https://github.com/Microsoft/fast/issues/3559)) ([74c19af](https://github.com/Microsoft/fast/commit/74c19af79cb6b9c015ab3a454a3e69d453f1a217))
* create an observable function to support aria-valuetext on slider component ([#3508](https://github.com/Microsoft/fast/issues/3508)) ([b4ac369](https://github.com/Microsoft/fast/commit/b4ac369e37ba591a5bb1d8c7bcbfde6dffcadeef)), closes [#3504](https://github.com/Microsoft/fast/issues/3504)





# [1.5.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.4.0...@microsoft/fast-foundation@1.5.0) (2020-07-23)


### Bug Fixes

* address nested styling issues and provide a more intuitive API for nesting ([#3528](https://github.com/Microsoft/fast/issues/3528)) ([4fe0dd3](https://github.com/Microsoft/fast/commit/4fe0dd38ce8f2b43be0f13c7efac2f12ada6cd78))
* move text field and text area appearances from foundation to components ([#3540](https://github.com/Microsoft/fast/issues/3540)) ([ca8ac76](https://github.com/Microsoft/fast/commit/ca8ac760cdf666fc79a47ba9a21c5f964556dbab))
* rollup minify selectors should retain spaces ([#3524](https://github.com/Microsoft/fast/issues/3524)) ([cbdfc45](https://github.com/Microsoft/fast/commit/cbdfc45c2543fe9f94e0edc7687cc9f04a38e118))
* update nested to be observable and set isNestedItem method to readonly ([#3539](https://github.com/Microsoft/fast/issues/3539)) ([9e67f52](https://github.com/Microsoft/fast/commit/9e67f52a8fd3e1736e3882ef7e2fa3f25e63a396))


### Features

* basic menu item check state toggling ([#3512](https://github.com/Microsoft/fast/issues/3512)) ([ea84cbd](https://github.com/Microsoft/fast/commit/ea84cbd125b16de0ff2ae888f82163178af8da69))





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
