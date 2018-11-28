# Git help

## Creating new branches

1. Create a unique branch name tracking `origin/master`

```bash
git checkout -b <users/alias/feature-branch-name> origin/master
```

2. Use git status to verify the current branch and modified files.

```bash
git status
```

### Recommended practices

* Use all lower cased hyphen-delimited branch names for readability
* Format as <users/alias/branch-name>. For example, users/jdoe/task-issue-title
* Create as new branch for each work issue using the `-b` argument.
* Commit messages should use lowercase imperative present tense. Use commands. Instead of “I added tests for ...” use “add tests for ...”
* [Rebase, don't merge](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)

## Common commands

All "packages" share common script names for consistency along with their own documentation guides.

To clean all packages.

```bash
lerna clean
```

When package files change the symbolic links will require updating.

```bash
lerna bootstrap
```

To run all tests on all packages.

```bash
lerna run test
```

To run all tests on a single package.

```bash
cd packages/package-name
npm run test
```

Most packages have a *watch* command that will rebuild the package's distribution when a file changes. This process can be useful when doing development across multiple packages.

```bash
npm run watch
```

## Common housekeeping commands

Remote and local branches should be maintained and kept clean. Here are some common usages and commands.

View only YOUR remote branches

```bash
git branch –r | grep v-[alias]
```

View local branches that are merged into Master

```bash
git branch --merged
```

View remote branches merged Master

```bash
git branch --remotes --merged
```

View local branches NOT merged into Master

```bash
git branch --no-merged
```

View remote branches NOT merged Master

```bash
git branch --remotes --no-merged
```

Delete a remote branch

```bash
git push origin --delete <feature branch>
```

Delete a local branch

```bash
$it branch –D <feature branch>
```