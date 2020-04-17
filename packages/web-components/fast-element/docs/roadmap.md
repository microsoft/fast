# Roadmap

## Short-term

* **Experiment**: See if it's possible combine template instantiate and bind, and if that improves initial render time.
* **Test**: Testing infrastructure and test coverage.

## Medium-term

* **Feature**: Add a `compose` directive that allows arbitrary logic to choose a template or element to render.
* **Feature**: Improve `when` to enable if/else scenarios.
* **Feature**: Dependency injection infrastructure, including simple decorator-based property injection for `FASTElement`.
* **Refactor:** Create abstraction for `ElementInternals`.
* **Test:** Include perf benchmarks in the automated build process and track changes over time.
* **Doc:** Re-organize the current docs into a series of smaller articles.
* **Experiment:** See if internal algos can be improved by leveraging typed arrays.
* **Feature**: Support `style` bindings on the host.

## Long-term

* **Feature:** Support interpolating `StyleSheet` instances into the `css` string (prepare for CSS Modules)
* **Feature:** Support interpolating `Document` instances into the `html` string (prepare for HTML modules).