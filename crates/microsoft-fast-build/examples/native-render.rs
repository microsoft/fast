//! Minimal native host: native-render artifact.fast < state.json
use microsoft_fast_build::{CompiledArtifact, NativeRenderOptions};
use std::io::{Read, Write};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let path = std::env::args_os()
        .nth(1)
        .ok_or("Usage: native-render <compiled-artifact>; supply request JSON on stdin")?;
    let program = CompiledArtifact::load(&std::fs::read(path)?)?;
    let mut json = String::new();
    std::io::stdin().read_to_string(&mut json)?;
    let html = program.render_entry_json(&json, &NativeRenderOptions::default())?;
    std::io::stdout().write_all(html.as_bytes())?;
    Ok(())
}
