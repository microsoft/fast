use sha2::{Digest, Sha256};
use std::path::{Path, PathBuf};

fn sources(dir: &Path, files: &mut Vec<PathBuf>) {
    for entry in std::fs::read_dir(dir).expect("compiler source directory") {
        let path = entry.expect("compiler source entry").path();
        if path.is_dir() {
            sources(&path, files);
        } else if path.extension().is_some_and(|extension| extension == "rs") {
            files.push(path);
        }
    }
}

fn main() {
    let mut files = vec![
        PathBuf::from("build.rs"),
        PathBuf::from("Cargo.toml"),
        PathBuf::from("Cargo.lock"),
    ];
    sources(Path::new("src"), &mut files);
    files.sort();
    let mut hash = Sha256::new();
    println!("cargo:rerun-if-changed=src");
    for file in files {
        // Cargo preserves the authored manifest when normalizing a packaged crate.
        let source = if file == Path::new("Cargo.toml") && Path::new("Cargo.toml.orig").is_file() {
            Path::new("Cargo.toml.orig")
        } else {
            file.as_path()
        };
        println!("cargo:rerun-if-changed={}", source.display());
        let name = file.to_string_lossy().replace('\\', "/");
        let bytes = std::fs::read(source).expect("compiler fingerprint input");
        hash.update((name.len() as u64).to_le_bytes());
        hash.update(name.as_bytes());
        hash.update((bytes.len() as u64).to_le_bytes());
        hash.update(bytes);
    }
    println!(
        "cargo:rustc-env=FAST_BUILD_COMPILER_ID={:x}",
        hash.finalize()
    );
}
