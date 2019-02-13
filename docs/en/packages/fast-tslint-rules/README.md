---
id: index
title: FAST Tslint Rules
sidebar_label: Tslint Rules
---

# TSLINT rules

This project provides [tslint](https://github.com/palantir/tslint) rules for all FAST projects.

## Usage

### Installation

Install the package:

```shell
npm i @microsoft/fast-tslint-rules
```

### Configure your tslint config

Add *fast-tslint-rules* as an extension to your `tslint.json`:

```json
{
    "extends": "@microsoft/fast-tslint-rules" 
}
```

If your are extending multiple rulesets, you can define `extends` as an array of strings:

```json
{
    "extends": [
        "@microsoft/fast-tslint-rules",
        "another-tslint-ruleset"
    ]
}
```

Please see [configuring tslint](https://palantir.github.io/tslint/usage/configuration/) for more details.