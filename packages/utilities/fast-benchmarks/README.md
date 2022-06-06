# FAST Benchmarks

This is utility library for creating and running benchmark tests for FAST libraries.

Benchmarks from this library are run with the [polymer/tachometer](https://github.com/Polymer/tachometer) package.

### Install

```bash
$ yarn install
```

### Adding a Benchmark

To add a benchmark, navigate to`/benchmarks` and create a new directory under an existing FAST library folder with the name of your benchmark.

Next, create an `index.ts` file under `/my-benchmark`.

```text
benchmarks/
└─ fast-element/
   └─ my-benchmark/
      └─ index.ts
```

You can use the below template to get started, make sure a custom element named `x-app` is available when you are finished (the scripts will look for `x-app` when compiling the benchmark).

#### index.ts

```ts
import {
    attr,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { data, RandomItem } from "../../../utils/index.js";

@customElement({
    name: "x-item",
    template: html`
        <span>${x => x.value}</span>
    `,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class XItem extends FASTElement {
    @attr value: string = "";
}

const template = html<XApp>`
    <div>
        ${repeat(
            x => x.items,
            html`
                <x-item :value=${x => x.label}>${x => x.label}</x-item>
            `
        )}
    </div>
`;

@customElement({
    name: "x-app",
    template,
})
class XApp extends FASTElement {
    @observable items: RandomItem[] = data;
}
```

#### Option to customize utils

There is a utility folder called `./utils`, where you have access to the `data` variable, this is an array of RandomItem objects.

For more details on what the data encompasses, reference below in [utils.ts](#utils.ts).

By default, there are 10k RandomItems generated, you can change this value in the [utils.ts](#utils.ts) as well.

If you are ok with these default values, you can ignore this section.

#### utils.ts

```ts
...
const itemCount = 10000;
class RandomItem {
    label: string;
    ...
}
export const data: RandomItem[] = generateData(itemCount);
...
```

### Running a Benchmark

To run a benchmark, supply all the options listed below in [Arguments](#arguments).

### Arguments

| Argument               | Example                                                         | Description                                                                                                                                                                                                                                                                                                                            | Required |
| ---------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `--library/-l`         | `--library=fast-element`                                        | The Fast library you want to run benchmarks in                                                                                                                                                                                                                                                                                         | Yes      |
| `--benchmark/-b`       | `--benchmark=test`                                              | Benchmark name                                                                                                                                                                                                                                                                                                                         | Yes      |
| `--versions/-v`        | `--versions 1.9.0 master features/feature-1` `--versions=1.9.0` | Supply versions of the library, check available [versions](#library-versions). Multiple options have to be **delimited by spaces**. You can also directly pass in the name of the github branch you wish to benchmark. `Local` is a special keyword you can pass in, check details in [Running local version](#running-local-version). | Yes      |
| `--localBenchFile/-lb` | `--localBenchFile=index2`                                       | Name of the local benchmark file **don't include the extension** This option is only turned on if you've supplied 'local' as one of the versions AND you want to add different implementation for the same benchmark test, check details in [Running local version](#running-local-version).                                           | No       |
| `--operations/-o`      | `--operations=create10k` `--operations create10k update10th`    | Defaults to run all possible operations if this argument is not supplied. Name of operations to run benchmarks against, **don't include the extension**. Delimited by spaces                                                                                                                                                           | No       |
| `--memory/-m`          | `-memory`                                                       | Display only memory performance results                                                                                                                                                                                                                                                                                                | No       |

> Note: Running all possible operations will take an extremely long time. During local development, it is recommend to run one operation at a time to get faster results.

_examples_:

`yarn run benchmark --library=fast-element --benchmark=my-benchmark --versions 1.9.0 local --localBenchFile=index2`

`yarn run benchmark --library=fast-element --benchmark=my-benchmark --versions 1.8.0 1.9.0 --operations=create10k`

`yarn run benchmark --library=fast-element --benchmark=my-benchmark --versions 1.9.0 features/feature-1 master`

#### Library versions

-   [fast-element](https://www.npmjs.com/package/@microsoft/fast-element)
-   [fast-foundation](https://www.npmjs.com/package/@microsoft/fast-foundation)

### Running local version

> Currently, only @microsoft/fast-element library has been tested with local version support.

If you want to test your local implementation against master or existing versions, follow these steps.

1. Create Symlink to local build of `@microsoft/fast-element`. Follow local build process for `@microsoft/fast-element`
    - Navigate to `fast-element` folder (../packages/web-components/fast-element)
    - Make sure build is up-to-date by running `yarn install`
    - Navigate back to `fast-benchmarks` folder (../packages/utilities/fast-benchmarks)
    - Go to `package.json` and add local file path to the dependencies

#### package.json

```json
...
  "dependencies": {
        "@microsoft/fast-element": "file:../../web-components/fast-element",
        "tachometer": "^0.5.10"
    }
...
```

> There is an [open issue](https://github.com/Polymer/tachometer/issues/215) around local dependencies and when they are resolved. For now, you would have to symlink locally.

2. [Create local implementation file](#create-local-implementation-file)

3. Run the benchmark

-   Pass in the `local` keyword in the `--versions` argument
-   Pass in the name of your local file in the `--localBenchFile` arugment
-   example: `yarn run benchmark --library=fast-element --benchmark=my-benchmark --versions 1.9.0 local --localBenchFile=local`

#### Create local implementation file

Create an `local.ts` file under `/my-benchmark` (the name of this file can be anything) with a different implementation from `index.ts`.

```text
benchmarks/
└─ fast-element/
   └─ my-benchmark/
      └─ index.ts
      └─ local.ts
```

### Running tachometer config file manually

To run tachometer manually, you have to generate a tachometer config json file.

Follow the tachometer defined [schema](#https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json) and generate a `tachometer.json` in `/fast-element/my-benchmark/`

tachometer.json

```json
{
    "$schema": "https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json",
    "timeout": 0,
    "benchmarks": [
        {
            "name": "my-benchmark",
            "browser": {
                "name": "chrome",
                "headless": true,
                "addArguments": ["--js-flags=--expose-gc", "--enable-precise-memory-info"]
            },
            "measurement": [
                {
                    "name": "usedJSHeapSize",
                    "mode": "expression",
                    "expression": "window.usedJSHeapSize"
                }
            ],

            "expand": [
                {
                    "name": "previous-version",
                    "url": "benchmarks/my-library/my-benchmark/index.html",
                    "packageVersions": {
                        "label": "1.4.0",
                        "dependencies": {
                            "my-library": "1.0.0"
                        }
                    }
                },
                {
                    "name": "local-version",
                    "url": "benchmarks/my-library/my-benchmark/index2.html",
                    "packageVersions": {
                        "label": "local",
                        "dependencies": {
                            "@microsoft/my-library": {
                                "kind": "git",
                                "repo": "https://github.com/microsoft/fast.git",
                                "ref": "my-local-branch",
                                "subdir": "packages/web-components/my-library",
                                "setupCommands": [
                                    "yarn install",
                                    "yarn --cwd ./packages/web-components/my-library build"
                                ]
                            }
                        }
                    }
                }
            ]
        }
    ]
}
```

To run the benchmark, run the command `npx tach --config benchmarks/fast-element/my-benchmark/tachometer.json`

### Future iterations

Currently, @microsoft/fast-foundation dependencies are hard-coded into the tachometer config file. There are plans to update this.

> Note: only @microsoft/fast-element and @microsoft/fast-foundation are supported
