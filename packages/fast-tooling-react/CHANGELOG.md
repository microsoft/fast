# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@1.2.1...@microsoft/fast-tooling-react@1.2.2) (2019-04-11)

**Note:** Version bump only for package @microsoft/fast-tooling-react





## [1.2.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@1.2.0...@microsoft/fast-tooling-react@1.2.1) (2019-04-10)

**Note:** Version bump only for package @microsoft/fast-tooling-react





# [1.2.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@1.1.1...@microsoft/fast-tooling-react@1.2.0) (2019-04-09)


### Bug Fixes

* fixes a reversion where ids no longer restricted the child options ([#1608](https://github.com/Microsoft/fast-dna/issues/1608)) ([94f5f00](https://github.com/Microsoft/fast-dna/commit/94f5f00))


### Features

* allow an array to be unset/reset if it is optional ([#1613](https://github.com/Microsoft/fast-dna/issues/1613)) ([c671b4c](https://github.com/Microsoft/fast-dna/commit/c671b4c))
* use defaults as values if the data has not been set and adds an indicator in the UI to signify that the data is default ([#1619](https://github.com/Microsoft/fast-dna/issues/1619)) ([7131fc8](https://github.com/Microsoft/fast-dna/commit/7131fc8))





## [1.1.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@1.1.0...@microsoft/fast-tooling-react@1.1.1) (2019-04-03)

**Note:** Version bump only for package @microsoft/fast-tooling-react





# [1.1.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@1.0.1...@microsoft/fast-tooling-react@1.1.0) (2019-04-03)


### Features

* add inline and native browser validation derived from JSON schema ([#1595](https://github.com/Microsoft/fast-dna/issues/1595)) ([3f5a702](https://github.com/Microsoft/fast-dna/commit/3f5a702))





## [1.0.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@1.0.0...@microsoft/fast-tooling-react@1.0.1) (2019-03-25)


### Bug Fixes

* updates the styling of children and array items so that the remove button is inline with the add button ([#1586](https://github.com/Microsoft/fast-dna/issues/1586)) ([b9aa9ef](https://github.com/Microsoft/fast-dna/commit/b9aa9ef))





# [1.0.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@0.3.0...@microsoft/fast-tooling-react@1.0.0) (2019-03-25)


### Bug Fixes

* update to use esModuleInterop in the TypeScript configuration files ([#1211](https://github.com/Microsoft/fast-dna/issues/1211)) ([2ec0644](https://github.com/Microsoft/fast-dna/commit/2ec0644))


### Features

* update and refactor the CSS editor ([#1543](https://github.com/Microsoft/fast-dna/issues/1543)) ([defcce4](https://github.com/Microsoft/fast-dna/commit/defcce4))
* update to use ajv as the JSON schema validator ([#1564](https://github.com/Microsoft/fast-dna/issues/1564)) ([939bdb4](https://github.com/Microsoft/fast-dna/commit/939bdb4))


### BREAKING CHANGES

* This changes the API of the CSS editor to be more
consistent with the API of similar tooling package exports such as the
form.
* This will affect how imports will be handled by
consumers





# [0.3.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@0.2.0...@microsoft/fast-tooling-react@0.3.0) (2019-03-22)


### Bug Fixes

* add an optional schemaLocation to be used instead of an automated mapping ([#1563](https://github.com/Microsoft/fast-dna/issues/1563)) ([e0c7545](https://github.com/Microsoft/fast-dna/commit/e0c7545))


### Features

* add badges ([#1568](https://github.com/Microsoft/fast-dna/issues/1568)) ([91568aa](https://github.com/Microsoft/fast-dna/commit/91568aa))





# [0.2.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-tooling-react@0.1.0...@microsoft/fast-tooling-react@0.2.0) (2019-03-19)


### Bug Fixes

* update jest to fix build break ([#1531](https://github.com/Microsoft/fast-dna/issues/1531)) ([73ae6de](https://github.com/Microsoft/fast-dna/commit/73ae6de))


### Features

* add a check for the examples key in JSON schema when generating data ([#1491](https://github.com/Microsoft/fast-dna/issues/1491)) ([be977f1](https://github.com/Microsoft/fast-dna/commit/be977f1))
* add css editor to the tooling package ([#1532](https://github.com/Microsoft/fast-dna/issues/1532)) ([a579bc9](https://github.com/Microsoft/fast-dna/commit/a579bc9))
* add the form generator to tooling ([#1523](https://github.com/Microsoft/fast-dna/issues/1523)) ([7d8012d](https://github.com/Microsoft/fast-dna/commit/7d8012d))





# 0.1.0 (2019-03-11)


### Features

* add a new tooling package and deprecate the existing [@microsoft](https://github.com/microsoft)/fast-data-utilities-react package ([#1469](https://github.com/Microsoft/fast-dna/issues/1469)) ([8330615](https://github.com/Microsoft/fast-dna/commit/8330615))
* add navigation to the tooling package ([#1492](https://github.com/Microsoft/fast-dna/issues/1492)) ([3a988d3](https://github.com/Microsoft/fast-dna/commit/3a988d3))
* add new data generator and consolidate some files into more meaningful naming structures ([#1484](https://github.com/Microsoft/fast-dna/issues/1484)) ([6a6979a](https://github.com/Microsoft/fast-dna/commit/6a6979a))
* add viewer to tooling ([#1511](https://github.com/Microsoft/fast-dna/issues/1511)) ([721552d](https://github.com/Microsoft/fast-dna/commit/721552d))
