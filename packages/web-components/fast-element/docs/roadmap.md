# Roadmap

## Short-term

* **Feature** Enable simple function converters for `@attr`
* **Feature**: Enable event delegation through a syntax like `@click.delegate=...`
* **Feature**: Enable event capture through a syntax like `@click.capture=...`

## Medium-term

* **Experiment**: See if it's possible combine template instantiate and bind, and if that improves initial render time.
* **Feature**: Dependency injection infrastructure, including simple decorator-based property injection for `FASTElement`.
* **Refactor:** Create abstraction for `ElementInternals`.
* **Test:** Include perf benchmarks in the automated build process and track changes over time.
* **Experiment:** See if internal algos can be improved by leveraging typed arrays.
* **Feature**: Support `style` bindings on the host.

## Long-term

* **Feature:** Support interpolating `Document` instances into the `html` string (prepare for HTML modules).