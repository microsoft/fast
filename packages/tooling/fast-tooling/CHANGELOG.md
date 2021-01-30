# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.15.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.14.0...@microsoft/fast-tooling@0.15.0) (2021-01-30)


### Bug Fixes

* include numerals, parenthesis and capital letters from MDN data conversion combinator RegEx ([#4195](https://github.com/Microsoft/fast/issues/4195)) ([e9308a2](https://github.com/Microsoft/fast/commit/e9308a22cb78de095d8e704065c87ce34e0a037f))
* resolve nesting issues in converted MDN data ([#4203](https://github.com/Microsoft/fast/issues/4203)) ([2aecf3c](https://github.com/Microsoft/fast/commit/2aecf3c4507dc1b03d6e9f26bdb3b2d195a56b9f))
* update nesting to be interpreted by manual parsing instead of RegEx ([#4253](https://github.com/Microsoft/fast/issues/4253)) ([f32e34a](https://github.com/Microsoft/fast/commit/f32e34aa699dd550cd79361b99437dbf9c810044))


### Features

* separate out cjs modules from ejs so that utilities may be used in a node environment ([#4277](https://github.com/Microsoft/fast/issues/4277)) ([adffd1e](https://github.com/Microsoft/fast/commit/adffd1e4b275648019a98e14555bbce535053d1e))





# [0.14.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.13.0...@microsoft/fast-tooling@0.14.0) (2020-12-16)


### Bug Fixes

* added more precision when dealing with brackets ([#4184](https://github.com/Microsoft/fast/issues/4184)) ([bbb4c06](https://github.com/Microsoft/fast/commit/bbb4c068e2f70f2b4116cabcf472f072a5312e8f))


### Features

* allow filtering MDN data by status ([#4164](https://github.com/Microsoft/fast/issues/4164)) ([dc58c34](https://github.com/Microsoft/fast/commit/dc58c344bbe449501fde918044352c78f11a64f6))





# [0.13.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.12.0...@microsoft/fast-tooling@0.13.0) (2020-12-02)


### Features

* add a mapping of MDN syntaxes to be used as reference ([#4139](https://github.com/Microsoft/fast/issues/4139)) ([e5b3545](https://github.com/Microsoft/fast/commit/e5b3545864ee9ed5117960cb65feef9fbb4f88a4))





# [0.12.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.11.1...@microsoft/fast-tooling@0.12.0) (2020-11-19)


### Bug Fixes

* assign all react components an originatorId to determine re-rendering of form elements ([#4088](https://github.com/Microsoft/fast/issues/4088)) ([6858ff2](https://github.com/Microsoft/fast/commit/6858ff266dbf1f7957bd08d13645ca0fad31552c)), closes [#3628](https://github.com/Microsoft/fast/issues/3628)
* assigns children to named slots properly ([#4026](https://github.com/Microsoft/fast/issues/4026)) ([cddf930](https://github.com/Microsoft/fast/commit/cddf930108696eab7481389776aaf5895b9ea8c0))


### Features

* add a utility to map MDN data to a format that will be usable by generated UI ([#4066](https://github.com/Microsoft/fast/issues/4066)) ([faad57e](https://github.com/Microsoft/fast/commit/faad57ee3982832c67d01f1c00047665727e2c6f))
* update generated css data to include more nesting solutions as well as new exports for property, syntax and types lists ([#4125](https://github.com/Microsoft/fast/issues/4125)) ([b814aed](https://github.com/Microsoft/fast/commit/b814aed588eadc0d24185243ac864105d22cd190))





## [0.11.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.11.0...@microsoft/fast-tooling@0.11.1) (2020-10-14)


### Bug Fixes

* clean up and rename registered utilities to registered services ([#3984](https://github.com/Microsoft/fast/issues/3984)) ([22f6426](https://github.com/Microsoft/fast/commit/22f6426c89cedefeaf26adee56b428e9a9b69515))
* rename instances of adaptor to adapter ([#3983](https://github.com/Microsoft/fast/issues/3983)) ([3aa532e](https://github.com/Microsoft/fast/commit/3aa532e214a9300ae8b4cf305f7d1baab279b7be))


### Reverts

* Revert "Change files" ([eb81953](https://github.com/Microsoft/fast/commit/eb81953c00525c2fc3b708f673a3f7382e1bcc00))





# [0.11.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.10.0...@microsoft/fast-tooling@0.11.0) (2020-09-28)


### Bug Fixes

* add slot as attribute to elements that are assigned to a slot ([#3919](https://github.com/Microsoft/fast/issues/3919)) ([9a65648](https://github.com/Microsoft/fast/commit/9a6564847a5d848d85fc0bfc8bc66203b233b19a)), closes [#3910](https://github.com/Microsoft/fast/issues/3910)
* address a nesting issue with the monaco adapter ([#3946](https://github.com/Microsoft/fast/issues/3946)) ([cca6bf4](https://github.com/Microsoft/fast/commit/cca6bf4a0c0f3c4a02048ac6b3ef53a1ca2b28c9))
* allow null attributes when mapping from Monaco editor values to be treated as booleans ([#3927](https://github.com/Microsoft/fast/issues/3927)) ([2d8b47d](https://github.com/Microsoft/fast/commit/2d8b47d3f9442465d33a6a907d85b77d27511223))
* removes newlines and leading spaces from returned monaco value ([#3971](https://github.com/Microsoft/fast/issues/3971)) ([883e8ec](https://github.com/Microsoft/fast/commit/883e8ec816a20bb64bef0ed63c87f98a3c2159af)), closes [#3949](https://github.com/Microsoft/fast/issues/3949)


### Features

* add history and a way to retrieve history from the message system ([#3834](https://github.com/Microsoft/fast/issues/3834)) ([76dee0d](https://github.com/Microsoft/fast/commit/76dee0d0c9b885435ab094c59cd0d3c931a11d0f))
* add monaco adapter and adapter actions ([#3917](https://github.com/Microsoft/fast/issues/3917)) ([dcf17ee](https://github.com/Microsoft/fast/commit/dcf17ee4a4eb25b7802dc4324426bbba806fce21)), closes [#3898](https://github.com/Microsoft/fast/issues/3898) [#3916](https://github.com/Microsoft/fast/issues/3916) [#3562](https://github.com/Microsoft/fast/issues/3562)
* add monaco adapter to component explorer site ([#3949](https://github.com/Microsoft/fast/issues/3949)) ([1aa994e](https://github.com/Microsoft/fast/commit/1aa994e986e52e8b1fab93e65665a1d4e56ae496))
* add vscode-html-languageservice parser converter to data dictionary ([#3898](https://github.com/Microsoft/fast/issues/3898)) ([d24b874](https://github.com/Microsoft/fast/commit/d24b8746a8af5696f969cfb750ab63e1c7adc224)), closes [#3562](https://github.com/Microsoft/fast/issues/3562)
* allow a dictionary id to be set during initialization ([#3955](https://github.com/Microsoft/fast/issues/3955)) ([70f3d00](https://github.com/Microsoft/fast/commit/70f3d0076a88fb42f26e610fa25204981aa2678e))
* allow arbitrary options to be passed with any message system message ([#3916](https://github.com/Microsoft/fast/issues/3916)) ([9f2dd80](https://github.com/Microsoft/fast/commit/9f2dd807c5199deab55a5fda7c709556e9b5bbc0))





# [0.10.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.9.1...@microsoft/fast-tooling@0.10.0) (2020-09-10)


### Features

* add a shortcut utility ([#3814](https://github.com/Microsoft/fast/issues/3814)) ([8b44da4](https://github.com/Microsoft/fast/commit/8b44da42e82ac98eb7d1fcb59781c40c527c6526)), closes [#3781](https://github.com/Microsoft/fast/issues/3781)





## [0.9.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.9.0...@microsoft/fast-tooling@0.9.1) (2020-08-27)

**Note:** Version bump only for package @microsoft/fast-tooling





# [0.9.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.8.0...@microsoft/fast-tooling@0.9.0) (2020-08-13)


### Features

* add a utility that interprets a data dictionary into HTML for monaco ([#3645](https://github.com/Microsoft/fast/issues/3645)) ([b3d4657](https://github.com/Microsoft/fast/commit/b3d4657e6dfbf56e1b0b6b3f42962881289b9776))


### Reverts

* Revert "chore: update all http to https to resolve WS1262 security vulnerability (#3658)" (#3699) ([0cac64a](https://github.com/Microsoft/fast/commit/0cac64a869e1b65a94ef14ed50b1324d0e15be46)), closes [#3658](https://github.com/Microsoft/fast/issues/3658) [#3699](https://github.com/Microsoft/fast/issues/3699)





# [0.8.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.7.0...@microsoft/fast-tooling@0.8.0) (2020-07-31)


### Bug Fixes

* the Navigation component can now drag and drop nested component ([#3598](https://github.com/Microsoft/fast/issues/3598)) ([f2a3948](https://github.com/Microsoft/fast/commit/f2a39489015be38f2372060a7898b0ef1cf96702))


### Features

* add data utilities to retrieve linked data from a data dictionary and ids of linked data items ([#3583](https://github.com/Microsoft/fast/issues/3583)) ([8629041](https://github.com/Microsoft/fast/commit/862904104393fc1c2212d345f7063e8f420e2b36))





# [0.7.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.6.1...@microsoft/fast-tooling@0.7.0) (2020-07-14)


### Bug Fixes

* removed the description from the title in the component explorer pane ([#3450](https://github.com/Microsoft/fast/issues/3450)) ([33aadb1](https://github.com/Microsoft/fast/commit/33aadb1e7b1ba96170f5682fbd8db668bf0b22b7))


### Features

* add default values to the schema when mapping from a component definition ([#3509](https://github.com/Microsoft/fast/issues/3509)) ([5c37742](https://github.com/Microsoft/fast/commit/5c3774258c2edf2af6fd8f2bdbb1ea07a59adee2))
* update typescript version and remove utility types dependencies for react packages ([#3422](https://github.com/Microsoft/fast/issues/3422)) ([09d07b5](https://github.com/Microsoft/fast/commit/09d07b580cda3bcc5d28f83d3568521f710c9576))





## [0.6.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.6.0...@microsoft/fast-tooling@0.6.1) (2020-06-26)

**Note:** Version bump only for package @microsoft/fast-tooling





# [0.6.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.5.1...@microsoft/fast-tooling@0.6.0) (2020-06-15)


### Bug Fixes

* ensure that named slots use pascal case and text nodes do not error from attributes being assigned to them ([#3263](https://github.com/Microsoft/fast/issues/3263)) ([f772fa0](https://github.com/Microsoft/fast/commit/f772fa0685c92027821ef9519f4a88c1d8975e5a))
* make the web component definition for values more permissable ([#3257](https://github.com/Microsoft/fast/issues/3257)) ([9969834](https://github.com/Microsoft/fast/commit/9969834d7d79e6198f825edc97ba19739fa3304c))
* set boolean attributes in the htmlMapper and unset them on true/false values ([#3282](https://github.com/Microsoft/fast/issues/3282)) ([d130cd2](https://github.com/Microsoft/fast/commit/d130cd2b184ed2cbf529f92e8a68a83e095a5fdd))


### Features

* allow svgs to be rendered in the htmlMapper ([#3274](https://github.com/Microsoft/fast/issues/3274)) ([77ece11](https://github.com/Microsoft/fast/commit/77ece11142dda7550607766f74481e5a38cb8163))





# [0.5.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.4.0...@microsoft/fast-tooling@0.5.0) (2020-06-05)


### Bug Fixes

* addresses an issue where a linked data being added could be missing a parent data location ([#3188](https://github.com/Microsoft/fast/issues/3188)) ([7f7bc1e](https://github.com/Microsoft/fast/commit/7f7bc1e1f2edc57e589aa726c6cb0e46c7c3cab7))
* use the vscode values instead of enum in a web component attribute definition ([#3202](https://github.com/Microsoft/fast/issues/3202)) ([b8aad52](https://github.com/Microsoft/fast/commit/b8aad521255d8bdd2ae5a6d877c85891480fc6e7))


### Features

* add enums as an option in an attribute ([#3179](https://github.com/Microsoft/fast/issues/3179)) ([843ca0f](https://github.com/Microsoft/fast/commit/843ca0f9636284d972d92e75a7694e7526155043))
* adds the tag name to the title to provide better documentation and discoverability when a definition is converted to a JSON schema ([#3219](https://github.com/Microsoft/fast/issues/3219)) ([fa225d2](https://github.com/Microsoft/fast/commit/fa225d29f6b90c3db88f49aebb08c12c0aad0bf7))





# [0.4.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.3.1...@microsoft/fast-tooling@0.4.0) (2020-05-18)


### Bug Fixes

* fixes an issue with adding nested linked data ([#3092](https://github.com/Microsoft/fast/issues/3092)) ([fa5630a](https://github.com/Microsoft/fast/commit/fa5630a198e4c60fab49654157366b4d0abc713f))


### Features

* add a web component definition and mapper to JSON schema for tooling ([#3033](https://github.com/Microsoft/fast/issues/3033)) ([221acd7](https://github.com/Microsoft/fast/commit/221acd789522eaef2ff4cee1a49683822e9289a2))
* add plugin system to the data dictionary mapping utility ([#3052](https://github.com/Microsoft/fast/issues/3052)) ([401d342](https://github.com/Microsoft/fast/commit/401d3427ae7f4ce69226a60c04def537af5e8c55))
* allow linked data attached to other linked data to be added to a data dictionary ([#3049](https://github.com/Microsoft/fast/issues/3049)) ([2f34dc7](https://github.com/Microsoft/fast/commit/2f34dc738c2ac624722f732ed3ebb508972ae3f0))





## [0.3.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.3.0...@microsoft/fast-tooling@0.3.1) (2020-04-29)

**Note:** Version bump only for package @microsoft/fast-tooling





# [0.3.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.2.0...@microsoft/fast-tooling@0.3.0) (2020-04-27)


### Bug Fixes

* deprecate the initialize data property in the initialize message ([#2982](https://github.com/Microsoft/fast/issues/2982)) ([dd01a12](https://github.com/Microsoft/fast/commit/dd01a12b594a7b750a2244642d43e0f692dfb772))


### Features

* allow initialization to occur after creating an instance of the MessageSystem ([#2983](https://github.com/Microsoft/fast/issues/2983)) ([908ea85](https://github.com/Microsoft/fast/commit/908ea852077b9f131b6e0852e76b39aab6d0775a))
* allow the use of an already instantiated Worker in the MessageSystem config ([#2993](https://github.com/Microsoft/fast/issues/2993)) ([7d4e97a](https://github.com/Microsoft/fast/commit/7d4e97afb60c71e952615eaeac986f1f055a095d))





# [0.2.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-tooling@0.1.0...@microsoft/fast-tooling@0.2.0) (2020-04-22)


### Features

* allow a data update to be applied to a different dictionary item ([#2946](https://github.com/Microsoft/fast/issues/2946)) ([41c7a2a](https://github.com/Microsoft/fast/commit/41c7a2add7eb3faa15c63cc3df63db421a7d88c0))





# 0.1.0 (2020-04-10)


### Bug Fixes

* cleanup interface names and fix the web component renderer in the test app ([#2832](https://github.com/Microsoft/fast/issues/2832)) ([26c6bc7](https://github.com/Microsoft/fast/commit/26c6bc78a3fdd5aed6d88709181f95d3d318d984))
* correct some erroneous message system navigation returns, add more unit testing to bring code quality up ([#2783](https://github.com/Microsoft/fast/issues/2783)) ([2f87a04](https://github.com/Microsoft/fast/commit/2f87a0427cfc0c307b9b4acacdd5385c42fcf773))


### Features

* add a data mapper ([#2756](https://github.com/Microsoft/fast/issues/2756)) ([11df583](https://github.com/Microsoft/fast/commit/11df5832eb2ef1a6896be2afd4e0404462454985))
* add a mapper for HTML elements ([#2803](https://github.com/Microsoft/fast/issues/2803)) ([7b14ced](https://github.com/Microsoft/fast/commit/7b14ced79ac543d6a3a889a828fab240dd216386))
* add a utility for validation as a service using ajv ([#2836](https://github.com/Microsoft/fast/issues/2836)) ([05e1784](https://github.com/Microsoft/fast/commit/05e1784c1c34df8d0ffff451ce753731e49c7255))
* add all of the ids associated with the linked data when linked data has been added ([#2899](https://github.com/Microsoft/fast/issues/2899)) ([00c8ed3](https://github.com/Microsoft/fast/commit/00c8ed3f488470b6a01d6bd3ec2f38a0afb5c74a))
* add disabled to the navigation and remove the dependency on ajv from the message system ([#2792](https://github.com/Microsoft/fast/issues/2792)) ([ad5e886](https://github.com/Microsoft/fast/commit/ad5e8865818965ae515de776305810bf61378a7b))
* add mapper function to create React components ([#2772](https://github.com/Microsoft/fast/issues/2772)) ([d6f6c1d](https://github.com/Microsoft/fast/commit/d6f6c1dc21dae008d336a00b8c29b6334408491d))
* add new package for framework-less tooling ([#2560](https://github.com/Microsoft/fast/issues/2560)) ([9c4ae29](https://github.com/Microsoft/fast/commit/9c4ae2916a3d91bd5d664f029bf9bb77e219f177))
* add the ability to nest multiple items at the same level in an element ([#2813](https://github.com/Microsoft/fast/issues/2813)) ([1e23b85](https://github.com/Microsoft/fast/commit/1e23b85e03983be5df463ffaa2d8213659991632))
* add validation to the message system ([#2825](https://github.com/Microsoft/fast/issues/2825)) ([ce24096](https://github.com/Microsoft/fast/commit/ce2409659ef361a9a16cc2a44ea5560a04c6ddaf))
* allow a request/response custom validation message to be sent to the AjvMapper ([#2852](https://github.com/Microsoft/fast/issues/2852)) ([6154ef0](https://github.com/Microsoft/fast/commit/6154ef087432e6a94c7392babd338f4df05e4799))
* allow custom messages to be sent to the message system which will return them ([#2845](https://github.com/Microsoft/fast/issues/2845)) ([ad70f5d](https://github.com/Microsoft/fast/commit/ad70f5d030526c3b4be8bf3ae7ad3b1a23e587d0))
* more precise drag and drop allowed before and after linked data ([#2866](https://github.com/Microsoft/fast/issues/2866)) ([efa0b39](https://github.com/Microsoft/fast/commit/efa0b39a2eb0f23d5bcfb7a520868f02b38ee192))
