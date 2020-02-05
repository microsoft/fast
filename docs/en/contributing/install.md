---
id: install
title: Install
sidebar_label: Install
---

# Install

## Prerequisites

Before setting up FAST-DNA, install Git and <a href="https://yarnpkg.com/en/docs/install" target="_blank">Yarn</a>.

## Setup the source repository

Clone the repository, `cd` into the project, install <a href="https://github.com/lerna/lerna" target="_blank">Lerna</a> and install dependencies:

```shell
git clone https://github.com/Microsoft/fast-dna.git
cd fast-dna
yarn global add lerna
```

Install and symbolically link dependencies across all workspaces:

```shell
yarn install
```

- `lerna run prepare` to symbolically link dependencies
- `yarn tslint` or `yarn tslint:fix` runs tslint on typescript in a given package.
- `yarn unit-tests` runs unit-tests for the package.
- `yarn test` runs processes in a package required to pass prior to check-in and includes building, linting, and unit-testing.

To run these processes across *all* projects, substitute `yarn` for `lerna run ____`:

```shell
lerna run test
```

## Understanding packages

All packages can be found in the repository [packages](https://github.com/Microsoft/fast-dna/tree/master/packages) folder. Each package includes a `README.md` at its root for documentation.

## Dependencies

Dependencies are minimized to simplify upgrade cycles and encourage frequent updates with less friction and reduced impact.
