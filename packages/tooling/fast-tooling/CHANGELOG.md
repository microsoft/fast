# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling@0.3.1...@microsoft/fast-tooling@0.4.0) (2020-05-18)


### Bug Fixes

* fixes an issue with adding nested linked data ([#3092](https://github.com/Microsoft/fast-dna/issues/3092)) ([fa5630a](https://github.com/Microsoft/fast-dna/commit/fa5630a198e4c60fab49654157366b4d0abc713f))


### Features

* add a web component definition and mapper to JSON schema for tooling ([#3033](https://github.com/Microsoft/fast-dna/issues/3033)) ([221acd7](https://github.com/Microsoft/fast-dna/commit/221acd789522eaef2ff4cee1a49683822e9289a2))
* add plugin system to the data dictionary mapping utility ([#3052](https://github.com/Microsoft/fast-dna/issues/3052)) ([401d342](https://github.com/Microsoft/fast-dna/commit/401d3427ae7f4ce69226a60c04def537af5e8c55))
* allow linked data attached to other linked data to be added to a data dictionary ([#3049](https://github.com/Microsoft/fast-dna/issues/3049)) ([2f34dc7](https://github.com/Microsoft/fast-dna/commit/2f34dc738c2ac624722f732ed3ebb508972ae3f0))





## [0.3.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling@0.3.0...@microsoft/fast-tooling@0.3.1) (2020-04-29)

**Note:** Version bump only for package @microsoft/fast-tooling





# [0.3.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling@0.2.0...@microsoft/fast-tooling@0.3.0) (2020-04-27)


### Bug Fixes

* deprecate the initialize data property in the initialize message ([#2982](https://github.com/Microsoft/fast-dna/issues/2982)) ([dd01a12](https://github.com/Microsoft/fast-dna/commit/dd01a12b594a7b750a2244642d43e0f692dfb772))


### Features

* allow initialization to occur after creating an instance of the MessageSystem ([#2983](https://github.com/Microsoft/fast-dna/issues/2983)) ([908ea85](https://github.com/Microsoft/fast-dna/commit/908ea852077b9f131b6e0852e76b39aab6d0775a))
* allow the use of an already instantiated Worker in the MessageSystem config ([#2993](https://github.com/Microsoft/fast-dna/issues/2993)) ([7d4e97a](https://github.com/Microsoft/fast-dna/commit/7d4e97afb60c71e952615eaeac986f1f055a095d))





# [0.2.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling@0.1.0...@microsoft/fast-tooling@0.2.0) (2020-04-22)


### Features

* allow a data update to be applied to a different dictionary item ([#2946](https://github.com/Microsoft/fast-dna/issues/2946)) ([41c7a2a](https://github.com/Microsoft/fast-dna/commit/41c7a2add7eb3faa15c63cc3df63db421a7d88c0))





# 0.1.0 (2020-04-10)


### Bug Fixes

* cleanup interface names and fix the web component renderer in the test app ([#2832](https://github.com/Microsoft/fast-dna/issues/2832)) ([26c6bc7](https://github.com/Microsoft/fast-dna/commit/26c6bc78a3fdd5aed6d88709181f95d3d318d984))
* correct some erroneous message system navigation returns, add more unit testing to bring code quality up ([#2783](https://github.com/Microsoft/fast-dna/issues/2783)) ([2f87a04](https://github.com/Microsoft/fast-dna/commit/2f87a0427cfc0c307b9b4acacdd5385c42fcf773))


### Features

* add a data mapper ([#2756](https://github.com/Microsoft/fast-dna/issues/2756)) ([11df583](https://github.com/Microsoft/fast-dna/commit/11df5832eb2ef1a6896be2afd4e0404462454985))
* add a mapper for HTML elements ([#2803](https://github.com/Microsoft/fast-dna/issues/2803)) ([7b14ced](https://github.com/Microsoft/fast-dna/commit/7b14ced79ac543d6a3a889a828fab240dd216386))
* add a utility for validation as a service using ajv ([#2836](https://github.com/Microsoft/fast-dna/issues/2836)) ([05e1784](https://github.com/Microsoft/fast-dna/commit/05e1784c1c34df8d0ffff451ce753731e49c7255))
* add all of the ids associated with the linked data when linked data has been added ([#2899](https://github.com/Microsoft/fast-dna/issues/2899)) ([00c8ed3](https://github.com/Microsoft/fast-dna/commit/00c8ed3f488470b6a01d6bd3ec2f38a0afb5c74a))
* add disabled to the navigation and remove the dependency on ajv from the message system ([#2792](https://github.com/Microsoft/fast-dna/issues/2792)) ([ad5e886](https://github.com/Microsoft/fast-dna/commit/ad5e8865818965ae515de776305810bf61378a7b))
* add mapper function to create React components ([#2772](https://github.com/Microsoft/fast-dna/issues/2772)) ([d6f6c1d](https://github.com/Microsoft/fast-dna/commit/d6f6c1dc21dae008d336a00b8c29b6334408491d))
* add new package for framework-less tooling ([#2560](https://github.com/Microsoft/fast-dna/issues/2560)) ([9c4ae29](https://github.com/Microsoft/fast-dna/commit/9c4ae2916a3d91bd5d664f029bf9bb77e219f177))
* add the ability to nest multiple items at the same level in an element ([#2813](https://github.com/Microsoft/fast-dna/issues/2813)) ([1e23b85](https://github.com/Microsoft/fast-dna/commit/1e23b85e03983be5df463ffaa2d8213659991632))
* add validation to the message system ([#2825](https://github.com/Microsoft/fast-dna/issues/2825)) ([ce24096](https://github.com/Microsoft/fast-dna/commit/ce2409659ef361a9a16cc2a44ea5560a04c6ddaf))
* allow a request/response custom validation message to be sent to the AjvMapper ([#2852](https://github.com/Microsoft/fast-dna/issues/2852)) ([6154ef0](https://github.com/Microsoft/fast-dna/commit/6154ef087432e6a94c7392babd338f4df05e4799))
* allow custom messages to be sent to the message system which will return them ([#2845](https://github.com/Microsoft/fast-dna/issues/2845)) ([ad70f5d](https://github.com/Microsoft/fast-dna/commit/ad70f5d030526c3b4be8bf3ae7ad3b1a23e587d0))
* more precise drag and drop allowed before and after linked data ([#2866](https://github.com/Microsoft/fast-dna/issues/2866)) ([efa0b39](https://github.com/Microsoft/fast-dna/commit/efa0b39a2eb0f23d5bcfb7a520868f02b38ee192))
