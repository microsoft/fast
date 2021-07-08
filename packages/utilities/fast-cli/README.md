fast-cli
========

The FAST command line tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fast-cli.svg)](https://npmjs.org/package/fast-cli)
[![Downloads/week](https://img.shields.io/npm/dw/fast-cli.svg)](https://npmjs.org/package/fast-cli)
[![License](https://img.shields.io/npm/l/fast-cli.svg)](https://github.com/Microsoft/git+https://github.com/Microsoft/fast.git/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @microsoft/fast-cli
$ fast COMMAND
running command...
$ fast (-v|--version|version)
@microsoft/fast-cli/0.1.0 darwin-x64 node-v12.18.2
$ fast --help [COMMAND]
USAGE
  $ fast COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fast generate [FILE]`](#fast-generate-file)
* [`fast help [COMMAND]`](#fast-help-command)
* [`fast new [PROJECTNAME]`](#fast-new-projectname)

## `fast generate [FILE]`

describe the command here

```
USAGE
  $ fast generate [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/generate.ts](https://github.com/Microsoft/fast/blob/v0.1.0/src/commands/generate.ts)_

## `fast help [COMMAND]`

display help for fast

```
USAGE
  $ fast help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `fast new [PROJECTNAME]`

Scaffolds out a new FAST design system project

```
USAGE
  $ fast new [PROJECTNAME]

ARGUMENTS
  PROJECTNAME  [default: my-project] The desired name of your project
```

_See code: [src/commands/new.ts](https://github.com/Microsoft/fast/blob/v0.1.0/src/commands/new.ts)_
<!-- commandsstop -->
