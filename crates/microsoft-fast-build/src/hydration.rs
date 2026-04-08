/// Hydration state for one template scope.
/// Each custom-element shadow, f-when body, and f-repeat item template gets its own scope.
///
/// `scope_prefix` is prepended to marker names so that nested f-when bodies produce names
/// that are unique within the full shadow DOM.  For example, a f-when body whose parent
/// allocated index 1 gets `scope_prefix = "1-"`, yielding inner markers like
/// `<!--fe-b$$start$$0$$1-when-0$$fe-b-->` instead of `<!--fe-b$$start$$0$$when-0$$fe-b-->`.
/// This prevents the FAST client runtime from confusing an inner end-marker with the
/// outer end-marker when both would otherwise share the same `id` field.
pub struct HydrationScope {
    pub binding_idx: usize,
    scope_prefix: String,
}

impl HydrationScope {
    pub fn new() -> Self {
        Self {
            binding_idx: 0,
            scope_prefix: String::new(),
        }
    }

    /// Create a child scope for the body of an f-when directive.
    /// `parent_idx` is the index allocated by the parent scope for the f-when itself;
    /// it is used as a path segment in the scope prefix to guarantee globally-unique
    /// marker names across all nesting levels within a single shadow DOM.
    pub fn child(&self, parent_idx: usize) -> Self {
        Self {
            binding_idx: 0,
            scope_prefix: format!("{}{}-", self.scope_prefix, parent_idx),
        }
    }

    pub fn next_binding(&mut self) -> usize {
        let idx = self.binding_idx;
        self.binding_idx += 1;
        idx
    }

    /// Marker naming convention:
    /// - Content bindings: `name` = the expression (e.g. `"text"` for `{{text}}`)
    /// - f-when: `name` = `"when-{idx}"`
    /// - f-repeat: `name` = `"repeat-{idx}"`
    ///
    /// The `scope_prefix` is prepended to `name` to produce a globally-unique marker id
    /// when directives are nested (e.g. f-when inside f-when).
    pub fn start_marker(&self, idx: usize, name: &str) -> String {
        format!("<!--fe-b$$start$${}$${}{}$$fe-b-->", idx, self.scope_prefix, name)
    }

    pub fn end_marker(&self, idx: usize, name: &str) -> String {
        format!("<!--fe-b$$end$${}$${}{}$$fe-b-->", idx, self.scope_prefix, name)
    }
}
