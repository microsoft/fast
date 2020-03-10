# Roadmap

## Short-term

* **Experiment:** Condense all binding classes into a single type, removing polymorphism. See if this has an effect on performance and/or library size.
* **Feature:** Revisit the implementation of `ref` and convert to a general design for attached behaviors.
* **Feature**: Enable `@attr` to specify boolean attribute behavior as well as basic type conversion.
* **Feature**: Dependency injection infrastructure, including simple decorator-based property injection for `FastElement`.
* **Test**: Testing infrastructure and test coverage.
* **Fix**: Improve subscription cleanup on complex observable expressions.

## Medium-term

* **Experiment:** See if switching to using `TreeWalker` for template compilation and instantiation improves performance.
* **Refactor:** Create abstraction for `ElementInternals`.
* **Test:** Include perf benchmarks in the automated build process and track changes over time.
* **Doc:** Re-organize the current docs into a series of smaller articles.
* **Experiment:** See if internal algos can be improved by leveraging typed arrays.

## Long-term

* **Feature:** Support interpolating `StyleSheet` instances into the `css` string (prepare for CSS Modules)
* **Feature:** Support interpolating `Document` instances into the `html` string (prepare for HTML modules).