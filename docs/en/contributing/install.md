---
id: install
title: Install
sidebar_label: Install
---

# Install

## Prerequisites

Before setting up FAST, install Git and <a href="https://yarnpkg.com/en/docs/install" target="_blank">Yarn</a>.

## Setup the source repository

Clone the repository, `cd` into the project, install <a href="https://github.com/lerna/lerna" target="_blank">Lerna</a> and install dependencies:

```shell
git clone https://github.com/Microsoft/fast.git
cd fast
yarn global add lerna
```

Installs all the dependencies:

```shell
yarn
```

Builds all the packages:

```shell
lerna run prepare
```

- `yarn eslint` or `yarn eslint:fix` executes eslint in a given package.
- `yarn unit-tests` executes unit testing for packages.
- `yarn test` executes processes in a package required to pass before check-in and generally includes building, linting, and unit testing.

To run these processes across *all* projects, substitute `yarn` for `lerna run ____`:

```shell
lerna run test
```

## Understanding packages

All packages can be found in the repository [packages](https://github.com/Microsoft/fast/tree/master/packages) folder. Each package includes a `README.md` at its root for documentation.

## Dependencies

Dependencies are minimized to simplify upgrade cycles and encourage frequent updates with less friction and reduced impact.
