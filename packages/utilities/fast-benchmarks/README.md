# FAST Benchmarks
This is small utility library for creating and running benchmark tests for FAST scenarios.

## Usage
### Adding a Benchmark
To add a benchmark, create a new directory in `/benchmarks/` to hold your benchmark, eg `/benchmark/my-benchmark/`. Next, create an `index.ts` file and optionally an `index.html` file.

#### index.ts
This file sets up the benchmark scenario and should export an instance of `Benchmark` as the **default export**:

```ts
export default new Benchmark(() => /* do something */);
```

> Benchmark is in the global scope, so there is no need to import it.

#### index.html
Optionally, an index.html file can be used to inject HTML into the benchmark scenario. This should contain only the desired HTML for the scenario; the `html`, `body`, `head`, and `doctype` will be added automatically.

#### Establishing a Baseline
To gauge the impact of code changes, a baseline must first be established to determine if changes result in positive or negative change. After adding the necessary benchmarking scenario, you can create a baseline by running `yarn start -b` or `yarn start --baseline`.

#### Running all Benchmarks
To run all benchmarks against the established baseline, run `yarn start -a` or `yarn start --all`

#### Running a single Benchmark
To run a single benchmark, supply the name of the directory for the benchmark to the name argument: `yarn start -n my-benchmark` or `yarn start --name=my-benchmark`.
