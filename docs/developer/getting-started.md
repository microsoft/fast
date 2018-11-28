# Getting started

## Prerequisits

### Setup a development environment

1. Install the latest stable versions of [Git](https://git-scm.com/download).
1. Configure git user credentials for [every respository](https://help.github.com/articles/setting-your-username-in-git/#setting-your-git-username-for-every-repository-on-your-computer) or [single repository](https://help.github.com/articles/setting-your-username-in-git/#setting-your-git-username-for-a-single-repository)
1. Install the LTS (Long Term Support) version of [Node](https://nodejs.org/en).

### Setup the source repository

Clone the repository, `cd` into the project, install [Lerna](https://github.com/lerna/lerna) and install dependencies:

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

Each package in FAST-DNA has its own unique requirements and commands, but the following commands are relatively standard across all packages:

- `npm run tslint` or `npm run tslint:fix` runs tslint on all typescript in the project.
- `npm run unit-tests` runs all unit-tests.
- `npm run test` runs all processes required to pass prior to check-in. Generally includes building, linting, and unit-testing.

To run these processes across *all* projects, substitute `npm` for `lerna`.

```shell
lerna run test
```

## Understanding packages

All packages can be found [here](https://github.com/Microsoft/fast-dna/tree/master/packages). Each package includes a `readme.md` file at the root that describes how the package can be used.

## Dependencies

Dependencies are purposely limited to simplify the upgrade cycle. Due to the constantly changing nature of web technologies, it’s imperative to update more frequently with less friction and without customer impact.
