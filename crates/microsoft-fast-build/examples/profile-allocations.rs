#[path = "../benches/fixtures/mod.rs"]
mod fixtures;

use microsoft_fast_build::{
    render_entry_template_with_locator, render_entry_with_locator, Locator, RenderConfig,
    RenderError,
};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::io;
#[cfg(not(test))]
use std::{
    error::Error,
    fs::{self, OpenOptions},
    io::Write,
    path::Path,
    process::Command,
};

#[derive(Debug, PartialEq, Eq)]
pub(crate) struct Options {
    pub case: String,
    pub count: usize,
    pub payload: usize,
    pub root_keys: usize,
    pub mode: String,
    pub phase: String,
    pub output: Option<String>,
}

fn invalid(message: impl Into<String>) -> io::Error {
    io::Error::new(io::ErrorKind::InvalidInput, message.into())
}

impl Options {
    pub fn parse(args: impl IntoIterator<Item = String>) -> Result<Self, io::Error> {
        let mut options = Self {
            case: "repeat_custom_elements".into(),
            count: 250,
            payload: 1,
            root_keys: 0,
            mode: "v3".into(),
            phase: "render".into(),
            output: None,
        };
        let mut seen = std::collections::HashSet::new();
        for arg in args {
            let (key, value) = arg
                .split_once('=')
                .ok_or_else(|| invalid(format!("Expected --option=value, got {arg}")))?;
            if !seen.insert(key.to_string()) {
                return Err(invalid(format!("Repeated option: {key}")));
            }
            let number = || {
                value
                    .parse::<usize>()
                    .map_err(|_| invalid(format!("Invalid integer for {key}: {value}")))
            };
            match key {
                "--case" => options.case = value.into(),
                "--count" => options.count = number()?,
                "--payload" => options.payload = number()?,
                "--root-keys" => options.root_keys = number()?,
                "--mode" => options.mode = value.into(),
                "--phase" => options.phase = value.into(),
                "--output" if !value.is_empty() => options.output = Some(value.into()),
                _ => return Err(invalid(format!("Unknown or empty option: {arg}"))),
            }
        }
        if !fixtures::CASES.contains(&options.case.as_str())
            || options.count == 0
            || options.payload == 0
            || !matches!(options.mode.as_str(), "v3" | "v2")
            || !matches!(
                options.phase.as_str(),
                "render" | "parse_state_and_render" | "locator"
            )
        {
            return Err(invalid(
                "Unknown case/mode/phase or non-positive count/payload",
            ));
        }
        if options.payload != 1 && options.case != "many_definitions" {
            return Err(invalid("Payload is configurable only for many_definitions"));
        }
        if options.root_keys != 0 && !options.case.starts_with("large_state_") {
            return Err(invalid(
                "Root keys are configurable only for large_state workloads",
            ));
        }
        Ok(options)
    }
}

enum Outcome {
    Html(String),
    Locator(Locator),
}

pub(crate) fn measure(options: &Options) -> Result<Value, RenderError> {
    let fixture = fixtures::fixture(
        &options.case,
        options.count,
        options.payload,
        options.root_keys,
    );
    let config = RenderConfig::new().with_markers_v2(options.mode == "v2");
    let locator = if options.phase == "locator" {
        None
    } else {
        Some(fixture.locator())
    };

    let mut outcome = None;
    let stats = allocation_counter::measure(|| {
        outcome = Some(match options.phase.as_str() {
            "locator" => Ok(Outcome::Locator(fixture.locator())),
            "parse_state_and_render" => render_entry_template_with_locator(
                &fixture.entry,
                &fixture.state_json,
                locator.as_ref().unwrap(),
                Some(&config),
            )
            .map(Outcome::Html),
            "render" => render_entry_with_locator(
                &fixture.entry,
                &fixture.state,
                locator.as_ref().unwrap(),
                Some(&config),
            )
            .map(Outcome::Html),
            _ => unreachable!("Options::parse validates the phase"),
        });
    });
    let outcome = outcome.expect("The measurement closure always assigns its result")?;

    let output = match outcome {
        Outcome::Html(html) => html,
        Outcome::Locator(locator) => {
            render_entry_with_locator(&fixture.entry, &fixture.state, &locator, Some(&config))?
        }
    };
    Ok(json!({
        "case": options.case,
        "count": options.count,
        "payload": options.payload,
        "rootKeys": options.root_keys,
        "mode": options.mode,
        "phase": options.phase,
        "totalBlocks": stats.count_total,
        "totalBytes": stats.bytes_total,
        "peakLiveBlocks": stats.count_max,
        "peakLiveBytes": stats.bytes_max,
        "retainedBlocks": stats.count_current,
        "retainedBytes": stats.bytes_current,
        "outputBytes": output.len(),
        "sha256": format!("{:x}", Sha256::digest(output.as_bytes())),
        "allocatedBytesPerOutputByte": if options.phase == "locator" {
            None
        } else {
            Some(stats.bytes_total as f64 / output.len() as f64)
        },
        "allocationsPerInstance": stats.count_total as f64 / options.count as f64,
    }))
}

#[cfg(not(test))]
fn command_text(program: &str, args: &[&str]) -> Result<String, Box<dyn Error>> {
    let output = Command::new(program).args(args).output()?;
    if !output.status.success() {
        return Err(io::Error::other(format!(
            "{program} failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
        .into());
    }
    Ok(String::from_utf8(output.stdout)?.trim().into())
}

#[cfg(not(test))]
fn run() -> Result<(), Box<dyn Error>> {
    if cfg!(debug_assertions) {
        return Err(invalid("Allocation reports require a --release build").into());
    }
    let options = Options::parse(std::env::args().skip(1))?;
    if options
        .output
        .as_ref()
        .is_some_and(|path| Path::new(path).exists())
    {
        return Err(invalid("Refusing to overwrite an existing allocation report").into());
    }
    let commit = command_text("git", &["rev-parse", "HEAD"])?;
    let dirty = !command_text("git", &["status", "--porcelain"])?.is_empty();
    let rustc = command_text("rustc", &["--version"])?;
    let binary_hash = format!("{:x}", Sha256::digest(fs::read(std::env::current_exe()?)?));
    let lock_hash = format!(
        "{:x}",
        Sha256::digest(fs::read(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/Cargo.lock"
        ),)?)
    );
    let record = measure(&options)?;
    let report = json!({
        "schemaVersion": 1,
        "fastCommit": commit,
        "worktreeDirty": dirty,
        "nativeBinarySha256": binary_hash,
        "cargoLockSha256": lock_hash,
        "crateVersion": env!("CARGO_PKG_VERSION"),
        "rustc": rustc,
        "profile": "release",
        "allocator": "allocation-counter (version recorded in Cargo.lock)",
        "scope": "current thread, selected phase only",
        "target": { "platform": std::env::consts::OS, "arch": std::env::consts::ARCH },
        "samples": 1,
        "records": [record],
    });
    let bytes = serde_json::to_vec_pretty(&report)?;
    if let Some(path) = options.output {
        let mut file = OpenOptions::new().write(true).create_new(true).open(path)?;
        file.write_all(&bytes)?;
        file.write_all(b"\n")?;
    } else {
        io::stdout().lock().write_all(&bytes)?;
        println!();
    }
    Ok(())
}

#[cfg(not(test))]
fn main() {
    if let Err(error) = run() {
        eprintln!("Allocation profiling failed: {error}");
        std::process::exit(1);
    }
}
