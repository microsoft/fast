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

/// Request-local selection of registered components whose shadow roots are rendered.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub enum DsdSelection {
    /// Render every registered component.
    #[default]
    All,
    /// Render only these names. An empty set renders no shadow roots.
    Only(std::collections::BTreeSet<String>),
}

impl DsdSelection {
    pub(crate) fn includes(&self, name: &str) -> bool {
        match self {
            Self::All => true,
            Self::Only(names) => names.contains(name),
        }
    }

    #[cfg(any(target_arch = "wasm32", test))]
    pub(crate) fn from_json(source: &str) -> Result<Self, crate::RenderError> {
        let invalid = || crate::RenderError::InvalidTemplateMetadata {
            message: "dsd selection must be a JSON array of component-name strings".into(),
        };
        match crate::json::parse(source).map_err(|_| invalid())? {
            crate::JsonValue::Array(values) => values
                .into_iter()
                .map(|value| match value {
                    crate::JsonValue::String(name) => Ok(name),
                    _ => Err(invalid()),
                })
                .collect::<Result<_, _>>()
                .map(Self::Only),
            _ => Err(invalid()),
        }
    }
}

/// Configuration options for the FAST template renderer.
#[derive(Debug, Clone, Default)]
#[non_exhaustive]
pub struct RenderConfig {
    /// Strategy for mapping HTML attribute names to state property names.
    pub attribute_name_strategy: AttributeNameStrategy,
    /// Emit FAST Element 2.x indexed hydration markers instead of the
    /// default FAST Element 3.x data-free markers.
    pub markers_v2: bool,
    /// Shadow-root selection, independent of registration and prepared identities.
    pub dsd_selection: DsdSelection,
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

    /// Configure whether FAST Element 2.x indexed hydration markers are emitted.
    pub fn with_markers_v2(mut self, markers_v2: bool) -> Self {
        self.markers_v2 = markers_v2;
        self
    }

    /// Select shadow roots for this request without changing the registered definitions.
    pub fn with_dsd_selection(mut self, selection: DsdSelection) -> Self {
        self.dsd_selection = selection;
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn selection_json_requires_an_array_of_strings() {
        for source in ["{", "null", "{}", r#""card""#, "[1]", r#"["card",false]"#] {
            assert_eq!(
                DsdSelection::from_json(source).unwrap_err().code(),
                "invalid-template-metadata",
            );
        }
        assert_eq!(
            DsdSelection::from_json("[]").unwrap(),
            DsdSelection::Only(Default::default())
        );
        assert_eq!(
            DsdSelection::from_json(r#"["card","card"]"#).unwrap(),
            DsdSelection::Only(["card".into()].into()),
        );
    }
}
