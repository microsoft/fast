/// Hydration state for one template scope.
/// Each custom-element shadow, f-when body, and f-repeat item template gets its own scope.
///
/// FAST Element 3.x markers are data-free. FAST Element 2.x markers include
/// binding and repeat indices so older server output can be reproduced when requested.
pub struct HydrationScope {
    pub binding_idx: usize,
    markers_v2: bool,
}

impl HydrationScope {
    pub fn new(markers_v2: bool) -> Self {
        Self { binding_idx: 0, markers_v2 }
    }

    pub fn next_binding(&mut self) -> usize {
        let idx = self.binding_idx;
        self.binding_idx += 1;
        idx
    }

    pub fn attribute_marker(&mut self, count: usize) -> String {
        debug_assert!(count > 0);
        let start = self.binding_idx;
        self.binding_idx += count;

        if !self.markers_v2 {
            return format!("data-fe=\"{}\"", count);
        }

        if count == 1 {
            format!("data-fe-b-{}", start)
        } else {
            format!("data-fe-c-{}-{}", start, count)
        }
    }

    pub fn content_start_marker(&self, index: usize) -> String {
        if self.markers_v2 {
            format!("<!--fe-b$$start$${}$$fast-build$$fe-b-->", index)
        } else {
            "<!--fe:b-->".to_string()
        }
    }

    pub fn content_end_marker(&self, index: usize) -> String {
        if self.markers_v2 {
            format!("<!--fe-b$$end$${}$$fast-build$$fe-b-->", index)
        } else {
            "<!--fe:/b-->".to_string()
        }
    }

    pub fn repeat_start_marker(&self, index: usize) -> String {
        if self.markers_v2 {
            format!("<!--fe-repeat$$start$${}$$fe-repeat-->", index)
        } else {
            "<!--fe:r-->".to_string()
        }
    }

    pub fn repeat_end_marker(&self, index: usize) -> String {
        if self.markers_v2 {
            format!("<!--fe-repeat$$end$${}$$fe-repeat-->", index)
        } else {
            "<!--fe:/r-->".to_string()
        }
    }
}
