---
id: install
title: Install
sidebar_label: Install
---

# Install

## Prerequisites

Before setting up FAST-DNA, install Git and [npm](https://www.npmjs.com/get-npm).

## Setup the source repository

Clone the repository, `cd` into the project, install [Lerna](https://github.com/lerna/lerna) and install dependencies:

```shell
git clone https://github.com/Microsoft/fast-dna.git
cd fast-dna
npm i --global lerna
npm i
```

Install all Lerna dependencies:

```shell
lerna bootstrap
```

- `npm run tslint` or `npm run tslint:fix` runs tslint on all typescript in the project.
- `npm run unit-tests` runs all unit-tests.
- `npm run test` runs all processes required to pass prior to check-in. Generally includes building, linting, and unit-testing.

To run these processes across *all* projects, substitute `npm` for `lerna`:

```shell
lerna run test
```

## Understanding packages

All packages can be found in the repository [packages](https://github.com/Microsoft/fast-dna/tree/master/packages) folder. Each package includes a `README.md` at its root for documentation.

## Dependencies

Dependencies are minimized to simplify upgrade cycles and encourage frequent updates with less friction and reduced impact.
