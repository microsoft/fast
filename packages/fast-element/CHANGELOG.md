# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-element@0.4.0...@microsoft/fast-element@0.5.0) (2020-04-02)


### Features

* **fast-element:** add trusted types for HTML ([#2855](https://github.com/Microsoft/fast-dna/issues/2855)) ([69d44a2](https://github.com/Microsoft/fast-dna/commit/69d44a289ce6ca43a7f536edb600af61f453728f))





# [0.4.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-element@0.3.1...@microsoft/fast-element@0.4.0) (2020-03-30)


### Bug Fixes

* attribute bindings in fast components ([#2847](https://github.com/Microsoft/fast-dna/issues/2847)) ([0d25806](https://github.com/Microsoft/fast-dna/commit/0d25806360b987a3f3c3a69dc5dd005415f70795))
* **fast-element:** ensure host attributes have a target name ([#2846](https://github.com/Microsoft/fast-dna/issues/2846)) ([4bd99c9](https://github.com/Microsoft/fast-dna/commit/4bd99c91279d5abf642e73b10acf0459fc9035c8))


### Features

* **fast-element:** attribute/property binding revamp ([#2843](https://github.com/Microsoft/fast-dna/issues/2843)) ([ffe7a57](https://github.com/Microsoft/fast-dna/commit/ffe7a57a7978868d28f583de3a3b254904ba3db5))
* add progress web component ([#2828](https://github.com/Microsoft/fast-dna/issues/2828)) ([5f2be52](https://github.com/Microsoft/fast-dna/commit/5f2be52738396aa1985a49eac667bd6e397abfa7))





## [0.3.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-element@0.3.0...@microsoft/fast-element@0.3.1) (2020-03-25)


### Bug Fixes

* **fast-element:** add docs and ensure boolean attrs true when empty ([#2833](https://github.com/Microsoft/fast-dna/issues/2833)) ([4bf2c41](https://github.com/Microsoft/fast-dna/commit/4bf2c41efb4520152fe041fb3e67eaf31fbe8e66))





# [0.3.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-element@0.2.1...@microsoft/fast-element@0.3.0) (2020-03-25)


### Bug Fixes

* **fast-element:** type fixes, api docs, and one op order correction ([#2810](https://github.com/Microsoft/fast-dna/issues/2810)) ([0548e89](https://github.com/Microsoft/fast-dna/commit/0548e89b64d7081b0024434dd6bbaf5fb3ca8366))
* **view:** ensure first/last child correct after removing view ([#2819](https://github.com/Microsoft/fast-dna/issues/2819)) ([7d82ddc](https://github.com/Microsoft/fast-dna/commit/7d82ddc161fd519cb44db1ae6e0b7aa403b58806))


### Features

* **fast-element:** boolean attributes and type conversion ([#2829](https://github.com/Microsoft/fast-dna/issues/2829)) ([03f64cd](https://github.com/Microsoft/fast-dna/commit/03f64cd890e764fd72363993fae3724d9da647ff))


### Performance Improvements

* **fast-element:** optimize view removal and disposal ([#2806](https://github.com/Microsoft/fast-dna/issues/2806)) ([59cc3be](https://github.com/Microsoft/fast-dna/commit/59cc3becd5f188e6d6122f5dff2a8a163dc075dc))





## [0.2.1](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-element@0.2.0...@microsoft/fast-element@0.2.1) (2020-03-18)

**Note:** Version bump only for package @microsoft/fast-element





# [0.2.0](https://github.com/Microsoft/fast-dna/compare/@microsoft/fast-element@0.1.0...@microsoft/fast-element@0.2.0) (2020-03-13)


### Bug Fixes

* **fast-element:** undefined/null should remove the html attribute ([#2749](https://github.com/Microsoft/fast-dna/issues/2749)) ([82dbf74](https://github.com/Microsoft/fast-dna/commit/82dbf74))


### Features

* **fast-element:** attached behaviors ([#2784](https://github.com/Microsoft/fast-dna/issues/2784)) ([170eed7](https://github.com/Microsoft/fast-dna/commit/170eed7))
* **fast-element:** base shadow and element options on defaults ([#2782](https://github.com/Microsoft/fast-dna/issues/2782)) ([73fabda](https://github.com/Microsoft/fast-dna/commit/73fabda))
* **fast-element:** enable host instructions ([#2760](https://github.com/Microsoft/fast-dna/issues/2760)) ([8675585](https://github.com/Microsoft/fast-dna/commit/8675585))
* **fast-element:** streamline custom event emit ([#2777](https://github.com/Microsoft/fast-dna/issues/2777)) ([b3250ec](https://github.com/Microsoft/fast-dna/commit/b3250ec))
* export when from the root of fast-element ([#2739](https://github.com/Microsoft/fast-dna/issues/2739)) ([3e290d3](https://github.com/Microsoft/fast-dna/commit/3e290d3))
* **fast-element:** simpler element definition without decorators ([#2730](https://github.com/Microsoft/fast-dna/issues/2730)) ([d89e9ca](https://github.com/Microsoft/fast-dna/commit/d89e9ca))


### Performance Improvements

* **fast-element:** simplify expressions ([#2755](https://github.com/Microsoft/fast-dna/issues/2755)) ([e1c2bfa](https://github.com/Microsoft/fast-dna/commit/e1c2bfa))





# 0.1.0 (2020-02-28)


### Bug Fixes

* **fast-element:** prevent duplicate subscription and queuing ([#2678](https://github.com/Microsoft/fast-dna/issues/2678)) ([99a24d8](https://github.com/Microsoft/fast-dna/commit/99a24d8))


### Features

* **fast-element:** add initial source from prototype ([#2675](https://github.com/Microsoft/fast-dna/issues/2675)) ([f8c3226](https://github.com/Microsoft/fast-dna/commit/f8c3226))


### Performance Improvements

* **fast-element:** improve subscribe/unsubscribe by reducing alloc ([#2679](https://github.com/Microsoft/fast-dna/issues/2679)) ([1957c6f](https://github.com/Microsoft/fast-dna/commit/1957c6f))
* **fast-element:** improve synthetic view creation speed ([#2680](https://github.com/Microsoft/fast-dna/issues/2680)) ([2e2b549](https://github.com/Microsoft/fast-dna/commit/2e2b549))
* **fast-element:** new strategy for array observation and repeat ([#2684](https://github.com/Microsoft/fast-dna/issues/2684)) ([6f2f272](https://github.com/Microsoft/fast-dna/commit/6f2f272))
