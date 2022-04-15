# FAST Benchmarks

This is small utility library for creating and running benchmark tests for FAST scenarios.

## Usage

### Adding a Benchmark

To add a benchmark, create a new directory of the library name `/fast-foundation/` and create a new subdirectory, eg `/fast-foundation/my-benchmark/`.
If the directory of the library you wish you add a benchmark already exists, such as `/fast-element/`, create a new subdirectory under, eg `/fast-element/my-benchmark/`.
Next, create an `index.html` file and `index.ts` file in `/my-benchmark`, these are required.

#### index.html

```html
<!DOCTYPE html>
<script type="module" src="index.js"></script>
```

#### index.ts

```ts
```

#### Running a Benchmark

To run a benchmark, supply all the options listed below, example: `yarn run benchmark --library=fast-element --test=binding -versions=1.8.0 1.9.0`.

### Options

| Option -            | Example                         | Description                                                                                                                                              |
| ------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--library`         | `--library=fast-element`        | The package library you want to run benchmarks in                                                                                                        |
| `--test`            | `--test=binding`                | Benchmark name                                                                                                                                           |
| `--versions`        | `--versions=1.9.0 1.4.0 local`  | Supply versions of the library, [Available versions](#https://www.npmjs.com/package/@microsoft/fast-element), delimited by `space`                       |
| `--local-test-file` | `--local-test-file=index2.html` | This option is only turned on if you've supplied 'local' as one of the versions AND you want to add different implementation for the same benchmark test |

'local' version should be used when you added custom test

if no 'local' version is provided in --versions, all listed versions will point to the index.html to run benchmarks

example:
`yarn run benchmark --library=fast-element --test=binding -versions=1.9.0 local --local-test-file=index2.html`
`yarn run benchmark --library=fast-element --test=binding -versions=1.9.0 local`
`yarn run benchmark --library=fast-element --test=binding -versions=1.9.0 master`
