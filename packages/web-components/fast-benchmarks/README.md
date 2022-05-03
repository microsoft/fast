# FAST Benchmarks

This is utility library for creating and running benchmark tests for FAST scenarios.

### Setting up

`yarn install`

### Adding a Benchmark

To add a benchmark, create a new directory of the library name `/my-library/` and create a new subdirectory, eg `/my-library/my-benchmark`.
If the directory of the library you wish you add a benchmark already exists, such as `/fast-element/`, create a new subdirectory under, eg `/fast-element/my-benchmark/`.
Next, create an `index.html` file and `index.ts` file in `/my-benchmark`, these are required.

#### index.html

The html file references the index.js that is compiled from index.ts, which is compiled by running `yarn run build` (this step isn't necessary if you are running bnehcmark with `yarn run benchmark` with arguments)

```html
<!DOCTYPE html>
<script type="module" src="index.js"></script>
```

#### index.ts

```ts
```

#### Running a Benchmark

Benchmarks from this library are run with the `polymer/tachometer` package.
To run tachometer, you have to generate a tachometer config json file.

2. Pass in arguments accepted in \_\_, and fast-benchmarks will generate the tachometer config file based on the options you passed in.

To run the benchmark, supply all the options listed below, example: `yarn run benchmark --library=fast-element --test=binding -v=1.8.0 1.9.0`.

### Running a local version

### Options

| Option -           | Example                        | Description                                                                                                                                              |
| ------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--library`        | `--library=fast-element`       | The package library you want to run benchmarks in                                                                                                        |
| `--benchmark`      | `--benchmark=render`           | Benchmark name                                                                                                                                           |
| `--versions`       | `--versions=1.9.0 1.4.0 local` | Supply versions of the library, [Available versions](#https://www.npmjs.com/package/@microsoft/fast-element), delimited by `space`                       |
| `--localBenchFile` | `--localBenchFile=index2.html` | This option is only turned on if you've supplied 'local' as one of the versions AND you want to add different implementation for the same benchmark test |

'local' version should be used when you added custom benchmark

if no 'local' version is provided in --versions, all listed versions will point to the index.html to run benchmarks

example:
`yarn run benchmark --library=fast-element --benchmark=binding --versions=1.9.0 local --localBenchFile=index2.html`
`yarn run benchmark --library=fast-element --benchmark=binding --versions=1.9.0 local`
`yarn run benchmark --library=fast-element --benchmark=binding --versions=1.9.0 master`
`yarn run benchmark --library=fast-foundation --benchmark=form-associated -v 2.34.0 2.42.1`

`yarn run benchmark --library=fast-element --benchmark=test --versions=1.9.0 local`

-   this should run all default test suite

### Running a benchmark manually with tachometer json file

1. Follow the tachometer defined [schema](#https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json) and generate a `tachometer.json` in `/fast-element/my-benchmark/`

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
