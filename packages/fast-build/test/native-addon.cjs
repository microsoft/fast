const path = require("node:path");

process.env.FAST_NATIVE_ADDON ??= path.resolve(
    __dirname,
    "../../../crates/microsoft-fast-build/target/node-host/fast-build.node",
);
