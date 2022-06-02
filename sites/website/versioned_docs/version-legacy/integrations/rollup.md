---
id: rollup
title: Rollup
sidebar_label: Rollup
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/rollup.md
description: FAST works great with TypeScript and Rollup, using a fairly standard setup. Let's take a look at how you can set up a TypeScript+Rollup project, starting from scratch.
keywords:
  - rollup
---

FAST works great with TypeScript and Rollup, using a fairly standard setup. Let's take a look at how you can set up a TypeScript+Rollup project, starting from scratch.

## Setting up the package

First, let's make a directory for our new project. From the terminal:

```shell
mkdir fast-rollup
```

Next, let's move into that directory, where we'll set up our project:

```shell
cd fast-rollup
```

From here, we'll initialize npm:

```shell
npm init
```

Follow the prompts from npm, answering each question in turn. You can always accept the defaults at first and then make changes later in the package.json file.

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-element
```

We also need to install the Rollup build tooling:

```shell
npm install --save-dev rollup typescript rollup-plugin-typescript2
```

## Adding configuration and source

Work in progress