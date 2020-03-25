# Roadmap

## Short-term

* **Feature**: Enable mixed case property binding
* **Feature**: Dependency injection infrastructure, including simple decorator-based property injection for `FastElement`.
* **Test**: Testing infrastructure and test coverage.
* **Fix**: Improve subscription cleanup on complex observable expressions.
* **Feature**: Add a `compose` directive that allows arbitrary logic to choose a template or element to render.
* **Feature**: Improve `when` to enable if/else scenarios.
* **Feature**: Add a `children` decorator that internally sets up a MutationObserver to watch children, provides a simple callback, and constructs a standard JS Array of selected children, which can be bound in templates.

## Medium-term

* **Refactor:** Create abstraction for `ElementInternals`.
* **Test:** Include perf benchmarks in the automated build process and track changes over time.
* **Doc:** Re-organize the current docs into a series of smaller articles.
* **Experiment:** See if internal algos can be improved by leveraging typed arrays.

## Long-term

* **Feature:** Support interpolating `StyleSheet` instances into the `css` string (prepare for CSS Modules)
* **Feature:** Support interpolating `Document` instances into the `html` string (prepare for HTML modules).