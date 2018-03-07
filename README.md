# FAST-DNA
Fast, adaptive, secure, and timeless design network architecture.

## Getting started
First, clone the repository and `cd` into the project.

Install [lerna](https://github.com/lerna/lerna):
```shell
npm install --global lerna
```

Bootstrap lerna to install all dependencies:
```shell
lerna bootstrap
```

## Commit message format
FAST-design follows [conventional commits](https://conventionalcommits.org/) for commit messages. Additional types are heavily inspired by Angular's [commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).

Per conventional commits 1.0.0, a commit message should be structured as follows:
```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Types
The following types are supported:
- **build**: Changes that affect the build system
- **docs**: Documentation only changes
- **feat**: Adding a new feature
- **fix**: Fixing an issue / bug
- **perf**: Performance related changes
- **refactor**: Refactoring existing features
- **test**: Changes specific to tests

### Description
Commit message descriptions should be concise and must conform to the following:
- use the imperative, present tense. (fix - not fixes)
- single sentence without sentence casing (fix - not Fix)
- no period at the end

### Body
The body is optional. It should be used to provide clarity and context to the description.

### Footer
The footer should provide additional metadata about the pull request such as issue fixing (fixes #19).
