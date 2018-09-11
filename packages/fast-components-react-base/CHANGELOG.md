# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.2.0"></a>
# 2.2.0 (2018-09-11)


### Features

* add contrast based color system ([#810](https://github.com/Microsoft/fast-dna/issues/810)) ([5ec457c](https://github.com/Microsoft/fast-dna/commit/5ec457c))
* **caption:** add caption component ([#829](https://github.com/Microsoft/fast-dna/issues/829)) ([026cc4e](https://github.com/Microsoft/fast-dna/commit/026cc4e))
* **dialog:** add onDismiss callback to support "soft dismiss" functionality ([#869](https://github.com/Microsoft/fast-dna/issues/869)) ([d295fc9](https://github.com/Microsoft/fast-dna/commit/d295fc9))
* **progress:** add progress component ([#835](https://github.com/Microsoft/fast-dna/issues/835)) ([44d9bb1](https://github.com/Microsoft/fast-dna/commit/44d9bb1))



<a name="2.1.0"></a>
# 2.1.0 (2018-08-29)


### Bug Fixes

* **fast-components-react-base:** allow horizontal overflow to accept passed class names ([#783](https://github.com/Microsoft/fast-dna/issues/783)) ([40ae7a9](https://github.com/Microsoft/fast-dna/commit/40ae7a9))
* **hyperlink:** correctly handle href as a handled prop and update documentation ([#769](https://github.com/Microsoft/fast-dna/issues/769)) ([bc771b5](https://github.com/Microsoft/fast-dna/commit/bc771b5))
* remove extraneous requirements for snapshot interface ([#788](https://github.com/Microsoft/fast-dna/issues/788)) ([c043fc6](https://github.com/Microsoft/fast-dna/commit/c043fc6))


### Features

* update Lerna to ^3.0.0 ([#795](https://github.com/Microsoft/fast-dna/issues/795)) ([9ce9a56](https://github.com/Microsoft/fast-dna/commit/9ce9a56))
* upgrade to TypeScript 3.0.0 ([#793](https://github.com/Microsoft/fast-dna/issues/793)) ([e203e86](https://github.com/Microsoft/fast-dna/commit/e203e86))
* **fast-components-react-base:** add callback to horizontal overflow to return and object that informs scroll start and end ([#797](https://github.com/Microsoft/fast-dna/issues/797)) ([37975f3](https://github.com/Microsoft/fast-dna/commit/37975f3))
* **fast-components-react-base:** add tabs component ([#761](https://github.com/Microsoft/fast-dna/issues/761)) ([24a5bb3](https://github.com/Microsoft/fast-dna/commit/24a5bb3))
* **fast-development-site-react:** add component example transparency as opt-out ([#816](https://github.com/Microsoft/fast-dna/issues/816)) ([705cb00](https://github.com/Microsoft/fast-dna/commit/705cb00))
* **paragraph:** adds paragraph as a new MSFT component ([#805](https://github.com/Microsoft/fast-dna/issues/805)) ([8325d3f](https://github.com/Microsoft/fast-dna/commit/8325d3f))



<a name="2.0.0-corrected"></a>
# 2.0.0-corrected (2018-08-03)


### Bug Fixes

* **button:** fixes an issue where href was not being passed as part of the created anchor element ([#411](https://github.com/Microsoft/fast-dna/issues/411)) ([35928e1](https://github.com/Microsoft/fast-dna/commit/35928e1))
* ensure app build and tslint processes run prior in the build gate ([#132](https://github.com/Microsoft/fast-dna/issues/132)) ([e74f953](https://github.com/Microsoft/fast-dna/commit/e74f953))
* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* fix imports after updating types ([#644](https://github.com/Microsoft/fast-dna/issues/644)) ([65ed738](https://github.com/Microsoft/fast-dna/commit/65ed738))
* fix tslint globbing issue and enforce whitespace in import/export statements ([#219](https://github.com/Microsoft/fast-dna/issues/219)) ([4637a90](https://github.com/Microsoft/fast-dna/commit/4637a90))
* travis-CI build-break ([#336](https://github.com/Microsoft/fast-dna/issues/336)) ([bffbf5e](https://github.com/Microsoft/fast-dna/commit/bffbf5e))
* **image:** fix image schema to match the current code implementation ([#671](https://github.com/Microsoft/fast-dna/issues/671)) ([8618cd1](https://github.com/Microsoft/fast-dna/commit/8618cd1))
* **label:** fix spelling error in interface name for managed classes ([#755](https://github.com/Microsoft/fast-dna/issues/755)) ([b57b4c1](https://github.com/Microsoft/fast-dna/commit/b57b4c1))
* **naming:** fix component names to align to repo standard ([#202](https://github.com/Microsoft/fast-dna/issues/202)) ([298836e](https://github.com/Microsoft/fast-dna/commit/298836e))
* **toggle:** toggle "Selected" option does not work and is missing background color ([#663](https://github.com/Microsoft/fast-dna/issues/663)) ([e05abca](https://github.com/Microsoft/fast-dna/commit/e05abca))
* **tslint:** fixes incorrect tslint rule regarding ordered imports ([#188](https://github.com/Microsoft/fast-dna/issues/188)) ([ebe0b30](https://github.com/Microsoft/fast-dna/commit/ebe0b30))


### Features

* add divider component ([#205](https://github.com/Microsoft/fast-dna/issues/205)) ([ae25c38](https://github.com/Microsoft/fast-dna/commit/ae25c38))
* add form generator to the packages ([#311](https://github.com/Microsoft/fast-dna/issues/311)) ([a339b3c](https://github.com/Microsoft/fast-dna/commit/a339b3c))
* add hypertext component ([#210](https://github.com/Microsoft/fast-dna/issues/210)) ([9e363ff](https://github.com/Microsoft/fast-dna/commit/9e363ff))
* add sketch utility and design kit ([#495](https://github.com/Microsoft/fast-dna/issues/495)) ([ce8feb3](https://github.com/Microsoft/fast-dna/commit/ce8feb3))
* add snapshot test suite ([#207](https://github.com/Microsoft/fast-dna/issues/207)) ([7ceaafe](https://github.com/Microsoft/fast-dna/commit/7ceaafe))
* catagorizing relevant dependencies as peerDependencies ([#186](https://github.com/Microsoft/fast-dna/issues/186)) ([7e15db6](https://github.com/Microsoft/fast-dna/commit/7e15db6))
* Forked Class name contracts so we can have one for Base and one for MSFT ([#262](https://github.com/Microsoft/fast-dna/issues/262)) ([a4c54c0](https://github.com/Microsoft/fast-dna/commit/a4c54c0))
* **checkbox:** add new component with styles ([#252](https://github.com/Microsoft/fast-dna/issues/252)) ([3ad3988](https://github.com/Microsoft/fast-dna/commit/3ad3988))
* remove JSS manager dependency from React base components ([#148](https://github.com/Microsoft/fast-dna/issues/148)) ([48de34a](https://github.com/Microsoft/fast-dna/commit/48de34a))
* **button:** updates to current msft styles ([#314](https://github.com/Microsoft/fast-dna/issues/314)) ([0029e06](https://github.com/Microsoft/fast-dna/commit/0029e06))
* **checkbox:** update styling and incorrect states ([#371](https://github.com/Microsoft/fast-dna/issues/371)) ([45cbe3c](https://github.com/Microsoft/fast-dna/commit/45cbe3c))
* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))
* **development-site:** add component for title and component for title with brand color applied ([#501](https://github.com/Microsoft/fast-dna/issues/501)) ([d1d9d5c](https://github.com/Microsoft/fast-dna/commit/d1d9d5c))
* **dialog:** add dialog as a new component ([#752](https://github.com/Microsoft/fast-dna/issues/752)) ([2864021](https://github.com/Microsoft/fast-dna/commit/2864021))
* **fast-components-react-base:** add horizontal overflow ([#739](https://github.com/Microsoft/fast-dna/issues/739)) ([c6b0ebf](https://github.com/Microsoft/fast-dna/commit/c6b0ebf))
* **fast-components-react-base:** add unit tests to all components and update code coverage expectations ([#699](https://github.com/Microsoft/fast-dna/issues/699)) ([c476889](https://github.com/Microsoft/fast-dna/commit/c476889))
* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))
* **form generator:** updates styles found in configuration pane ([#420](https://github.com/Microsoft/fast-dna/issues/420)) ([919121b](https://github.com/Microsoft/fast-dna/commit/919121b))
* **Image:** add new component and msft styles ([#237](https://github.com/Microsoft/fast-dna/issues/237)) ([ea057ed](https://github.com/Microsoft/fast-dna/commit/ea057ed))
* **label:** add new component and msft styles ([#265](https://github.com/Microsoft/fast-dna/issues/265)) ([0328028](https://github.com/Microsoft/fast-dna/commit/0328028))
* **structure:** updates the structure for the development site ([#217](https://github.com/Microsoft/fast-dna/issues/217)) ([e153b0b](https://github.com/Microsoft/fast-dna/commit/e153b0b))
* **toggle:** add new component and msft styles ([#212](https://github.com/Microsoft/fast-dna/issues/212)) ([b9dd3e0](https://github.com/Microsoft/fast-dna/commit/b9dd3e0))
* **typography:** add typography as a new base component and style ([#247](https://github.com/Microsoft/fast-dna/issues/247)) ([df3804e](https://github.com/Microsoft/fast-dna/commit/df3804e))
* update code coverage on travis ([#330](https://github.com/Microsoft/fast-dna/issues/330)) ([63ab4f4](https://github.com/Microsoft/fast-dna/commit/63ab4f4))
* update to React 16.3 ([#251](https://github.com/Microsoft/fast-dna/issues/251)) ([1fe77ef](https://github.com/Microsoft/fast-dna/commit/1fe77ef))


### BREAKING CHANGES

* **label:** contains a change to interface names





<a name="2.1.0"></a>
# [2.1.0](https://github.com/Microsoft/fast-dna/compare/v2.0.0-corrected...v2.1.0) (2018-08-29)


### Bug Fixes

* **fast-components-react-base:** allow horizontal overflow to accept passed class names ([#783](https://github.com/Microsoft/fast-dna/issues/783)) ([40ae7a9](https://github.com/Microsoft/fast-dna/commit/40ae7a9))
* **hyperlink:** correctly handle href as a handled prop and update documentation ([#769](https://github.com/Microsoft/fast-dna/issues/769)) ([bc771b5](https://github.com/Microsoft/fast-dna/commit/bc771b5))
* remove extraneous requirements for snapshot interface ([#788](https://github.com/Microsoft/fast-dna/issues/788)) ([c043fc6](https://github.com/Microsoft/fast-dna/commit/c043fc6))


### Features

* update Lerna to ^3.0.0 ([#795](https://github.com/Microsoft/fast-dna/issues/795)) ([9ce9a56](https://github.com/Microsoft/fast-dna/commit/9ce9a56))
* upgrade to TypeScript 3.0.0 ([#793](https://github.com/Microsoft/fast-dna/issues/793)) ([e203e86](https://github.com/Microsoft/fast-dna/commit/e203e86))
* **fast-components-react-base:** add callback to horizontal overflow to return and object that informs scroll start and end ([#797](https://github.com/Microsoft/fast-dna/issues/797)) ([37975f3](https://github.com/Microsoft/fast-dna/commit/37975f3))
* **fast-components-react-base:** add tabs component ([#761](https://github.com/Microsoft/fast-dna/issues/761)) ([24a5bb3](https://github.com/Microsoft/fast-dna/commit/24a5bb3))
* **fast-development-site-react:** add component example transparency as opt-out ([#816](https://github.com/Microsoft/fast-dna/issues/816)) ([705cb00](https://github.com/Microsoft/fast-dna/commit/705cb00))
* **paragraph:** adds paragraph as a new MSFT component ([#805](https://github.com/Microsoft/fast-dna/issues/805)) ([8325d3f](https://github.com/Microsoft/fast-dna/commit/8325d3f))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v2.0.0) (2018-08-02)


### Bug Fixes

* fix imports after updating types ([#644](https://github.com/Microsoft/fast-dna/issues/644)) ([65ed738](https://github.com/Microsoft/fast-dna/commit/65ed738))
* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **image:** fix image schema to match the current code implementation ([#671](https://github.com/Microsoft/fast-dna/issues/671)) ([8618cd1](https://github.com/Microsoft/fast-dna/commit/8618cd1))
* **label:** fix spelling error in interface name for managed classes ([#755](https://github.com/Microsoft/fast-dna/issues/755)) ([b57b4c1](https://github.com/Microsoft/fast-dna/commit/b57b4c1))
* **toggle:** toggle "Selected" option does not work and is missing background color ([#663](https://github.com/Microsoft/fast-dna/issues/663)) ([e05abca](https://github.com/Microsoft/fast-dna/commit/e05abca))


### Features

* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))
* add sketch utility and design kit ([#495](https://github.com/Microsoft/fast-dna/issues/495)) ([ce8feb3](https://github.com/Microsoft/fast-dna/commit/ce8feb3))
* **development-site:** add component for title and component for title with brand color applied ([#501](https://github.com/Microsoft/fast-dna/issues/501)) ([d1d9d5c](https://github.com/Microsoft/fast-dna/commit/d1d9d5c))
* **dialog:** add dialog as a new component ([#752](https://github.com/Microsoft/fast-dna/issues/752)) ([2864021](https://github.com/Microsoft/fast-dna/commit/2864021))
* **fast-components-react-base:** add horizontal overflow ([#739](https://github.com/Microsoft/fast-dna/issues/739)) ([c6b0ebf](https://github.com/Microsoft/fast-dna/commit/c6b0ebf))
* **fast-components-react-base:** add unit tests to all components and update code coverage expectations ([#699](https://github.com/Microsoft/fast-dna/issues/699)) ([c476889](https://github.com/Microsoft/fast-dna/commit/c476889))
* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))


### BREAKING CHANGES

* **label:** contains a change to interface names




<a name="1.9.0"></a>
# [1.9.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.9.0) (2018-07-14)


### Bug Fixes

* fix imports after updating types ([#644](https://github.com/Microsoft/fast-dna/issues/644)) ([65ed738](https://github.com/Microsoft/fast-dna/commit/65ed738))
* **fast-components-react-msft:** fixes error running jest with components that require chroma ([#687](https://github.com/Microsoft/fast-dna/issues/687)) ([140457c](https://github.com/Microsoft/fast-dna/commit/140457c))
* **image:** fix image schema to match the current code implementation ([#671](https://github.com/Microsoft/fast-dna/issues/671)) ([8618cd1](https://github.com/Microsoft/fast-dna/commit/8618cd1))
* **toggle:** toggle "Selected" option does not work and is missing background color ([#663](https://github.com/Microsoft/fast-dna/issues/663)) ([e05abca](https://github.com/Microsoft/fast-dna/commit/e05abca))


### Features

* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))
* add sketch utility and design kit ([#495](https://github.com/Microsoft/fast-dna/issues/495)) ([ce8feb3](https://github.com/Microsoft/fast-dna/commit/ce8feb3))
* **development-site:** add component for title and component for title with brand color applied ([#501](https://github.com/Microsoft/fast-dna/issues/501)) ([d1d9d5c](https://github.com/Microsoft/fast-dna/commit/d1d9d5c))
* **fast-css-editor-react:** add default editor component and position component ([#636](https://github.com/Microsoft/fast-dna/issues/636)) ([72037a8](https://github.com/Microsoft/fast-dna/commit/72037a8))




<a name="1.8.0"></a>
# [1.8.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.8.0) (2018-06-12)


### Features

* add sketch utility and design kit ([#495](https://github.com/Microsoft/fast-dna/issues/495)) ([ce8feb3](https://github.com/Microsoft/fast-dna/commit/ce8feb3))
* **development-site:** add component for title and component for title with brand color applied ([#501](https://github.com/Microsoft/fast-dna/issues/501)) ([d1d9d5c](https://github.com/Microsoft/fast-dna/commit/d1d9d5c))




<a name="1.7.0"></a>
# [1.7.0](https://github.com/Microsoft/fast-dna/compare/v1.6.0...v1.7.0) (2018-06-01)


### Features

* **detail view:** add detail view ([#470](https://github.com/Microsoft/fast-dna/issues/470)) ([665b871](https://github.com/Microsoft/fast-dna/commit/665b871))




<a name="1.6.0"></a>
# [1.6.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.6.0) (2018-05-16)




<a name="1.5.0"></a>
# [1.5.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.5.0) (2018-05-16)


### Bug Fixes

* **button:** fixes an issue where href was not being passed as part of the created anchor element ([#411](https://github.com/Microsoft/fast-dna/issues/411)) ([35928e1](https://github.com/Microsoft/fast-dna/commit/35928e1))


### Features

* **form generator:** updates styles found in configuration pane ([#420](https://github.com/Microsoft/fast-dna/issues/420)) ([919121b](https://github.com/Microsoft/fast-dna/commit/919121b))




<a name="1.4.0"></a>
# [1.4.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.4.0) (2018-05-14)


### Bug Fixes

* **button:** fixes an issue where href was not being passed as part of the created anchor element ([#411](https://github.com/Microsoft/fast-dna/issues/411)) ([35928e1](https://github.com/Microsoft/fast-dna/commit/35928e1))


### Features

* **form generator:** updates styles found in configuration pane ([#420](https://github.com/Microsoft/fast-dna/issues/420)) ([919121b](https://github.com/Microsoft/fast-dna/commit/919121b))




<a name="1.3.0"></a>
# [1.3.0](https://github.com/Microsoft/fast-dna/compare/v1.2.0...v1.3.0) (2018-05-11)


### Bug Fixes

* **button:** fixes an issue where href was not being passed as part of the created anchor element ([#411](https://github.com/Microsoft/fast-dna/issues/411)) ([35928e1](https://github.com/Microsoft/fast-dna/commit/35928e1))




<a name="1.2.0"></a>
# 1.2.0 (2018-05-10)

### Features

* **checkbox:** update styling and incorrect states ([#371](https://github.com/Microsoft/fast-dna/issues/371)) ([45cbe3c](https://github.com/Microsoft/fast-dna/commit/45cbe3c))


<a name="1.1.0"></a>
# 1.1.0 (2018-05-09)


### Bug Fixes

* ensure app build and tslint processes run prior in the build gate ([#132](https://github.com/Microsoft/fast-dna/issues/132)) ([e74f953](https://github.com/Microsoft/fast-dna/commit/e74f953))
* **naming:** fix component names to align to repo standard ([#202](https://github.com/Microsoft/fast-dna/issues/202)) ([298836e](https://github.com/Microsoft/fast-dna/commit/298836e))
* **tslint:** fixes incorrect tslint rule regarding ordered imports ([#188](https://github.com/Microsoft/fast-dna/issues/188)) ([ebe0b30](https://github.com/Microsoft/fast-dna/commit/ebe0b30))
* fix tslint globbing issue and enforce whitespace in import/export statements ([#219](https://github.com/Microsoft/fast-dna/issues/219)) ([4637a90](https://github.com/Microsoft/fast-dna/commit/4637a90))
* travis-CI build-break ([#336](https://github.com/Microsoft/fast-dna/issues/336)) ([bffbf5e](https://github.com/Microsoft/fast-dna/commit/bffbf5e))


### Features

* add divider component ([#205](https://github.com/Microsoft/fast-dna/issues/205)) ([ae25c38](https://github.com/Microsoft/fast-dna/commit/ae25c38))
* add form generator to the packages ([#311](https://github.com/Microsoft/fast-dna/issues/311)) ([a339b3c](https://github.com/Microsoft/fast-dna/commit/a339b3c))
* add hypertext component ([#210](https://github.com/Microsoft/fast-dna/issues/210)) ([9e363ff](https://github.com/Microsoft/fast-dna/commit/9e363ff))
* add snapshot test suite ([#207](https://github.com/Microsoft/fast-dna/issues/207)) ([7ceaafe](https://github.com/Microsoft/fast-dna/commit/7ceaafe))
* catagorizing relevant dependencies as peerDependencies ([#186](https://github.com/Microsoft/fast-dna/issues/186)) ([7e15db6](https://github.com/Microsoft/fast-dna/commit/7e15db6))
* Forked Class name contracts so we can have one for Base and one for MSFT ([#262](https://github.com/Microsoft/fast-dna/issues/262)) ([a4c54c0](https://github.com/Microsoft/fast-dna/commit/a4c54c0))
* **typography:** add typography as a new base component and style ([#247](https://github.com/Microsoft/fast-dna/issues/247)) ([df3804e](https://github.com/Microsoft/fast-dna/commit/df3804e))
* remove JSS manager dependency from React base components ([#148](https://github.com/Microsoft/fast-dna/issues/148)) ([48de34a](https://github.com/Microsoft/fast-dna/commit/48de34a))
* **button:** updates to current msft styles ([#314](https://github.com/Microsoft/fast-dna/issues/314)) ([0029e06](https://github.com/Microsoft/fast-dna/commit/0029e06))
* update code coverage on travis ([#330](https://github.com/Microsoft/fast-dna/issues/330)) ([63ab4f4](https://github.com/Microsoft/fast-dna/commit/63ab4f4))
* **checkbox:** add new component with styles ([#252](https://github.com/Microsoft/fast-dna/issues/252)) ([3ad3988](https://github.com/Microsoft/fast-dna/commit/3ad3988))
* **Image:** add new component and msft styles ([#237](https://github.com/Microsoft/fast-dna/issues/237)) ([ea057ed](https://github.com/Microsoft/fast-dna/commit/ea057ed))
* **label:** add new component and msft styles ([#265](https://github.com/Microsoft/fast-dna/issues/265)) ([0328028](https://github.com/Microsoft/fast-dna/commit/0328028))
* **structure:** updates the structure for the development site ([#217](https://github.com/Microsoft/fast-dna/issues/217)) ([e153b0b](https://github.com/Microsoft/fast-dna/commit/e153b0b))
* **toggle:** add new component and msft styles ([#212](https://github.com/Microsoft/fast-dna/issues/212)) ([b9dd3e0](https://github.com/Microsoft/fast-dna/commit/b9dd3e0))
* update to React 16.3 ([#251](https://github.com/Microsoft/fast-dna/issues/251)) ([1fe77ef](https://github.com/Microsoft/fast-dna/commit/1fe77ef))
