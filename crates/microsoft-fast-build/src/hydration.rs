use std::cell::Cell;
use std::rc::Rc;

/// Shared counter for generating unique scope IDs within a render call.
#[derive(Clone)]
pub struct ScopeGen(Rc<Cell<usize>>);

impl ScopeGen {
    pub fn new() -> Self {
        Self(Rc::new(Cell::new(0)))
    }

    pub fn next(&self) -> usize {
        let n = self.0.get();
        self.0.set(n + 1);
        n
    }
}

/// Hydration state for one template scope.
/// Each custom-element shadow, f-when body, and f-repeat item template gets its own scope.
pub struct HydrationScope {
    pub binding_idx: usize,
    pub scope_id: usize,
    pub gen: ScopeGen,
}

impl HydrationScope {
    /// Create a root scope (scope ID 0 from a fresh generator).
    pub fn new(gen: &ScopeGen) -> Self {
        Self { binding_idx: 0, scope_id: gen.next(), gen: gen.clone() }
    }

    /// Create a child scope: new UUID, reset binding counter, shared generator.
    pub fn child(&self) -> Self {
        Self { binding_idx: 0, scope_id: self.gen.next(), gen: self.gen.clone() }
    }

    /// Zero-padded 10-character UUID derived from scope_id (deterministic for testing).
    pub fn uuid(&self) -> String {
        format!("{:010}", self.scope_id)
    }

    pub fn next_binding(&mut self) -> usize {
        let idx = self.binding_idx;
        self.binding_idx += 1;
        idx
    }

    pub fn start_marker(&self, idx: usize) -> String {
        format!("<!--fe-b$$start$${}$${}$$fe-b-->", idx, self.uuid())
    }

    pub fn end_marker(&self, idx: usize) -> String {
        format!("<!--fe-b$$end$${}$${}$$fe-b-->", idx, self.uuid())
    }
}
