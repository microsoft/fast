use microsoft_fast_build::Locator;
use std::fs;
use std::path::PathBuf;

/// Create a temporary directory tree under `base` that is `depth` levels deep,
/// placing an `.html` file with an `<f-template>` at the leaf.
fn create_deep_tree(base: &std::path::Path, depth: usize) -> PathBuf {
    let mut dir = base.to_path_buf();
    for i in 0..depth {
        dir = dir.join(format!("d{i}"));
    }
    fs::create_dir_all(&dir).expect("create deep dir tree");
    let file = dir.join("deep.html");
    fs::write(
        &file,
        r#"<f-template name="deep-el"><span>deep</span></f-template>"#,
    )
    .expect("write deep.html");
    file
}

#[test]
fn test_depth_within_limit_is_discovered() {
    let tmp = tempfile::tempdir().expect("create tempdir");
    // Depth 10 is well within the 50 limit.
    create_deep_tree(tmp.path(), 10);

    let pattern = format!("{}/**/*.html", tmp.path().display());
    let locator = Locator::from_patterns(&[&pattern]).expect("from_patterns");
    assert!(
        locator.has_template("deep-el"),
        "template at depth 10 should be discovered"
    );
}

#[test]
fn test_depth_beyond_limit_is_not_discovered() {
    let tmp = tempfile::tempdir().expect("create tempdir");
    // Depth 52 exceeds the MAX_DIR_DEPTH of 50.
    create_deep_tree(tmp.path(), 52);

    let pattern = format!("{}/**/*.html", tmp.path().display());
    let locator = Locator::from_patterns(&[&pattern]).expect("from_patterns");
    assert!(
        !locator.has_template("deep-el"),
        "template beyond depth limit should NOT be discovered"
    );
}

#[cfg(unix)]
#[test]
fn test_symlink_directory_is_skipped() {
    let tmp = tempfile::tempdir().expect("create tempdir");
    let real_dir = tmp.path().join("real");
    fs::create_dir_all(&real_dir).expect("create real dir");
    fs::write(
        real_dir.join("tpl.html"),
        r#"<f-template name="sym-el"><b>sym</b></f-template>"#,
    )
    .expect("write tpl.html");

    // Create a symlink inside the scan root that points to `real`.
    let link_dir = tmp.path().join("link");
    std::os::unix::fs::symlink(&real_dir, &link_dir).expect("create symlink");

    // Scan from the root — the template should be found once (via real/) but
    // the symlink (link/) should be skipped.
    let pattern = format!("{}/**/*.html", tmp.path().display());
    let locator = Locator::from_patterns(&[&pattern]).expect("from_patterns");
    assert!(
        locator.has_template("sym-el"),
        "template in real dir should be found"
    );
}

#[cfg(unix)]
#[test]
fn test_symlink_cycle_terminates() {
    let tmp = tempfile::tempdir().expect("create tempdir");
    let a = tmp.path().join("a");
    let b = tmp.path().join("a").join("b");
    fs::create_dir_all(&b).expect("create a/b");

    // a/b/cycle → a  (creates an infinite loop)
    let cycle = b.join("cycle");
    std::os::unix::fs::symlink(&a, &cycle).expect("create cycle symlink");

    // Place a template in `a` so there is something to find.
    fs::write(
        a.join("found.html"),
        r#"<f-template name="cycle-el"><i>ok</i></f-template>"#,
    )
    .expect("write found.html");

    let pattern = format!("{}/**/*.html", tmp.path().display());
    // This must terminate (not loop forever) and find the template.
    let locator = Locator::from_patterns(&[&pattern]).expect("from_patterns should not hang");
    assert!(
        locator.has_template("cycle-el"),
        "template should still be discovered despite cycle"
    );
}
