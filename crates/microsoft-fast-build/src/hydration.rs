/// Hydration state for one template scope.
/// Each custom-element shadow, f-when body, and f-repeat item template gets its own scope.
///
/// Markers are data-free — they carry only a type indicator and start/end flag.
/// The sequential factory pointer on the client derives all factory-to-node mappings
/// from DFS traversal order. The `binding_idx` counter is used only to track how many
/// attribute bindings have been allocated for `data-fe="N"` markers.
pub struct HydrationScope {
    pub binding_idx: usize,
}

impl HydrationScope {
    pub fn new() -> Self {
        Self { binding_idx: 0 }
    }

    pub fn next_binding(&mut self) -> usize {
        let idx = self.binding_idx;
        self.binding_idx += 1;
        idx
    }

    /// Content binding start marker: `<!--fe:b-->`
    pub fn content_start_marker(&self) -> &'static str {
        "<!--fe:b-->"
    }

    /// Content binding end marker: `<!--fe:/b-->`
    pub fn content_end_marker(&self) -> &'static str {
        "<!--fe:/b-->"
    }

    /// Repeat item start marker: `<!--fe:r-->`
    pub fn repeat_start_marker(&self) -> &'static str {
        "<!--fe:r-->"
    }

    /// Repeat item end marker: `<!--fe:/r-->`
    pub fn repeat_end_marker(&self) -> &'static str {
        "<!--fe:/r-->"
    }
}
