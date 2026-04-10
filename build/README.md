# @microsoft/fast-build-tools

Private build utilities for the FAST monorepo. These scripts are not published — they support internal CI, formatting, and packaging workflows.

## Scripts

### `publish-rust.mjs`

Automates version bumping and packaging of the `microsoft-fast-build` Rust crate during CI publish runs.

**How it works:**

1. Finds the latest Beachball-generated tag matching `microsoft-fast-build_v*`
2. Inspects git commits touching `crates/microsoft-fast-build/` since that tag
3. Determines the version bump type using [conventional commits](https://www.conventionalcommits.org/):
   - `BREAKING CHANGE` / `feat!:` / `fix!:` / `refactor!:` / `chore!:` → **major**
   - `feat:` → **minor**
   - anything else → **patch**
4. Updates the version in `crates/microsoft-fast-build/Cargo.toml`
5. Runs `cargo package` and copies the `.crate` file to `publish_artifacts/cargo/`
6. Exits cleanly (no-op) if no relevant commits exist since the last release

**Usage:**

The script is invoked automatically by the root `publish-ci` npm script:

```bash
npm run publish-ci
# runs: node build/publish-rust.mjs && beachball publish -y --no-publish
```

### `biome-changed.mjs`

Runs Biome linting/formatting only on files with uncommitted git changes. Used by `npm run lint`, `npm run biome:check`, and related commands.

### `clean.mjs`

Deletes specified directories. Used by workspace `clean` scripts to remove `dist/` and other build output.

### `get-package-json.js`

Resolves the directory of a dependency's `package.json`. Used internally by build configuration.
