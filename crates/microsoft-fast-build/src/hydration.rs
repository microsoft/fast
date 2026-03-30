/// Hydration state for one template scope.
/// Each custom-element shadow, f-when body, and f-repeat item template gets its own scope.
pub struct HydrationScope {
    pub binding_idx: usize,
}

impl HydrationScope {
    pub fn new() -> Self {
        Self { binding_idx: 0 }
    }

    /// Create a child scope with a fresh binding counter.
    pub fn child(&self) -> Self {
        Self { binding_idx: 0 }
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
    pub fn start_marker(&self, idx: usize, name: &str) -> String {
        format!("<!--fe-b$$start$${}$${}$$fe-b-->", idx, name)
    }

    pub fn end_marker(&self, idx: usize, name: &str) -> String {
        format!("<!--fe-b$$end$${}$${}$$fe-b-->", idx, name)
    }
}
