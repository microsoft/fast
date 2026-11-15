fn main() {
    #[cfg(feature = "node-host")]
    if std::env::var("CARGO_CFG_TARGET_ARCH").as_deref() != Ok("wasm32") {
        napi_build::setup();
    }
}
