use std::collections::{BTreeSet, HashMap};
use std::sync::Arc;

use microsoft_fast_build::{
    parse_f_templates, render_entry_stream_with_locator, render_entry_with_locator,
    render_shadow_root_with_locator, AttributeNameStrategy, DsdSelection, FTemplate, JsonValue,
    Locator, PreparedPiece, PreparedProgram, RenderConfig,
};

const DEFINITIONS: &str = r#"
<f-template name="root-shell"><template role="region">
<span title="{{title}}">{{title}}</span><f-repeat value="{{item in items}}"><skip-card title="{{item.title}}" role="author" :client="{item}" @click="{noop}"><nested-card foo-bar="{{item.title}}"><b>{{item.title}}/{{title}}</b></nested-card>{{item.title}}</skip-card></f-repeat><i>{{title}}</i>
</template></f-template>
<f-template name="skip-card" shadowrootmode="closed" shadowrootdelegatesfocus><template role="default" data-default="{{title}}">
{{title}}<nested-card foo-bar="{{title}}"></nested-card>
</template></f-template>
<f-template name="nested-card"><template role="note">{{fooBar}}/{{foo-bar}}/{{title}}<slot></slot></template></f-template>
"#;

const ENTRY: &str = r#"<main><root-shell title="{{title}}"><skip-card title="literal"><nested-card foo-bar="{{title}}"></nested-card><b>{{title}}</b></skip-card></root-shell><skip-card title="{{title}}"/><p>{{title}}</p></main>"#;

fn state(title: &str) -> JsonValue {
    JsonValue::Object(HashMap::from([
        ("title".into(), JsonValue::String(title.into())),
        (
            "items".into(),
            JsonValue::Array(
                ["first", "second"]
                    .into_iter()
                    .map(|value| {
                        JsonValue::Object(HashMap::from([(
                            "title".into(),
                            JsonValue::String(value.into()),
                        )]))
                    })
                    .collect(),
            ),
        ),
    ]))
}

fn selection(names: &[&str]) -> DsdSelection {
    DsdSelection::Only(
        names
            .iter()
            .map(|name| (*name).into())
            .collect::<BTreeSet<_>>(),
    )
}

fn prepare_program(entry: &str, definitions: &[FTemplate]) -> PreparedProgram {
    let names = definitions
        .iter()
        .map(|template| template.name.clone().unwrap())
        .collect::<Vec<_>>();
    let round_trip =
        |piece: PreparedPiece| Arc::new(PreparedPiece::from_bytes(&piece.to_bytes()).unwrap());
    PreparedProgram::new(
        round_trip(PreparedPiece::compile(entry, vec![], vec![], &names).unwrap()),
        definitions
            .iter()
            .map(|template| {
                (
                    template.name.clone().unwrap(),
                    round_trip(
                        PreparedPiece::compile(
                            &template.content,
                            template.shadowroot_attributes.clone(),
                            template.host_attributes.clone(),
                            &names,
                        )
                        .unwrap(),
                    ),
                )
            })
            .collect(),
    )
    .unwrap()
}

fn locator(definitions: &[FTemplate], selected: Option<&[&str]>) -> Locator {
    Locator::from_template_definitions(
        definitions
            .iter()
            .filter(|template| {
                selected.is_none_or(|names| names.contains(&template.name.as_deref().unwrap()))
            })
            .map(|template| {
                (
                    template.name.clone().unwrap(),
                    (
                        template.content.clone(),
                        template.shadowroot_attributes.clone(),
                        template.host_attributes.clone(),
                    ),
                )
            })
            .collect(),
    )
}

#[test]
fn selected_components_match_filtered_registry_html_and_exact_chunks() {
    let definitions = parse_f_templates(DEFINITIONS);
    let program = prepare_program(ENTRY, &definitions);
    let full = locator(&definitions, None);
    for selected in [
        None,
        Some(&[][..]),
        Some(&["nested-card"][..]),
        Some(&["root-shell", "nested-card"][..]),
        Some(&["root-shell", "skip-card"][..]),
    ] {
        let filtered = locator(&definitions, selected);
        for markers_v2 in [false, true] {
            for strategy in [
                AttributeNameStrategy::None,
                AttributeNameStrategy::CamelCase,
            ] {
                let baseline_config = RenderConfig::new()
                    .with_markers_v2(markers_v2)
                    .with_attribute_name_strategy(strategy);
                let config = baseline_config
                    .clone()
                    .with_dsd_selection(selected.map_or(DsdSelection::All, selection));
                let state = state("parent<&");
                let expected =
                    render_entry_with_locator(ENTRY, &state, &filtered, Some(&baseline_config))
                        .unwrap();
                let chunks = render_entry_stream_with_locator(
                    ENTRY,
                    &state,
                    &filtered,
                    Some(&baseline_config),
                )
                .unwrap();
                assert_eq!(program.render(&state, Some(&config)).unwrap(), expected);
                assert_eq!(
                    program.render_stream(&state, Some(&config)).unwrap(),
                    chunks
                );
                assert_eq!(
                    render_entry_with_locator(ENTRY, &state, &full, Some(&config)).unwrap(),
                    expected,
                );
                assert_eq!(
                    render_entry_stream_with_locator(ENTRY, &state, &full, Some(&config)).unwrap(),
                    chunks,
                );
                assert_eq!(chunks.concat(), expected);
                if selected == Some(&[][..]) {
                    assert!(!expected.contains("<template"));
                    assert!(!expected.contains("data-default"));
                    assert!(!expected.contains("role=\"default\""));
                    assert!(expected.contains("<b>parent&lt;&amp;</b>"));
                }
                if selected == Some(&["root-shell", "nested-card"][..]) {
                    assert!(expected.contains("<b><!--"));
                    assert!(expected.contains("first"));
                    assert!(expected.contains("second"));
                    assert!(!expected.contains("data-default"));
                    assert!(expected.contains("role=\"author\""));
                }
            }
        }
    }
}

#[test]
fn excluded_shadow_errors_are_skipped_but_authored_light_dom_errors_are_preserved() {
    let definitions = parse_f_templates(
        r#"<f-template name="skip-card"><template role="default"><code>{{literal}}</code>😀{{unfinished</template></f-template>"#,
    );
    let full = locator(&definitions, None);
    let filtered = locator(&definitions, Some(&[]));
    let config = RenderConfig::new().with_dsd_selection(selection(&[]));
    for entry in [
        r#"<skip-card role="author">{{title}}</skip-card>"#,
        "<skip-card>{{title}}",
        "<skip-card/>{{title}}",
    ] {
        let program = prepare_program(entry, &definitions);
        let state = state("resolved");
        let expected = render_entry_with_locator(entry, &state, &filtered, None).unwrap();
        let chunks = render_entry_stream_with_locator(entry, &state, &filtered, None).unwrap();
        assert_eq!(program.render(&state, Some(&config)).unwrap(), expected);
        assert_eq!(
            program.render_stream(&state, Some(&config)).unwrap(),
            chunks
        );
        assert_eq!(
            render_entry_with_locator(entry, &state, &full, Some(&config)).unwrap(),
            expected,
        );
        assert_eq!(
            program.render(&state, None).unwrap_err().code(),
            "unclosed-binding"
        );
    }
    let incomplete = "<b>{{title}}</b><skip-card title=\"{{title}}\"";
    let incomplete_program = prepare_program(incomplete, &definitions);
    let root = state("resolved");
    assert_eq!(
        incomplete_program.render(&root, Some(&config)).unwrap(),
        render_entry_with_locator(incomplete, &root, &filtered, None).unwrap(),
    );
    assert_eq!(
        incomplete_program
            .render_stream(&root, Some(&config))
            .unwrap(),
        render_entry_stream_with_locator(incomplete, &root, &filtered, None).unwrap(),
    );
    let entry = "<skip-card>\r\n😀{{unfinished</skip-card>";
    let program = prepare_program(entry, &definitions);
    let state = state("resolved");
    let expected = render_entry_with_locator(entry, &state, &filtered, None).unwrap_err();
    for error in [
        program.render(&state, Some(&config)).unwrap_err(),
        program.render_stream(&state, Some(&config)).unwrap_err(),
    ] {
        assert_eq!(error.code(), expected.code());
        assert_eq!(error.location(), expected.location());
        assert_eq!(error.template_name(), expected.template_name());
    }
}

#[test]
fn prepared_fragments_reuse_legacy_state_metadata_and_hydration() {
    let definitions = parse_f_templates(DEFINITIONS);
    let program = prepare_program(ENTRY, &definitions);
    let locator = locator(&definitions, None);
    let state = state("component<&");
    for markers_v2 in [false, true] {
        for selected in [DsdSelection::All, selection(&["skip-card"]), selection(&[])] {
            let config = RenderConfig::new()
                .with_markers_v2(markers_v2)
                .with_dsd_selection(selected);
            let expected =
                render_shadow_root_with_locator("skip-card", &state, &locator, Some(&config))
                    .unwrap();
            for _ in 0..2 {
                let fragment = program
                    .render_shadow_root("skip-card", &state, Some(&config))
                    .unwrap();
                assert_eq!(fragment, expected);
                if config.dsd_selection == selection(&[]) {
                    assert_eq!(fragment, "");
                } else {
                    assert!(fragment.starts_with("<template shadowrootmode=\"closed\""));
                    assert!(fragment.contains("shadowrootdelegatesfocus"));
                    assert!(fragment.contains("component&lt;&amp;"));
                    assert!(!fragment.contains("data-default"));
                }
            }
            let error = program
                .render_shadow_root("missing-card", &state, Some(&config))
                .unwrap_err();
            assert_eq!(error.code(), "missing-template");
            assert_eq!(error.template_name(), Some("missing-card"));
        }
    }
    let invalid = parse_f_templates(
        r#"<f-template name="invalid-card"><template>{{unfinished</template></f-template>"#,
    );
    let invalid = prepare_program("", &invalid);
    let none = RenderConfig::new().with_dsd_selection(selection(&[]));
    assert_eq!(
        invalid
            .render_shadow_root("invalid-card", &state, Some(&none))
            .unwrap(),
        ""
    );
    let error = invalid
        .render_shadow_root("invalid-card", &state, None)
        .unwrap_err();
    assert_eq!(error.code(), "unclosed-binding");
    assert_eq!(error.template_name(), Some("invalid-card"));
}

#[test]
fn concurrent_policies_share_snapshot_without_request_state_or_marker_leaks() {
    let definitions = parse_f_templates(DEFINITIONS);
    let program = Arc::new(prepare_program(ENTRY, &definitions));
    let workers = (0..8)
        .map(|index| {
            let program = Arc::clone(&program);
            let selected = match index % 3 {
                0 => None,
                1 => Some(&[][..]),
                _ => Some(&["root-shell", "nested-card"][..]),
            };
            let filtered = locator(&definitions, selected);
            std::thread::spawn(move || {
                let base = RenderConfig::new().with_markers_v2(index % 2 == 0);
                let config = base
                    .clone()
                    .with_dsd_selection(selected.map_or(DsdSelection::All, selection));
                let state = state(&format!("request-{index}"));
                let expected =
                    render_entry_with_locator(ENTRY, &state, &filtered, Some(&base)).unwrap();
                let chunks =
                    render_entry_stream_with_locator(ENTRY, &state, &filtered, Some(&base))
                        .unwrap();
                for _ in 0..10 {
                    assert_eq!(program.render(&state, Some(&config)).unwrap(), expected);
                    assert_eq!(
                        program.render_stream(&state, Some(&config)).unwrap(),
                        chunks
                    );
                }
            })
        })
        .collect::<Vec<_>>();
    for worker in workers {
        worker.join().unwrap();
    }
}

#[test]
fn selection_does_not_relax_prepared_registry_link_validation() {
    let names = vec!["skip-card".into()];
    let entry = Arc::new(
        PreparedPiece::compile("<skip-card></skip-card>", vec![], vec![], &names).unwrap(),
    );
    let error = PreparedProgram::new(entry, HashMap::new()).err().unwrap();
    assert_eq!(error.code(), "invalid-prepared-artifact");
}
