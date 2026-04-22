/// Strategy for converting HTML attribute names to state property names
/// when building child state for custom elements.
///
/// This controls how attribute names that are **not** covered by the `data-*`,
/// `aria-*`, or HTML global attribute lookup tables are mapped to state keys.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
#[non_exhaustive]
pub enum AttributeNameStrategy {
    /// No conversion — attribute names are lowercased as-is.
    /// `foo-bar` stays `foo-bar`, matching `{{foo-bar}}` in the template.
    None,
    /// Convert dashed attribute names to camelCase.
    /// `foo-bar` becomes `fooBar`, matching `{{fooBar}}` in the template.
    /// Attributes that are already handled by specialized lookup tables
    /// (`data-*`, `aria-*`, and HTML global attributes like `tabindex`)
    /// are unaffected — those always use their standard property names.
    #[default]
    CamelCase,
}

/// Configuration options for the FAST template renderer.
#[derive(Debug, Clone, Default)]
#[non_exhaustive]
pub struct RenderConfig {
    /// Strategy for mapping HTML attribute names to state property names.
    pub attribute_name_strategy: AttributeNameStrategy,
}

impl RenderConfig {
    /// Create a new `RenderConfig` with default settings.
    pub fn new() -> Self {
        Self::default()
    }

    /// Set the attribute name strategy.
    pub fn with_attribute_name_strategy(mut self, strategy: AttributeNameStrategy) -> Self {
        self.attribute_name_strategy = strategy;
        self
    }
}
