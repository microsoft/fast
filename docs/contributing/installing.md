---
id: install
title: Contributing
sidebar_label: Install
---

# Install

## Setup the source repository

Clone the repository, `cd` into the project, install [Lerna](https://github.com/lerna/lerna) and install dependencies.

``` shell
git clone https://github.com/Microsoft/fast-dna.git
cd fast-dna
npm i --global lerna@3.3.0
npm i
```

Install all Lerna dependencies:

``` shell
lerna bootstrap
```

- `npm run tslint` or `npm run tslint:fix` runs tslint on all typescript in the project.
- `npm run unit-tests` runs all unit-tests.
- `npm run test` runs all processes required to pass prior to check-in. Generally includes building, linting, and unit-testing.

To run these processes across *all* projects, substitute `npm` for `lerna`.

```shell
lerna run test
```

## Understanding packages

All packages can be found [here](https://github.com/Microsoft/fast-dna/tree/master/packages). Each package includes a `README.md` file at the root that describes how the package can be used.

## Dependencies

Dependencies are purposely limited to simplify the upgrade cycle. Due to the constantly changing nature of web technologies, it’s imperative to update more frequently with less friction and without customer impact.
