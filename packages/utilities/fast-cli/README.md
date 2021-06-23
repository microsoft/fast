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
$ npm install -g fast-cli
$ fast COMMAND
running command...
$ fast (-v|--version|version)
fast-cli/0.1.0 darwin-x64 node-v12.18.2
$ fast --help [COMMAND]
USAGE
  $ fast COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fast hello [FILE]`](#fast-hello-file)
* [`fast help [COMMAND]`](#fast-help-command)
* [`fast new [FILE]`](#fast-new-file)

## `fast hello [FILE]`

describe the command here

```
USAGE
  $ fast hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ fast hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Microsoft/fast/blob/v0.1.0/src/commands/hello.ts)_

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

## `fast new [FILE]`

describe the command here

```
USAGE
  $ fast new [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/new.ts](https://github.com/Microsoft/fast/blob/v0.1.0/src/commands/new.ts)_
<!-- commandsstop -->
