# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.14.0...@microsoft/fast-components-styles-msft@4.0.0) (2019-03-25)


### Bug Fixes

* increase specificity on MSFT styled components which are derived from other MSFT components ([#1508](https://github.com/Microsoft/fast-dna/issues/1508)) ([aad072c](https://github.com/Microsoft/fast-dna/commit/aad072c))
* remove memoization from color utilities ([#1524](https://github.com/Microsoft/fast-dna/issues/1524)) ([f16529a](https://github.com/Microsoft/fast-dna/commit/f16529a))
* update color utility typings ([#1561](https://github.com/Microsoft/fast-dna/issues/1561)) ([395546a](https://github.com/Microsoft/fast-dna/commit/395546a))
* update to improve animations functionality and style ([#1507](https://github.com/Microsoft/fast-dna/issues/1507)) ([7179a6c](https://github.com/Microsoft/fast-dna/commit/7179a6c))
* update to not return undefined when trying to return colors ([#1476](https://github.com/Microsoft/fast-dna/issues/1476)) ([715138b](https://github.com/Microsoft/fast-dna/commit/715138b))
* update to use esModuleInterop in the TypeScript configuration files ([#1211](https://github.com/Microsoft/fast-dna/issues/1211)) ([2ec0644](https://github.com/Microsoft/fast-dna/commit/2ec0644))


### Features

* add deltas to design-system and update palettes to be an array of swatches ([#1554](https://github.com/Microsoft/fast-dna/issues/1554)) ([2556588](https://github.com/Microsoft/fast-dna/commit/2556588))
* add MSFT palette-based color utilities ([#1363](https://github.com/Microsoft/fast-dna/issues/1363)) ([b4f632e](https://github.com/Microsoft/fast-dna/commit/b4f632e))
* add neutral fill input recipe ([#1425](https://github.com/Microsoft/fast-dna/issues/1425)) ([05614d8](https://github.com/Microsoft/fast-dna/commit/05614d8))
* add neutral-focus recipe ([#1468](https://github.com/Microsoft/fast-dna/issues/1468)) ([2bd9902](https://github.com/Microsoft/fast-dna/commit/2bd9902))
* add neutral-foreground states ([#1439](https://github.com/Microsoft/fast-dna/issues/1439)) ([6f054c6](https://github.com/Microsoft/fast-dna/commit/6f054c6))
* add neutralFocus across components ([#1480](https://github.com/Microsoft/fast-dna/issues/1480)) ([3aa6a80](https://github.com/Microsoft/fast-dna/commit/3aa6a80))
* add new color system to action toggle, action trigger, badge and breadcrumb ([#1453](https://github.com/Microsoft/fast-dna/issues/1453)) ([c28c455](https://github.com/Microsoft/fast-dna/commit/c28c455))
* add new color system to button ([#1466](https://github.com/Microsoft/fast-dna/issues/1466)) ([eb301bb](https://github.com/Microsoft/fast-dna/commit/eb301bb))
* add new color system to call to action, card, checkbox and context menu ([#1459](https://github.com/Microsoft/fast-dna/issues/1459)) ([a343432](https://github.com/Microsoft/fast-dna/commit/a343432))
* add new color system to dialog, divider, flipper, hypertext, label, metatext and input field ([#1460](https://github.com/Microsoft/fast-dna/issues/1460)) ([db8a35f](https://github.com/Microsoft/fast-dna/commit/db8a35f))
* add new color system to pivot, progress, radio, text action, auto-suggest, and toggle ([#1465](https://github.com/Microsoft/fast-dna/issues/1465)) ([2334975](https://github.com/Microsoft/fast-dna/commit/2334975))
* add selected color to all fill recipes  ([#1420](https://github.com/Microsoft/fast-dna/issues/1420)) ([8ff219d](https://github.com/Microsoft/fast-dna/commit/8ff219d))
* adds shorthand hex parsing to color parsers ([#1487](https://github.com/Microsoft/fast-dna/issues/1487)) ([e3d3397](https://github.com/Microsoft/fast-dna/commit/e3d3397))
* apply new color system to carousel ([#1501](https://github.com/Microsoft/fast-dna/issues/1501)) ([d9ca212](https://github.com/Microsoft/fast-dna/commit/d9ca212))
* change utilities to work with non-function stylesheets ([#1581](https://github.com/Microsoft/fast-dna/issues/1581)) ([2dafe1c](https://github.com/Microsoft/fast-dna/commit/2dafe1c))
* integrate fast-dna/colors palette generation into msft color utilities ([#1467](https://github.com/Microsoft/fast-dna/issues/1467)) ([5ee3f07](https://github.com/Microsoft/fast-dna/commit/5ee3f07))
* remove appearance prop and add filled prop to control backplate usage ([#1485](https://github.com/Microsoft/fast-dna/issues/1485)) ([87515ac](https://github.com/Microsoft/fast-dna/commit/87515ac))
* remove chroma ([#1562](https://github.com/Microsoft/fast-dna/issues/1562)) ([df249b7](https://github.com/Microsoft/fast-dna/commit/df249b7))
* remove chroma from color utilities ([#1482](https://github.com/Microsoft/fast-dna/issues/1482)) ([b82fe4c](https://github.com/Microsoft/fast-dna/commit/b82fe4c))
* remove deprecated design-system values ([#1567](https://github.com/Microsoft/fast-dna/issues/1567)) ([e55929d](https://github.com/Microsoft/fast-dna/commit/e55929d))
* remove fast-application-utilities package ([#1455](https://github.com/Microsoft/fast-dna/issues/1455)) ([7ee34fa](https://github.com/Microsoft/fast-dna/commit/7ee34fa))
* remove legacy color utils ([#1557](https://github.com/Microsoft/fast-dna/issues/1557)) ([3f39ff9](https://github.com/Microsoft/fast-dna/commit/3f39ff9))
* remove legacy style color utilities ([#1504](https://github.com/Microsoft/fast-dna/issues/1504)) ([3db5131](https://github.com/Microsoft/fast-dna/commit/3db5131))
* update neutral-outline and neutral-stealth offsets ([#1403](https://github.com/Microsoft/fast-dna/issues/1403)) ([f8ac8ac](https://github.com/Microsoft/fast-dna/commit/f8ac8ac))
* update styles and design system density. ([#1573](https://github.com/Microsoft/fast-dna/issues/1573)) ([d8f85c2](https://github.com/Microsoft/fast-dna/commit/d8f85c2))


### BREAKING CHANGES

* removes/renames design system values
* Breakpoint helpers and interfaces and applyType method has been removed
* removes legacy color utilities
* Style specificity has changed to ensure that MSFT components are styled as expected. This change may cause regressions to existing styles or overrides.
* removes appearance property for badge in favor of filled property
* removes styling utilities no longer reccomended for use.
* removal of fast-application-utilities-package
* This will affect how imports will be handled by
consumers





# [3.14.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.13.0...@microsoft/fast-components-styles-msft@3.14.0) (2019-03-19)


### Features

* add auto suggest component ([#1551](https://github.com/Microsoft/fast-dna/issues/1551)) ([660fc41](https://github.com/Microsoft/fast-dna/commit/660fc41))





# [3.13.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.12.0...@microsoft/fast-components-styles-msft@3.13.0) (2019-03-11)


### Bug Fixes

* const in carousel styles is missing closing ) ([#1496](https://github.com/Microsoft/fast-dna/issues/1496)) ([6fdd98c](https://github.com/Microsoft/fast-dna/commit/6fdd98c))
* remove -10 margin from components that use Justified appearance ([#1519](https://github.com/Microsoft/fast-dna/issues/1519)) ([b3a495c](https://github.com/Microsoft/fast-dna/commit/b3a495c))
* update call to action to handle disabled state correctly ([#1477](https://github.com/Microsoft/fast-dna/issues/1477)) ([9c6e75f](https://github.com/Microsoft/fast-dna/commit/9c6e75f))


### Features

* add base select component ([#1422](https://github.com/Microsoft/fast-dna/issues/1422)) ([b77a25e](https://github.com/Microsoft/fast-dna/commit/b77a25e))





# [3.12.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.11.0...@microsoft/fast-components-styles-msft@3.12.0) (2019-03-01)


### Bug Fixes

* incorrect name in dialog stylesheet caused styles to not be applied ([#1472](https://github.com/Microsoft/fast-dna/issues/1472)) ([4929884](https://github.com/Microsoft/fast-dna/commit/4929884))


### Features

* update carousel functionality and design ([#1411](https://github.com/Microsoft/fast-dna/issues/1411)) ([fce4723](https://github.com/Microsoft/fast-dna/commit/fce4723))





# [3.11.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.10.0...@microsoft/fast-components-styles-msft@3.11.0) (2019-02-28)


### Bug Fixes

* add additional wrapper to dialog to prevent subpixel aliasing due to css transforms ([#1431](https://github.com/Microsoft/fast-dna/issues/1431)) ([1fad8fe](https://github.com/Microsoft/fast-dna/commit/1fad8fe))
* change badge accent color to background color ([#1427](https://github.com/Microsoft/fast-dna/issues/1427)) ([12b0b2a](https://github.com/Microsoft/fast-dna/commit/12b0b2a))


### Features

* add pivot msft component ([#1385](https://github.com/Microsoft/fast-dna/issues/1385)) ([e81f01c](https://github.com/Microsoft/fast-dna/commit/e81f01c))





# [3.10.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.9.0...@microsoft/fast-components-styles-msft@3.10.0) (2019-02-21)


### Bug Fixes

* remove focus visible from text field in text action ([#1419](https://github.com/Microsoft/fast-dna/issues/1419)) ([2570ad4](https://github.com/Microsoft/fast-dna/commit/2570ad4))


### Features

* add common MSFT input field style pattern ([#1375](https://github.com/Microsoft/fast-dna/issues/1375)) ([3ff26f9](https://github.com/Microsoft/fast-dna/commit/3ff26f9))
* create number field as base and MSFT component ([#1371](https://github.com/Microsoft/fast-dna/issues/1371)) ([d440b5f](https://github.com/Microsoft/fast-dna/commit/d440b5f))





# [3.9.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.8.0...@microsoft/fast-components-styles-msft@3.9.0) (2019-02-07)


### Bug Fixes

* card and dialog shadows should always be black regardless of theming ([#1364](https://github.com/Microsoft/fast-dna/issues/1364)) ([c5bda31](https://github.com/Microsoft/fast-dna/commit/c5bda31))
* context menu styles to match new designs ([#1355](https://github.com/Microsoft/fast-dna/issues/1355)) ([8a3295d](https://github.com/Microsoft/fast-dna/commit/8a3295d))


### Features

* add badge as an MSFT component ([#1278](https://github.com/Microsoft/fast-dna/issues/1278)) ([79ce26c](https://github.com/Microsoft/fast-dna/commit/79ce26c))
* add carousel as a MSFT component ([#1338](https://github.com/Microsoft/fast-dna/issues/1338)) ([b23e2c1](https://github.com/Microsoft/fast-dna/commit/b23e2c1))





<a name="3.8.0"></a>
# [3.8.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.7.1...@microsoft/fast-components-styles-msft@3.8.0) (2019-01-26)


### Features

* add focus-visible support ([#1335](https://github.com/Microsoft/fast-dna/issues/1335)) ([1360ef6](https://github.com/Microsoft/fast-dna/commit/1360ef6))





<a name="3.7.1"></a>
## [3.7.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.7.0...@microsoft/fast-components-styles-msft@3.7.1) (2019-01-22)

**Note:** Version bump only for package @microsoft/fast-components-styles-msft





<a name="3.7.0"></a>
# [3.7.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.6.0...@microsoft/fast-components-styles-msft@3.7.0) (2019-01-22)


### Bug Fixes

* adjust text action height to be 32 total pixels ([#1306](https://github.com/Microsoft/fast-dna/issues/1306)) ([16adaf1](https://github.com/Microsoft/fast-dna/commit/16adaf1))


### Features

* add generic function for deep merging two objects for use with design system defaults ([#1305](https://github.com/Microsoft/fast-dna/issues/1305)) ([25389f0](https://github.com/Microsoft/fast-dna/commit/25389f0))
* deprecate breakpoint interface, breakpoint values, and applyBreakpoint function ([#1316](https://github.com/Microsoft/fast-dna/issues/1316)) ([2a09680](https://github.com/Microsoft/fast-dna/commit/2a09680))





<a name="3.4.1"></a>
## [3.4.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@3.4.0...@microsoft/fast-components-styles-msft@3.4.1) (2018-12-21)


### Bug Fixes

* add missing position value to root node of checkbox ([#1183](https://github.com/Microsoft/fast-dna/issues/1183)) ([b08b269](https://github.com/Microsoft/fast-dna/commit/b08b269))
* add missing position value to root node of radio ([#1184](https://github.com/Microsoft/fast-dna/issues/1184)) ([6e993b2](https://github.com/Microsoft/fast-dna/commit/6e993b2))
* fixes high-contrast of components ([#1207](https://github.com/Microsoft/fast-dna/issues/1207)) ([7f56ec1](https://github.com/Microsoft/fast-dna/commit/7f56ec1))
* style cleanup and consolidation ([#1198](https://github.com/Microsoft/fast-dna/issues/1198)) ([4151f39](https://github.com/Microsoft/fast-dna/commit/4151f39))





<a name="2.3.2"></a>
## [2.3.2](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@2.3.1...@microsoft/fast-components-styles-msft@2.3.2) (2018-09-24)

**Note:** Version bump only for package @microsoft/fast-components-styles-msft





<a name="2.3.1"></a>
## [2.3.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@2.3.0...@microsoft/fast-components-styles-msft@2.3.1) (2018-09-21)

**Note:** Version bump only for package @microsoft/fast-components-styles-msft





<a name="2.3.0"></a>
# [2.3.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-components-styles-msft@2.2.0...@microsoft/fast-components-styles-msft@2.3.0) (2018-09-19)


### Features

* **call-to-action:** add call to action component ([#851](https://github.com/Microsoft/fast-dna/issues/851)) ([05fe0c2](https://github.com/Microsoft/fast-dna/commit/05fe0c2))
* **style:** add elevation shadow ramp and functions ([#901](https://github.com/Microsoft/fast-dna/issues/901)) ([2064405](https://github.com/Microsoft/fast-dna/commit/2064405))





<a name="2.2.0"></a>
# 2.2.0 (2018-09-11)


### Features

* add contrast based color system ([#810](https://github.com/Microsoft/fast-dna/issues/810)) ([5ec457c](https://github.com/Microsoft/fast-dna/commit/5ec457c))
* **caption:** add caption component ([#829](https://github.com/Microsoft/fast-dna/issues/829)) ([026cc4e](https://github.com/Microsoft/fast-dna/commit/026cc4e))
* **metatext:** add metatext as a new MSFT component ([#818](https://github.com/Microsoft/fast-dna/issues/818)) ([8498687](https://github.com/Microsoft/fast-dna/commit/8498687))
* **progress:** add progress component ([#835](https://github.com/Microsoft/fast-dna/issues/835)) ([44d9bb1](https://github.com/Microsoft/fast-dna/commit/44d9bb1))
* **subheading:** add subheading component ([#828](https://github.com/Microsoft/fast-dna/issues/828)) ([b988ade](https://github.com/Microsoft/fast-dna/commit/b988ade))
* add density to msft design system ([#855](https://github.com/Microsoft/fast-dna/issues/855)) ([4d0128e](https://github.com/Microsoft/fast-dna/commit/4d0128e))



<a name="2.1.0"></a>
# 2.1.0 (2018-08-29)


### Features

* update Lerna to ^3.0.0 ([#795](https://github.com/Microsoft/fast-dna/issues/795)) ([9ce9a56](https://github.com/Microsoft/fast-dna/commit/9ce9a56))
* upgrade to TypeScript 3.0.0 ([#793](https://github.com/Microsoft/fast-dna/issues/793)) ([e203e86](https://github.com/Microsoft/fast-dna/commit/e203e86))
* **fast-components-react-base:** add callback to horizontal overflow to return and object that informs scroll start and end ([#797](https://github.com/Microsoft/fast-dna/issues/797)) ([37975f3](https://github.com/Microsoft/fast-dna/commit/37975f3))
* **paragraph:** adds paragraph as a new MSFT component ([#805](https://github.com/Microsoft/fast-dna/issues/805)) ([8325d3f](https://github.com/Microsoft/fast-dna/commit/8325d3f))



<a name="2.0.0-corrected"></a>
# 2.0.0-corrected (2018-08-03)


### Bug Fixes

* fix tslint globbing issue and enforce whitespace in import/export statements ([#219](https://github.com/Microsoft/fast-dna/issues/219)) ([4637a90](https://github.com/Microsoft/fast-dna/commit/4637a90))
* travis-CI build-break ([#336](https://github.com/Microsoft/fast-dna/issues/336)) ([bffbf5e](https://github.com/Microsoft/fast-dna/commit/bffbf5e))
* **checkbox:** fix broken indeterminate state UI in Firefox ([#489](https://github.com/Microsoft/fast-dna/issues/489)) ([dd55c0c](https://github.com/Microsoft/fast-dna/commit/dd55c0c))
* **divider:** remove hard coded color value on divider to support theming ([#675](https://github.com/Microsoft/fast-dna/issues/675)) ([85d07d7](https://github.com/Microsoft/fast-dna/commit/85d07d7))
* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **fast-components-styles-msft:** remove duplicate code and creates a utility to apply mixed colors ([#500](https://github.com/Microsoft/fast-dna/issues/500)) ([179c584](https://github.com/Microsoft/fast-dna/commit/179c584))
* **hypertext:** fix hypertext style when no href value exists ([#499](https://github.com/Microsoft/fast-dna/issues/499)) ([cd5d3d2](https://github.com/Microsoft/fast-dna/commit/cd5d3d2))
* **jss:** fix errors caused by un-linked JSS rules ([#409](https://github.com/Microsoft/fast-dna/issues/409)) ([c9c4a9c](https://github.com/Microsoft/fast-dna/commit/c9c4a9c))
* **label:** remove label element shift when changing HTML type in configure pane ([#657](https://github.com/Microsoft/fast-dna/issues/657)) ([44d3126](https://github.com/Microsoft/fast-dna/commit/44d3126))
* **toggle:** toggle "Selected" option does not work and is missing background color ([#663](https://github.com/Microsoft/fast-dna/issues/663)) ([e05abca](https://github.com/Microsoft/fast-dna/commit/e05abca))


### Features

* add divider component ([#205](https://github.com/Microsoft/fast-dna/issues/205)) ([ae25c38](https://github.com/Microsoft/fast-dna/commit/ae25c38))
* add hypertext component ([#210](https://github.com/Microsoft/fast-dna/issues/210)) ([9e363ff](https://github.com/Microsoft/fast-dna/commit/9e363ff))
* add snapshot test suite ([#207](https://github.com/Microsoft/fast-dna/issues/207)) ([7ceaafe](https://github.com/Microsoft/fast-dna/commit/7ceaafe))
* Forked Class name contracts so we can have one for Base and one for MSFT ([#262](https://github.com/Microsoft/fast-dna/issues/262)) ([a4c54c0](https://github.com/Microsoft/fast-dna/commit/a4c54c0))
* update code coverage on travis ([#330](https://github.com/Microsoft/fast-dna/issues/330)) ([63ab4f4](https://github.com/Microsoft/fast-dna/commit/63ab4f4))
* update utility to include localized spacing and direction ([#308](https://github.com/Microsoft/fast-dna/issues/308)) ([e45ea1a](https://github.com/Microsoft/fast-dna/commit/e45ea1a))
* **button:** updates to current msft styles ([#314](https://github.com/Microsoft/fast-dna/issues/314)) ([0029e06](https://github.com/Microsoft/fast-dna/commit/0029e06))
* **checkbox:** add new component with styles ([#252](https://github.com/Microsoft/fast-dna/issues/252)) ([3ad3988](https://github.com/Microsoft/fast-dna/commit/3ad3988))
* **checkbox:** update styling and incorrect states ([#371](https://github.com/Microsoft/fast-dna/issues/371)) ([45cbe3c](https://github.com/Microsoft/fast-dna/commit/45cbe3c))
* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))
* **dialog:** add dialog as a new component ([#752](https://github.com/Microsoft/fast-dna/issues/752)) ([2864021](https://github.com/Microsoft/fast-dna/commit/2864021))
* **fast-components-react-msft:** add flipper as a new component ([#642](https://github.com/Microsoft/fast-dna/issues/642)) ([5ac4496](https://github.com/Microsoft/fast-dna/commit/5ac4496))
* **fast-components-react-msft:** add localized styles and enable ltr/rtl swapping on documentation site ([#517](https://github.com/Microsoft/fast-dna/issues/517)) ([ce939b7](https://github.com/Microsoft/fast-dna/commit/ce939b7))
* **fast-components-styles-msft:** set default config values as a fallback if there is a missing or incomplete design system ([#633](https://github.com/Microsoft/fast-dna/issues/633)) ([ffeafc7](https://github.com/Microsoft/fast-dna/commit/ffeafc7))
* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))
* **form generator:** updates styles found in configuration pane ([#420](https://github.com/Microsoft/fast-dna/issues/420)) ([919121b](https://github.com/Microsoft/fast-dna/commit/919121b))
* **heading:** add heading as a new msft component ([#280](https://github.com/Microsoft/fast-dna/issues/280)) ([b7ee1ab](https://github.com/Microsoft/fast-dna/commit/b7ee1ab))
* **hypertext:** remove code duplication in hypertext styles ([#321](https://github.com/Microsoft/fast-dna/issues/321)) ([911572f](https://github.com/Microsoft/fast-dna/commit/911572f))
* **Image:** add new component and msft styles ([#237](https://github.com/Microsoft/fast-dna/issues/237)) ([ea057ed](https://github.com/Microsoft/fast-dna/commit/ea057ed))
* **label:** add new component and msft styles ([#265](https://github.com/Microsoft/fast-dna/issues/265)) ([0328028](https://github.com/Microsoft/fast-dna/commit/0328028))
* **toggle:** add new component and msft styles ([#212](https://github.com/Microsoft/fast-dna/issues/212)) ([b9dd3e0](https://github.com/Microsoft/fast-dna/commit/b9dd3e0))
* **typography:** add typography as a new base component and style ([#247](https://github.com/Microsoft/fast-dna/issues/247)) ([df3804e](https://github.com/Microsoft/fast-dna/commit/df3804e))
* **utilities:** add package for jss utilities ([#286](https://github.com/Microsoft/fast-dna/issues/286)) ([e1e9caf](https://github.com/Microsoft/fast-dna/commit/e1e9caf))
* **utilities:** adds generic acrylic function to `fast-jss-utilites` and MSFT specific implementation to `fast-component-styles-msft` ([#740](https://github.com/Microsoft/fast-dna/issues/740)) ([f8aad89](https://github.com/Microsoft/fast-dna/commit/f8aad89))





<a name="2.1.0"></a>
# [2.1.0](https://github.com/Microsoft/fast-dna/compare/v2.0.0-corrected...v2.1.0) (2018-08-29)


### Features

* update Lerna to ^3.0.0 ([#795](https://github.com/Microsoft/fast-dna/issues/795)) ([9ce9a56](https://github.com/Microsoft/fast-dna/commit/9ce9a56))
* upgrade to TypeScript 3.0.0 ([#793](https://github.com/Microsoft/fast-dna/issues/793)) ([e203e86](https://github.com/Microsoft/fast-dna/commit/e203e86))
* **fast-components-react-base:** add callback to horizontal overflow to return and object that informs scroll start and end ([#797](https://github.com/Microsoft/fast-dna/issues/797)) ([37975f3](https://github.com/Microsoft/fast-dna/commit/37975f3))
* **paragraph:** adds paragraph as a new MSFT component ([#805](https://github.com/Microsoft/fast-dna/issues/805)) ([8325d3f](https://github.com/Microsoft/fast-dna/commit/8325d3f))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v2.0.0) (2018-08-02)


### Bug Fixes

* **checkbox:** fix broken indeterminate state UI in Firefox ([#489](https://github.com/Microsoft/fast-dna/issues/489)) ([dd55c0c](https://github.com/Microsoft/fast-dna/commit/dd55c0c))
* **divider:** remove hard coded color value on divider to support theming ([#675](https://github.com/Microsoft/fast-dna/issues/675)) ([85d07d7](https://github.com/Microsoft/fast-dna/commit/85d07d7))
* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **fast-components-styles-msft:** remove duplicate code and creates a utility to apply mixed colors ([#500](https://github.com/Microsoft/fast-dna/issues/500)) ([179c584](https://github.com/Microsoft/fast-dna/commit/179c584))
* **hypertext:** fix hypertext style when no href value exists ([#499](https://github.com/Microsoft/fast-dna/issues/499)) ([cd5d3d2](https://github.com/Microsoft/fast-dna/commit/cd5d3d2))
* **label:** remove label element shift when changing HTML type in configure pane ([#657](https://github.com/Microsoft/fast-dna/issues/657)) ([44d3126](https://github.com/Microsoft/fast-dna/commit/44d3126))
* **toggle:** toggle "Selected" option does not work and is missing background color ([#663](https://github.com/Microsoft/fast-dna/issues/663)) ([e05abca](https://github.com/Microsoft/fast-dna/commit/e05abca))


### Features

* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))
* **dialog:** add dialog as a new component ([#752](https://github.com/Microsoft/fast-dna/issues/752)) ([2864021](https://github.com/Microsoft/fast-dna/commit/2864021))
* **fast-components-react-msft:** add flipper as a new component ([#642](https://github.com/Microsoft/fast-dna/issues/642)) ([5ac4496](https://github.com/Microsoft/fast-dna/commit/5ac4496))
* **fast-components-react-msft:** add localized styles and enable ltr/rtl swapping on documentation site ([#517](https://github.com/Microsoft/fast-dna/issues/517)) ([ce939b7](https://github.com/Microsoft/fast-dna/commit/ce939b7))
* **fast-components-styles-msft:** set default config values as a fallback if there is a missing or incomplete design system ([#633](https://github.com/Microsoft/fast-dna/issues/633)) ([ffeafc7](https://github.com/Microsoft/fast-dna/commit/ffeafc7))
* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))
* **utilities:** adds generic acrylic function to `fast-jss-utilites` and MSFT specific implementation to `fast-component-styles-msft` ([#740](https://github.com/Microsoft/fast-dna/issues/740)) ([f8aad89](https://github.com/Microsoft/fast-dna/commit/f8aad89))




<a name="1.9.0"></a>
# [1.9.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.9.0) (2018-07-14)


### Bug Fixes

* **checkbox:** fix broken indeterminate state UI in Firefox ([#489](https://github.com/Microsoft/fast-dna/issues/489)) ([dd55c0c](https://github.com/Microsoft/fast-dna/commit/dd55c0c))
* **divider:** remove hard coded color value on divider to support theming ([#675](https://github.com/Microsoft/fast-dna/issues/675)) ([85d07d7](https://github.com/Microsoft/fast-dna/commit/85d07d7))
* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **fast-components-styles-msft:** remove duplicate code and creates a utility to apply mixed colors ([#500](https://github.com/Microsoft/fast-dna/issues/500)) ([179c584](https://github.com/Microsoft/fast-dna/commit/179c584))
* **hypertext:** fix hypertext style when no href value exists ([#499](https://github.com/Microsoft/fast-dna/issues/499)) ([cd5d3d2](https://github.com/Microsoft/fast-dna/commit/cd5d3d2))
* **toggle:** toggle "Selected" option does not work and is missing background color ([#663](https://github.com/Microsoft/fast-dna/issues/663)) ([e05abca](https://github.com/Microsoft/fast-dna/commit/e05abca))


### Features

* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))
* **fast-components-react-msft:** add flipper as a new component ([#642](https://github.com/Microsoft/fast-dna/issues/642)) ([5ac4496](https://github.com/Microsoft/fast-dna/commit/5ac4496))
* **fast-components-react-msft:** add localized styles and enable ltr/rtl swapping on documentation site ([#517](https://github.com/Microsoft/fast-dna/issues/517)) ([ce939b7](https://github.com/Microsoft/fast-dna/commit/ce939b7))
* **fast-components-styles-msft:** set default config values as a fallback if there is a missing or incomplete design system ([#633](https://github.com/Microsoft/fast-dna/issues/633)) ([ffeafc7](https://github.com/Microsoft/fast-dna/commit/ffeafc7))
* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))




<a name="1.8.0"></a>
# [1.8.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.8.0) (2018-06-12)


### Bug Fixes

* **fast-components-styles-msft:** remove duplicate code and creates a utility to apply mixed colors ([#500](https://github.com/Microsoft/fast-dna/issues/500)) ([179c584](https://github.com/Microsoft/fast-dna/commit/179c584))
* **hypertext:** fix hypertext style when no href value exists ([#499](https://github.com/Microsoft/fast-dna/issues/499)) ([cd5d3d2](https://github.com/Microsoft/fast-dna/commit/cd5d3d2))


### Features

* **fast-components-react-msft:** add localized styles and enable ltr/rtl swapping on documentation site ([#517](https://github.com/Microsoft/fast-dna/issues/517)) ([ce939b7](https://github.com/Microsoft/fast-dna/commit/ce939b7))




<a name="1.7.0"></a>
# [1.7.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.7.0) (2018-06-01)


### Bug Fixes

* **checkbox:** fix broken indeterminate state UI in Firefox ([#489](https://github.com/Microsoft/fast-dna/issues/489)) ([dd55c0c](https://github.com/Microsoft/fast-dna/commit/dd55c0c))


### Features

* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))




<a name="1.6.0"></a>
# [1.6.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.6.0) (2018-05-16)




<a name="1.5.0"></a>
# [1.5.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.5.0) (2018-05-16)


### Bug Fixes

* **jss:** fix errors caused by un-linked JSS rules ([#409](https://github.com/Microsoft/fast-dna/issues/409)) ([c9c4a9c](https://github.com/Microsoft/fast-dna/commit/c9c4a9c))


### Features

* **form generator:** updates styles found in configuration pane ([#420](https://github.com/Microsoft/fast-dna/issues/420)) ([919121b](https://github.com/Microsoft/fast-dna/commit/919121b))




<a name="1.4.0"></a>
# [1.4.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.4.0) (2018-05-14)


### Bug Fixes

* **jss:** fix errors caused by un-linked JSS rules ([#409](https://github.com/Microsoft/fast-dna/issues/409)) ([c9c4a9c](https://github.com/Microsoft/fast-dna/commit/c9c4a9c))


### Features

* **form generator:** updates styles found in configuration pane ([#420](https://github.com/Microsoft/fast-dna/issues/420)) ([919121b](https://github.com/Microsoft/fast-dna/commit/919121b))




<a name="1.3.0"></a>
# [1.3.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.3.0) (2018-05-11)


### Bug Fixes

* **jss:** fix errors caused by un-linked JSS rules ([#409](https://github.com/Microsoft/fast-dna/issues/409)) ([c9c4a9c](https://github.com/Microsoft/fast-dna/commit/c9c4a9c))




<a name="1.2.0"></a>
# 1.2.0 (2018-05-10)


### Features

* **checkbox:** update styling and incorrect states ([#371](https://github.com/Microsoft/fast-dna/issues/371)) ([45cbe3c](https://github.com/Microsoft/fast-dna/commit/45cbe3c))




<a name="1.1.0"></a>
# 1.1.0 (2018-05-09)


### Bug Fixes

* fix tslint globbing issue and enforce whitespace in import/export statements ([#219](https://github.com/Microsoft/fast-dna/issues/219)) ([4637a90](https://github.com/Microsoft/fast-dna/commit/4637a90))
* travis-CI build-break ([#336](https://github.com/Microsoft/fast-dna/issues/336)) ([bffbf5e](https://github.com/Microsoft/fast-dna/commit/bffbf5e))


### Features

* add divider component ([#205](https://github.com/Microsoft/fast-dna/issues/205)) ([ae25c38](https://github.com/Microsoft/fast-dna/commit/ae25c38))
* add hypertext component ([#210](https://github.com/Microsoft/fast-dna/issues/210)) ([9e363ff](https://github.com/Microsoft/fast-dna/commit/9e363ff))
* **label:** add new component and msft styles ([#265](https://github.com/Microsoft/fast-dna/issues/265)) ([0328028](https://github.com/Microsoft/fast-dna/commit/0328028))
* add snapshot test suite ([#207](https://github.com/Microsoft/fast-dna/issues/207)) ([7ceaafe](https://github.com/Microsoft/fast-dna/commit/7ceaafe))
* Forked Class name contracts so we can have one for Base and one for MSFT ([#262](https://github.com/Microsoft/fast-dna/issues/262)) ([a4c54c0](https://github.com/Microsoft/fast-dna/commit/a4c54c0))
* **button:** updates to current msft styles ([#314](https://github.com/Microsoft/fast-dna/issues/314)) ([0029e06](https://github.com/Microsoft/fast-dna/commit/0029e06))
* update code coverage on travis ([#330](https://github.com/Microsoft/fast-dna/issues/330)) ([63ab4f4](https://github.com/Microsoft/fast-dna/commit/63ab4f4))
* update utility to include localized spacing and direction ([#308](https://github.com/Microsoft/fast-dna/issues/308)) ([e45ea1a](https://github.com/Microsoft/fast-dna/commit/e45ea1a))
* **checkbox:** add new component with styles ([#252](https://github.com/Microsoft/fast-dna/issues/252)) ([3ad3988](https://github.com/Microsoft/fast-dna/commit/3ad3988))
* **heading:** add heading as a new msft component ([#280](https://github.com/Microsoft/fast-dna/issues/280)) ([b7ee1ab](https://github.com/Microsoft/fast-dna/commit/b7ee1ab))
* **hypertext:** remove code duplication in hypertext styles ([#321](https://github.com/Microsoft/fast-dna/issues/321)) ([911572f](https://github.com/Microsoft/fast-dna/commit/911572f))
* **Image:** add new component and msft styles ([#237](https://github.com/Microsoft/fast-dna/issues/237)) ([ea057ed](https://github.com/Microsoft/fast-dna/commit/ea057ed))
* **toggle:** add new component and msft styles ([#212](https://github.com/Microsoft/fast-dna/issues/212)) ([b9dd3e0](https://github.com/Microsoft/fast-dna/commit/b9dd3e0))
* **typography:** add typography as a new base component and style ([#247](https://github.com/Microsoft/fast-dna/issues/247)) ([df3804e](https://github.com/Microsoft/fast-dna/commit/df3804e))
* **utilities:** add package for jss utilities ([#286](https://github.com/Microsoft/fast-dna/issues/286)) ([e1e9caf](https://github.com/Microsoft/fast-dna/commit/e1e9caf))
