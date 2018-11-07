# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.1.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@3.1.0...@microsoft/fast-layouts-react@3.1.1) (2018-11-07)

**Note:** Version bump only for package @microsoft/fast-layouts-react





# [3.1.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@3.0.2...@microsoft/fast-layouts-react@3.1.0) (2018-11-05)


### Features

* performance updates to JSS Manager ([#1110](https://github.com/Microsoft/fast-dna/issues/1110)) ([db4b753](https://github.com/Microsoft/fast-dna/commit/db4b753))





## [3.0.2](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@3.0.1...@microsoft/fast-layouts-react@3.0.2) (2018-10-27)


### Bug Fixes

* corrects typings and exports for all of fast-layouts-react ([#1043](https://github.com/Microsoft/fast-dna/issues/1043)) ([a92ed4c](https://github.com/Microsoft/fast-dna/commit/a92ed4c))





## [3.0.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@3.0.0...@microsoft/fast-layouts-react@3.0.1) (2018-10-09)


### Bug Fixes

* update peer dependencies to match expected versions ([#1009](https://github.com/Microsoft/fast-dna/issues/1009)) ([23997a3](https://github.com/Microsoft/fast-dna/commit/23997a3))





# [3.0.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@2.2.3...@microsoft/fast-layouts-react@3.0.0) (2018-10-06)


### Bug Fixes

* allow nested at rules in styles without needing to define it in the class name contract ([#985](https://github.com/Microsoft/fast-dna/issues/985)) ([6479d4c](https://github.com/Microsoft/fast-dna/commit/6479d4c))
* move foundation component into a new package and implement it in component and layout libraries ([#979](https://github.com/Microsoft/fast-dna/issues/979)) ([acae283](https://github.com/Microsoft/fast-dna/commit/acae283))


### chore

* remove the 'I' from interfaces ([#997](https://github.com/Microsoft/fast-dna/issues/997)) ([d924df8](https://github.com/Microsoft/fast-dna/commit/d924df8))


### Features

* update class-name contracts to be entirely optional ([#959](https://github.com/Microsoft/fast-dna/issues/959)) ([58e0421](https://github.com/Microsoft/fast-dna/commit/58e0421))
* update JSSManager context API ([#993](https://github.com/Microsoft/fast-dna/issues/993)) ([2114213](https://github.com/Microsoft/fast-dna/commit/2114213))


### BREAKING CHANGES

* Interfaces have been renamed to remove the "I".





<a name="2.2.3"></a>
## [2.2.3](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@2.2.2...@microsoft/fast-layouts-react@2.2.3) (2018-09-24)

**Note:** Version bump only for package @microsoft/fast-layouts-react





<a name="2.2.2"></a>
## [2.2.2](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@2.2.1...@microsoft/fast-layouts-react@2.2.2) (2018-09-21)

**Note:** Version bump only for package @microsoft/fast-layouts-react





<a name="2.2.1"></a>
## [2.2.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-layouts-react@2.2.0...@microsoft/fast-layouts-react@2.2.1) (2018-09-19)

**Note:** Version bump only for package @microsoft/fast-layouts-react





<a name="2.2.0"></a>
# 2.2.0 (2018-09-11)


### Bug Fixes

* **page:** replaces auto with 0 to fix a cross browser compatability issue with css grid ([#860](https://github.com/Microsoft/fast-dna/issues/860)) ([418a303](https://github.com/Microsoft/fast-dna/commit/418a303))


### Features

* add contrast based color system ([#810](https://github.com/Microsoft/fast-dna/issues/810)) ([5ec457c](https://github.com/Microsoft/fast-dna/commit/5ec457c))



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

* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **fast-layouts-react:** fix export issue to allow Column, Grid, and Page components to be imported from the root level of the package ([#554](https://github.com/Microsoft/fast-dna/issues/554)) ([83c08b2](https://github.com/Microsoft/fast-dna/commit/83c08b2))


### Features

* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))
* **fast-development-site:** add resize capability to row component ([#559](https://github.com/Microsoft/fast-dna/issues/559)) ([3510400](https://github.com/Microsoft/fast-dna/commit/3510400))
* **layouts:** add page, grid, and column layout configuration ([#471](https://github.com/Microsoft/fast-dna/issues/471)) ([97830fb](https://github.com/Microsoft/fast-dna/commit/97830fb))
* **layouts:** create configurable breakpoint tracker utility ([#467](https://github.com/Microsoft/fast-dna/issues/467)) ([4b1ed8a](https://github.com/Microsoft/fast-dna/commit/4b1ed8a))
* **shell:** add shell package with app-grid ([#461](https://github.com/Microsoft/fast-dna/issues/461)) ([dabb3b4](https://github.com/Microsoft/fast-dna/commit/dabb3b4))





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

* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **fast-layouts-react:** fix export issue to allow Column, Grid, and Page components to be imported from the root level of the package ([#554](https://github.com/Microsoft/fast-dna/issues/554)) ([83c08b2](https://github.com/Microsoft/fast-dna/commit/83c08b2))


### Features

* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))
* **fast-development-site:** add resize capability to row component ([#559](https://github.com/Microsoft/fast-dna/issues/559)) ([3510400](https://github.com/Microsoft/fast-dna/commit/3510400))
* **layouts:** add page, grid, and column layout configuration ([#471](https://github.com/Microsoft/fast-dna/issues/471)) ([97830fb](https://github.com/Microsoft/fast-dna/commit/97830fb))
* **layouts:** create configurable breakpoint tracker utility ([#467](https://github.com/Microsoft/fast-dna/issues/467)) ([4b1ed8a](https://github.com/Microsoft/fast-dna/commit/4b1ed8a))
* **shell:** add shell package with app-grid ([#461](https://github.com/Microsoft/fast-dna/issues/461)) ([dabb3b4](https://github.com/Microsoft/fast-dna/commit/dabb3b4))




<a name="1.9.0"></a>
# [1.9.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.9.0) (2018-07-14)


### Bug Fixes

* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **fast-layouts-react:** fix export issue to allow Column, Grid, and Page components to be imported from the root level of the package ([#554](https://github.com/Microsoft/fast-dna/issues/554)) ([83c08b2](https://github.com/Microsoft/fast-dna/commit/83c08b2))


### Features

* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))
* **fast-development-site:** add resize capability to row component ([#559](https://github.com/Microsoft/fast-dna/issues/559)) ([3510400](https://github.com/Microsoft/fast-dna/commit/3510400))
* **layouts:** add page, grid, and column layout configuration ([#471](https://github.com/Microsoft/fast-dna/issues/471)) ([97830fb](https://github.com/Microsoft/fast-dna/commit/97830fb))
* **layouts:** create configurable breakpoint tracker utility ([#467](https://github.com/Microsoft/fast-dna/issues/467)) ([4b1ed8a](https://github.com/Microsoft/fast-dna/commit/4b1ed8a))
* **shell:** add shell package with app-grid ([#461](https://github.com/Microsoft/fast-dna/issues/461)) ([dabb3b4](https://github.com/Microsoft/fast-dna/commit/dabb3b4))




<a name="1.8.0"></a>
# [1.8.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.8.0) (2018-06-12)




<a name="1.7.0"></a>
# [1.7.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.7.0) (2018-06-01)


### Features

* **layouts:** add page, grid, and column layout configuration ([#471](https://github.com/Microsoft/fast-dna/issues/471)) ([97830fb](https://github.com/Microsoft/fast-dna/commit/97830fb))
* **layouts:** create configurable breakpoint tracker utility ([#467](https://github.com/Microsoft/fast-dna/issues/467)) ([4b1ed8a](https://github.com/Microsoft/fast-dna/commit/4b1ed8a))
* **shell:** add shell package with app-grid ([#461](https://github.com/Microsoft/fast-dna/issues/461)) ([dabb3b4](https://github.com/Microsoft/fast-dna/commit/dabb3b4))
