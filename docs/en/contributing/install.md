---
id: install
title: Install
sidebar_label: Install
---

# Install

## Prerequisites

Before setting up FAST-DNA, install Git and [yarn](https://yarnpkg.com/en/docs/install).

## Setup the source repository

Clone the repository, `cd` into the project, install [Lerna](https://github.com/lerna/lerna) and install dependencies:

```shell
git clone https://github.com/Microsoft/fast-dna.git
cd fast-dna
yarn global add lerna
```

Install all dependencies:

```shell
yarn install
```

Prepare the workspaces:

```shell
lerna run prepare
```

- `yarn tslint` or `yarn tslint:fix` runs tslint on typescript in a given package.
- `yarn unit-tests` runs unit-tests for the package.
- `yarn test` runs processes in a package required to pass prior to check-in. Generally includes building, linting, and unit-testing.

To run these processes across *all* projects, substitute `yarn` for `lerna run ____`:

```shell
lerna run test
```

## Understanding packages

All packages can be found in the repository [packages](https://github.com/Microsoft/fast-dna/tree/master/packages) folder. Each package includes a `README.md` at its root for documentation.

## Dependencies

Dependencies are minimized to simplify upgrade cycles and encourage frequent updates with less friction and reduced impact.
