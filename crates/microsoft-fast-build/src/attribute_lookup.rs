/// Convert an `aria-*` HTML attribute name to its camelCase `Element.aria*`
/// property name using a static lookup table. Returns `None` for names that
/// do not start with `aria-` or are not recognised ARIA attributes.
///
/// The mapping follows the [ARIA reflection](https://developer.mozilla.org/en-US/docs/Web/API/Element#instance_properties_included_from_aria)
/// convention on `Element`. A lookup table is used instead of algorithmic
/// conversion because ARIA attribute names do not place dashes at word
/// boundaries (e.g. `aria-valuenow` → `ariaValueNow`).
///
/// Examples: `"aria-disabled"` → `"ariaDisabled"`, `"aria-valuenow"` → `"ariaValueNow"`
pub(crate) fn aria_attr_to_property_key(name: &str) -> Option<&'static str> {
    match name {
        "aria-activedescendant" => Some("ariaActiveDescendant"),
        "aria-atomic" => Some("ariaAtomic"),
        "aria-autocomplete" => Some("ariaAutoComplete"),
        "aria-braillelabel" => Some("ariaBrailleLabel"),
        "aria-brailleroledescription" => Some("ariaBrailleRoleDescription"),
        "aria-busy" => Some("ariaBusy"),
        "aria-checked" => Some("ariaChecked"),
        "aria-colcount" => Some("ariaColCount"),
        "aria-colindex" => Some("ariaColIndex"),
        "aria-colindextext" => Some("ariaColIndexText"),
        "aria-colspan" => Some("ariaColSpan"),
        "aria-controls" => Some("ariaControls"),
        "aria-current" => Some("ariaCurrent"),
        "aria-describedby" => Some("ariaDescribedBy"),
        "aria-description" => Some("ariaDescription"),
        "aria-details" => Some("ariaDetails"),
        "aria-disabled" => Some("ariaDisabled"),
        "aria-dropeffect" => Some("ariaDropEffect"),
        "aria-errormessage" => Some("ariaErrorMessage"),
        "aria-expanded" => Some("ariaExpanded"),
        "aria-flowto" => Some("ariaFlowTo"),
        "aria-grabbed" => Some("ariaGrabbed"),
        "aria-haspopup" => Some("ariaHasPopup"),
        "aria-hidden" => Some("ariaHidden"),
        "aria-invalid" => Some("ariaInvalid"),
        "aria-keyshortcuts" => Some("ariaKeyShortcuts"),
        "aria-label" => Some("ariaLabel"),
        "aria-labelledby" => Some("ariaLabelledBy"),
        "aria-level" => Some("ariaLevel"),
        "aria-live" => Some("ariaLive"),
        "aria-modal" => Some("ariaModal"),
        "aria-multiline" => Some("ariaMultiLine"),
        "aria-multiselectable" => Some("ariaMultiSelectable"),
        "aria-orientation" => Some("ariaOrientation"),
        "aria-owns" => Some("ariaOwns"),
        "aria-placeholder" => Some("ariaPlaceholder"),
        "aria-posinset" => Some("ariaPosInSet"),
        "aria-pressed" => Some("ariaPressed"),
        "aria-readonly" => Some("ariaReadOnly"),
        "aria-relevant" => Some("ariaRelevant"),
        "aria-required" => Some("ariaRequired"),
        "aria-roledescription" => Some("ariaRoleDescription"),
        "aria-rowcount" => Some("ariaRowCount"),
        "aria-rowindex" => Some("ariaRowIndex"),
        "aria-rowindextext" => Some("ariaRowIndexText"),
        "aria-rowspan" => Some("ariaRowSpan"),
        "aria-selected" => Some("ariaSelected"),
        "aria-setsize" => Some("ariaSetSize"),
        "aria-sort" => Some("ariaSort"),
        "aria-valuemax" => Some("ariaValueMax"),
        "aria-valuemin" => Some("ariaValueMin"),
        "aria-valuenow" => Some("ariaValueNow"),
        "aria-valuetext" => Some("ariaValueText"),
        _ => None,
    }
}

/// Map an HTML attribute name to its corresponding DOM property name when
/// the two differ. Returns `None` when the attribute and property names are
/// identical (e.g. `disabled`, `title`, `hidden`) — those need no conversion.
///
/// Covers global HTML attributes and common element-specific attributes
/// whose property names use different casing or a different word entirely.
///
/// Examples: `"tabindex"` → `"tabIndex"`, `"readonly"` → `"readOnly"`,
///           `"contenteditable"` → `"contentEditable"`
pub(crate) fn html_attr_to_property_key(name: &str) -> Option<&'static str> {
    match name {
        // Global attributes
        "accesskey" => Some("accessKey"),
        "contenteditable" => Some("contentEditable"),
        "enterkeyhint" => Some("enterKeyHint"),
        "inputmode" => Some("inputMode"),
        "tabindex" => Some("tabIndex"),
        // Form attributes
        "readonly" => Some("readOnly"),
        "maxlength" => Some("maxLength"),
        "minlength" => Some("minLength"),
        "novalidate" => Some("noValidate"),
        "formaction" => Some("formAction"),
        "formenctype" => Some("formEnctype"),
        "formmethod" => Some("formMethod"),
        "formnovalidate" => Some("formNoValidate"),
        "formtarget" => Some("formTarget"),
        "autocomplete" => Some("autoComplete"),
        // Table attributes
        "colspan" => Some("colSpan"),
        "rowspan" => Some("rowSpan"),
        // Media / link attributes
        "crossorigin" => Some("crossOrigin"),
        "nomodule" => Some("noModule"),
        "referrerpolicy" => Some("referrerPolicy"),
        // Image attributes
        "ismap" => Some("isMap"),
        "usemap" => Some("useMap"),
        // Time element
        "datetime" => Some("dateTime"),
        _ => None,
    }
}
