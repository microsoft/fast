#[path = "../benches/fixtures/mod.rs"]
mod fixtures;

use microsoft_fast_build::{
    render_entry_template_stream_with_locator, render_entry_template_with_locator,
    render_entry_with_locator, RenderConfig,
};
use sha2::{Digest, Sha256};

#[test]
fn benchmark_corpus_matches_pre_optimization_bytes_in_both_marker_modes() {
    let records: serde_json::Value =
        serde_json::from_str(include_str!("../benches/fixtures/expected-baseline.json")).unwrap();
    for record in records.as_array().unwrap() {
        assert!(fixtures::CASES.contains(&record["case"].as_str().unwrap()));
        let fixture = fixtures::fixture(
            record["case"].as_str().unwrap(),
            record["count"].as_u64().unwrap() as usize,
            record["payload"].as_u64().unwrap() as usize,
            record["rootKeys"].as_u64().unwrap() as usize,
        );
        let locator = fixture.locator();
        let config = RenderConfig::new().with_markers_v2(record["mode"] == "v2");
        let html = render_entry_template_with_locator(
            &fixture.entry,
            &fixture.state_json,
            &locator,
            Some(&config),
        )
        .unwrap();
        assert_eq!(
            render_entry_with_locator(&fixture.entry, &fixture.state, &locator, Some(&config),)
                .unwrap(),
            html,
        );
        let stats = serde_json::json!({
            "outputBytes": html.len(),
            "sha256": format!("{:x}", Sha256::digest(html.as_bytes())),
            "hosts": html.matches("<bench-").count(),
            "bindings": html.matches("<!--fe:b-->").count() + html.matches("<!--fe-b$$start$$").count(),
            "repeats": html.matches("<!--fe:r-->").count() + html.matches("<!--fe-repeat$$start$$").count(),
            "attributeMarkers": html.matches(" data-fe=").count() + html.matches(" data-fe-b-").count() + html.matches(" data-fe-c-").count(),
        });
        for key in [
            "outputBytes",
            "sha256",
            "hosts",
            "bindings",
            "repeats",
            "attributeMarkers",
        ] {
            assert_eq!(stats[key], record[key], "{record}: {key}");
        }
        let chunks = render_entry_template_stream_with_locator(
            &fixture.entry,
            &fixture.state_json,
            &locator,
            Some(&config),
        )
        .unwrap();
        assert!(chunks.iter().all(|chunk| !chunk.is_empty()));
        assert_eq!(chunks.concat(), html, "{record}");
    }
}

#[test]
fn url_sink_has_readable_golden_output() {
    let fixture = fixtures::fixture("url_sink_siblings", 1, 1, 0);
    let locator = fixture.locator();
    let html =
        render_entry_template_with_locator(&fixture.entry, &fixture.state_json, &locator, None)
            .unwrap();
    assert_eq!(
        html,
        "<bench-url-item href-value=\"https://example.test/item/0?a=1&b=2\" src-value=\"https://example.test/image/0.png\"><template shadowrootmode=\"open\" shadowroot=\"open\"><a href=\"https://example.test/item/0?a=1&amp;b=2\" data-fe=\"1\"><!--fe:b-->Item &amp; &lt;&quot;&#39;&gt; café {i}<!--fe:/b--></a><img src=\"https://example.test/image/0.png\" data-fe=\"1\"></template></bench-url-item>",
    );
}
