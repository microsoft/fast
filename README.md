# Contributing
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

### Contribution policy
This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
