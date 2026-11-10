// @ts-check

const { createHash, randomUUID } = require("node:crypto");
const { watch } = require("node:fs");
const fs = require("node:fs/promises");
const path = require("node:path");

const wasm = require("./wasm/microsoft_fast_build.js");

const FORMAT_VERSION = 2;
const DEFAULT_MEMORY_BYTES = 32 * 1024 * 1024;
const HASH = /^[a-f0-9]{64}$/;
// Ownership coordinates live filesystem writers only, never retained render pieces.
const directoryOwners = new Set();

/** @typedef {{ checksum: string, dependencies: string[] }} PieceDescriptor */
/** @typedef {import("./prepared.js").PreparedManifest} Manifest */
/** @typedef {{ manifest: Manifest, handle: import("./prepared.js").PreparedSnapshot, readers: number, retired: boolean, drain: () => void }} Snapshot */
/** @typedef {import("./wasm/microsoft_fast_build.js").PreparedPiece} Piece */
/** @typedef {{ piece: Piece, bytes: number, users: number }} CacheRecord */
/** @typedef {{ piece: Piece, release: () => void }} Lease */
/** @typedef {{ entry?: string, entryFile?: string, templates?: Record<string, unknown>, templateFiles?: string[] }} Sources */
/** @typedef {{ maxMemoryBytes?: number, watch?: boolean, onError?: (error: Error) => void }} RuntimeOptions */

/** @param {string} message */
function artifactError(message) {
    return Object.assign(new Error(message), { code: "invalid-prepared-artifact" });
}

/** @param {unknown} error */
function errorCode(error) {
    return object(error) ? error.code : undefined;
}

/** @param {Uint8Array | string} bytes */
function digest(bytes) {
    return createHash("sha256").update(bytes).digest("hex");
}

/** @param {unknown} manifest */
function generation(manifest) {
    return digest(JSON.stringify(canonical(manifest)));
}

/** @param {any} value @returns {any} */
function canonical(value) {
    if (Array.isArray(value)) {
        return value.map(canonical);
    }
    if (object(value)) {
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map(key => [key, canonical(value[key])]),
        );
    }
    return value;
}

/** @param {unknown} value @returns {value is Record<string, any>} */
function object(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** @param {unknown} value @param {string} label */
function hash(value, label) {
    if (typeof value !== "string" || !HASH.test(value)) {
        throw artifactError(`Invalid ${label} identity.`);
    }
    return value;
}

/** @param {string} filename @param {Uint8Array | string} bytes */
async function atomicWrite(filename, bytes) {
    const temporary = `${filename}.${randomUUID()}.tmp`;
    try {
        await fs.writeFile(temporary, bytes, { flag: "wx" });
        await fs.rename(temporary, filename);
    } finally {
        await fs.rm(temporary, { force: true });
    }
}

/** @param {string} filename */
async function readManifest(filename) {
    const bytes = await fs.readFile(filename, "utf8");
    try {
        return validateManifest(JSON.parse(bytes));
    } catch {
        throw artifactError("Prepared manifest is invalid or incompatible.");
    }
}

/** Validate and copy before publishing; callers cannot mutate active snapshots. @param {unknown} input @returns {Manifest} */
function validateManifest(input) {
    if (
        !object(input) ||
        input.version !== FORMAT_VERSION ||
        input.compiler !== wasm.prepared_compiler_id() ||
        !object(input.entries) ||
        Object.keys(input.entries).length === 0 ||
        !object(input.templates) ||
        !object(input.pieces)
    ) {
        throw artifactError("Incompatible or invalid prepared manifest.");
    }
    hash(input.generation, "generation");
    for (const id of [
        ...Object.values(input.entries),
        ...Object.values(input.templates),
    ]) {
        hash(id, "entry or template");
    }
    for (const [id, descriptor] of Object.entries(input.pieces)) {
        hash(id, "piece");
        if (
            !object(descriptor) ||
            typeof descriptor.checksum !== "string" ||
            !HASH.test(descriptor.checksum) ||
            !Array.isArray(descriptor.dependencies) ||
            descriptor.dependencies.some(name => typeof name !== "string")
        ) {
            throw artifactError(`Invalid descriptor for prepared piece ${id}.`);
        }
        for (const name of descriptor.dependencies) {
            if (!Object.hasOwn(input.templates, name)) {
                throw artifactError(`Missing prepared component '${name}'.`);
            }
        }
    }
    for (const id of [
        ...Object.values(input.entries),
        ...Object.values(input.templates),
    ]) {
        if (!Object.hasOwn(input.pieces, id)) {
            throw artifactError(`Missing prepared piece ${id}.`);
        }
    }
    const { generation: expected, ...contents } = input;
    if (generation(contents) !== expected) {
        throw artifactError("Prepared manifest checksum does not match.");
    }
    return JSON.parse(JSON.stringify(input));
}

class PieceCache {
    /** @type {Map<string, CacheRecord>} */
    records = new Map();
    /** @type {Map<string, { users: number, promise: Promise<CacheRecord> }>} */
    pending = new Map();
    bytes = 0;

    /** @param {number} limit */
    constructor(limit) {
        if (!Number.isSafeInteger(limit) || limit < 0) {
            throw new TypeError("maxMemoryBytes must be a nonnegative safe integer.");
        }
        this.limit = limit;
    }

    /** @param {string} id @param {() => Promise<Piece>} load @returns {Promise<Lease>} */
    async acquire(id, load) {
        let record = this.records.get(id);
        if (record) {
            record.users++;
            this.records.delete(id);
            this.records.set(id, record);
        } else {
            let pending = this.pending.get(id);
            if (pending) {
                pending.users++;
            } else {
                /** @type {{ users: number, promise: Promise<CacheRecord> }} */
                const created = {
                    users: 1,
                    promise: Promise.resolve()
                        .then(load)
                        .then(
                            piece => {
                                const record = {
                                    piece,
                                    bytes: piece.memory_bytes,
                                    users: created.users,
                                };
                                this.records.set(id, record);
                                this.bytes += record.bytes;
                                this.pending.delete(id);
                                return record;
                            },
                            error => {
                                this.pending.delete(id);
                                throw error;
                            },
                        ),
                };
                pending = created;
                this.pending.set(id, pending);
            }
            record = await pending.promise;
        }
        let released = false;
        return {
            piece: record.piece,
            release: () => {
                if (!released) {
                    released = true;
                    record.users--;
                    this.trim();
                }
            },
        };
    }

    trim() {
        for (const [id, record] of this.records) {
            if (this.bytes <= this.limit) {
                break;
            }
            if (record.users === 0) {
                this.records.delete(id);
                this.bytes -= record.bytes;
                record.piece.free();
            }
        }
    }

    clear() {
        for (const record of this.records.values()) {
            record.piece.free();
        }
        this.records.clear();
        this.bytes = 0;
    }
}

/** @param {Uint8Array} input @param {string} id @param {PieceDescriptor} descriptor */
function decodePiece(input, id, descriptor) {
    if (!(input instanceof Uint8Array)) {
        throw artifactError(`Prepared piece ${id} is not a byte array.`);
    }
    const bytes = Uint8Array.from(input);
    if (digest(bytes) !== descriptor.checksum) {
        throw artifactError(`Checksum mismatch for prepared piece ${id}.`);
    }
    const piece = wasm.PreparedPiece.load(bytes);
    if (
        piece.id !== id ||
        JSON.stringify(JSON.parse(piece.dependencies)) !==
            JSON.stringify(descriptor.dependencies)
    ) {
        piece.free();
        throw artifactError(`Prepared piece ${id} does not match its manifest.`);
    }
    return piece;
}

/** @param {import("./prepared.js").PreparedArtifactSources} sources @param {Map<string, { bytes: Uint8Array, descriptor: PieceDescriptor }>} [reusable] */
function compile(sources, reusable = new Map()) {
    if (
        !object(sources.entries) ||
        Object.keys(sources.entries).length === 0 ||
        Object.values(sources.entries).some(value => typeof value !== "string")
    ) {
        throw new TypeError("entries must map at least one entry name to HTML strings.");
    }
    if (sources.templates !== undefined && !object(sources.templates)) {
        throw new TypeError("templates must map names to template definitions.");
    }
    const templates = sources.templates ?? {};
    const compiler = new wasm.PreparedCompiler(
        JSON.stringify(Object.keys(templates).sort()),
    );
    /** @type {Map<string, Uint8Array>} */
    const artifacts = new Map();
    /** @type {Record<string, PieceDescriptor>} */
    const pieces = Object.create(null);
    /** @param {unknown} template */
    function prepare(template) {
        const json = JSON.stringify(template);
        const id = compiler.identity(json);
        if (Object.hasOwn(pieces, id)) {
            return id;
        }
        const reused = reusable.get(id);
        if (reused) {
            artifacts.set(id, reused.bytes);
            pieces[id] = reused.descriptor;
            return id;
        }
        const piece = compiler.compile(json);
        try {
            const bytes = piece.serialize();
            artifacts.set(id, bytes);
            pieces[id] = {
                checksum: digest(bytes),
                dependencies: JSON.parse(piece.dependencies),
            };
        } finally {
            piece.free();
        }
        return id;
    }
    try {
        const entries = Object.fromEntries(
            Object.keys(sources.entries)
                .sort()
                .map(name => [name, prepare(sources.entries[name])]),
        );
        const linked = Object.fromEntries(
            Object.keys(templates)
                .sort()
                .map(name => [name, prepare(templates[name])]),
        );
        const contents = {
            version: /** @type {const} */ (2),
            compiler: wasm.prepared_compiler_id(),
            entries,
            templates: linked,
            pieces,
        };
        return { manifest: { ...contents, generation: generation(contents) }, artifacts };
    } finally {
        compiler.free();
    }
}

// Weak byte provenance avoids native rehydration, not checksum validation or compilation.
/** @type {WeakMap<Uint8Array, { id: string, checksum: string, dependencies: string }>} */
const artifactProvenance = new WeakMap();

/** @param {import("./prepared.js").PreparedArtifacts} previous */
function reusableArtifacts(previous) {
    if (!object(previous) || !(previous.artifacts instanceof Map)) {
        throw artifactError(
            "Previous preparation must contain a manifest and artifact map.",
        );
    }
    const manifest = validateManifest(previous.manifest);
    if (previous.artifacts.size !== Object.keys(manifest.pieces).length) {
        throw artifactError(
            "Previous preparation must contain exactly its manifest's pieces.",
        );
    }
    /** @type {Map<string, { bytes: Uint8Array, descriptor: PieceDescriptor }>} */
    const reusable = new Map();
    for (const [id, descriptor] of Object.entries(manifest.pieces)) {
        const input = previous.artifacts.get(id);
        if (!(input instanceof Uint8Array)) {
            throw artifactError(`Missing or invalid previous prepared piece ${id}.`);
        }
        const bytes = Uint8Array.from(input);
        if (digest(bytes) !== descriptor.checksum) {
            throw artifactError(`Checksum mismatch for previous prepared piece ${id}.`);
        }
        const provenance = artifactProvenance.get(input);
        if (
            provenance?.id !== id ||
            provenance.checksum !== descriptor.checksum ||
            provenance.dependencies !== JSON.stringify(descriptor.dependencies)
        ) {
            // Copied or independently loaded results cross the native validation boundary.
            try {
                decodePiece(bytes, id, descriptor).free();
            } catch {
                throw artifactError(`Invalid previous prepared piece ${id}.`);
            }
        }
        reusable.set(id, { bytes, descriptor });
    }
    return reusable;
}

/**
 * Compile a complete registry without filesystem access. Unchanged identities reuse
 * copied bytes from a complete previous result; inputs are still scanned and hashed.
 * Invalid, incomplete, corrupt or incompatible previous results reject before compilation.
 * Neither previous results nor their bytes are mutated or shared with the new result.
 * @param {import("./prepared.js").PreparedArtifactSources} sources
 * @param {import("./prepared.js").PreparedCompileOptions} [options]
 * @returns {import("./prepared.js").PreparedArtifacts}
 */
function compileArtifacts(sources, { previous } = {}) {
    const result = compile(
        sources,
        previous === undefined ? undefined : reusableArtifacts(previous),
    );
    for (const [id, bytes] of result.artifacts) {
        const descriptor = result.manifest.pieces[id];
        artifactProvenance.set(bytes, {
            id,
            checksum: descriptor.checksum,
            dependencies: JSON.stringify(descriptor.dependencies),
        });
    }
    return result;
}

/** @param {Sources} sources */
function copySources(sources) {
    /** @type {(keyof Sources)[]} */
    const keys = ["entry", "entryFile", "templates", "templateFiles"];
    const copied = /** @type {Sources} */ (
        Object.fromEntries(
            keys
                .filter(key => Object.hasOwn(sources, key))
                .map(key => [key, sources[key]]),
        )
    );
    if (copied.templates !== undefined) {
        copied.templates = JSON.parse(JSON.stringify(copied.templates));
    }
    if (copied.templateFiles !== undefined) {
        copied.templateFiles = copied.templateFiles.map(filename =>
            path.resolve(filename),
        );
    }
    if (copied.entryFile !== undefined) {
        copied.entryFile = path.resolve(copied.entryFile);
    }
    return copied;
}

/** @param {Sources} sources */
async function loadSources(sources) {
    if ((sources.entry === undefined) === (sources.entryFile === undefined)) {
        throw new TypeError("Provide exactly one of entry or entryFile.");
    }
    if (sources.templates !== undefined && !object(sources.templates)) {
        throw new TypeError("templates must be an object mapping names to definitions.");
    }
    const entry =
        sources.entryFile === undefined
            ? sources.entry
            : await fs.readFile(sources.entryFile, "utf8");
    if (typeof entry !== "string") {
        throw new TypeError("entry must be a template string.");
    }
    const templates = new Map(Object.entries(sources.templates ?? {}));
    for (const filename of sources.templateFiles ?? []) {
        const definitions = JSON.parse(
            wasm.parse_f_templates(await fs.readFile(filename, "utf8")),
        );
        for (const { name, ...metadata } of definitions) {
            if (typeof name !== "string" || templates.has(name)) {
                throw new Error(`Missing or duplicate template name in ${filename}.`);
            }
            templates.set(name, metadata);
        }
    }
    return { entry, templates };
}

/** @param {string} directory @param {Sources} sources @param {boolean} [refresh] */
async function buildManifest(directory, sources, refresh = false) {
    const { entry, templates } = await loadSources(sources);
    /** @type {Manifest | undefined} */
    let previous;
    try {
        previous = await readManifest(path.join(directory, "manifest.json"));
    } catch (error) {
        if (
            errorCode(error) !== "ENOENT" &&
            errorCode(error) !== "invalid-prepared-artifact" &&
            !(error instanceof SyntaxError)
        ) {
            throw error;
        }
    }

    /** @type {Map<string, { bytes: Uint8Array, descriptor: PieceDescriptor }>} */
    const reusable = new Map();
    for (const [id, descriptor] of Object.entries(previous?.pieces ?? {})) {
        try {
            const bytes = await fs.readFile(
                path.join(directory, `${id}.fast-artifact.json`),
            );
            if (digest(bytes) === descriptor.checksum) {
                reusable.set(id, { bytes, descriptor });
            }
        } catch (error) {
            if (
                errorCode(error) !== "ENOENT" &&
                errorCode(error) !== "invalid-prepared-artifact"
            ) {
                throw error;
            }
        }
    }
    const result = compile(
        {
            entries: { default: entry },
            templates:
                /** @type {import("./prepared.js").PreparedArtifactSources["templates"]} */ (
                    Object.fromEntries(templates)
                ),
        },
        reusable,
    );
    if (
        previous &&
        !refresh &&
        (Object.keys(previous.entries).length !== 1 ||
            !Object.hasOwn(previous.entries, "default"))
    ) {
        throw new Error(
            "Prepared directory contains a multi-entry manifest; use a different directory.",
        );
    }
    for (const [id, bytes] of result.artifacts) {
        if (!reusable.has(id)) {
            await atomicWrite(path.join(directory, `${id}.fast-artifact.json`), bytes);
        }
    }
    await atomicWrite(
        path.join(directory, "manifest.json"),
        JSON.stringify(result.manifest) + "\n",
    );
    return result.manifest;
}

/** An asynchronous host for portable pieces and synchronous, request-local WASM execution. */
class PreparedRuntime {
    /** @type {Snapshot} */
    #snapshot;
    /** @type {PieceCache} */
    #cache;
    /** @type {(id: string) => Promise<Uint8Array>} */
    #load;
    /** @type {Set<Snapshot>} */
    #snapshots = new Set();
    #closed = false;
    /** @type {Promise<void> | undefined} */
    #disposing;

    /** @param {import("./prepared.js").PreparedRuntimeConfiguration} options */
    constructor(options) {
        const manifest = validateManifest(options.manifest);
        if (typeof options.loadArtifact !== "function") {
            throw new TypeError("loadArtifact must be a function.");
        }
        this.#load = options.loadArtifact;
        this.#cache = new PieceCache(options.maxMemoryBytes ?? DEFAULT_MEMORY_BYTES);
        this.#snapshot = this.#createSnapshot(manifest);
    }

    get generation() {
        return this.#snapshot.handle.generation;
    }

    get snapshot() {
        return this.#snapshot.handle;
    }

    /** @param {Manifest} manifest @returns {Snapshot} */
    #createSnapshot(manifest) {
        /** @type {() => void} */
        let resolve;
        /** @type {Promise<void>} */
        const drained = new Promise(done => {
            resolve = done;
        });
        const snapshot = {
            manifest,
            handle: Object.freeze({ generation: manifest.generation, drained }),
            readers: 0,
            retired: false,
            drain: () => {
                if (snapshot.retired && snapshot.readers === 0) {
                    this.#snapshots.delete(snapshot);
                    resolve();
                }
            },
        };
        this.#snapshots.add(snapshot);
        return snapshot;
    }

    get memoryUsage() {
        return {
            bytes: this.#cache.bytes,
            pieces: this.#cache.records.size,
            pendingLoads: this.#cache.pending.size,
        };
    }

    /** @param {Manifest} manifest */
    activate(manifest) {
        this.#assertOpen();
        const validated = validateManifest(manifest);
        this.#assertOpen();
        const snapshot = this.#createSnapshot(validated);
        const previous = this.#snapshot;
        this.#snapshot = snapshot;
        previous.retired = true;
        previous.drain();
        return snapshot.handle.generation;
    }

    #assertOpen() {
        if (this.#closed) {
            throw new Error("Prepared runtime is disposed.");
        }
    }

    /** @param {string} entryName @param {unknown} [state] @param {import("./prepared.js").PreparedRenderOptions} [options] */
    render(entryName, state, options = {}) {
        return this.#request(entryName, false, state, options);
    }

    /** @param {string} name @param {unknown} [state] @param {import("./prepared.js").PreparedShadowRootOptions} [options] */
    renderShadowRoot(name, state, options = {}) {
        return /** @type {Promise<string>} */ (this.#request(name, true, state, options));
    }

    /** @param {string} name @param {boolean} fragment @param {unknown} state @param {import("./prepared.js").PreparedRenderOptions} options */
    #request(name, fragment, state, options) {
        this.#assertOpen();
        const snapshot = this.#snapshot;
        const registry = fragment
            ? snapshot.manifest.templates
            : snapshot.manifest.entries;
        if (!Object.hasOwn(registry, name)) {
            return Promise.reject(
                new Error(
                    `Unknown prepared ${fragment ? "component" : "entry"} '${name}'.`,
                ),
            );
        }
        snapshot.readers++;
        const release = () => {
            snapshot.readers--;
            snapshot.drain();
        };
        try {
            const copied = { ...options };
            if (copied.dsd !== undefined && copied.dsd !== "all") {
                if (
                    !Array.isArray(copied.dsd) ||
                    copied.dsd.some(value => typeof value !== "string")
                ) {
                    throw new TypeError(
                        "dsd must be 'all' or an array of component names.",
                    );
                }
                copied.dsd = [...copied.dsd];
            }
            const json = state === undefined ? undefined : JSON.stringify(state);
            return this.#render(
                snapshot.manifest,
                registry[name],
                fragment ? name : undefined,
                json,
                copied,
            ).finally(release);
        } catch (error) {
            release();
            throw error;
        }
    }

    /** @param {Manifest} snapshot @param {string} root @param {string | undefined} fragment @param {string | undefined} state @param {import("./prepared.js").PreparedRenderOptions} options */
    async #render(snapshot, root, fragment, state, options) {
        const selected =
            options.dsd === undefined || options.dsd === "all"
                ? undefined
                : new Set(options.dsd);
        const selection =
            selected === undefined ? undefined : JSON.stringify([...selected]);
        if (fragment !== undefined && selected !== undefined && !selected.has(fragment)) {
            wasm.validate_prepared_request(
                state,
                options.attributeNameStrategy,
                options.markersV2 ?? false,
                selection,
            );
            return "";
        }
        /** @type {Map<string, Lease>} */
        const leases = new Map();
        /** @type {Map<string, string>} */
        const templates = new Map(fragment === undefined ? [] : [[fragment, root]]);
        let program;
        try {
            const next = new Set([root]);
            while (next.size) {
                /** @type {string[]} */
                const batch = [];
                for (const id of next) {
                    batch.push(id);
                    next.delete(id);
                    if (batch.length === 32) {
                        break;
                    }
                }
                const results = await Promise.allSettled(
                    batch.map(async id => {
                        const descriptor = snapshot.pieces[id];
                        // A manifest may never substitute a different descriptor for a cached identity.
                        const key = `${id}:${descriptor.checksum}:${JSON.stringify(descriptor.dependencies)}`;
                        const lease = await this.#cache.acquire(key, async () =>
                            decodePiece(await this.#load(id), id, descriptor),
                        );
                        leases.set(id, lease);
                        next.delete(id);
                        for (const name of descriptor.dependencies) {
                            if (selected !== undefined && !selected.has(name)) {
                                continue;
                            }
                            const dependency = snapshot.templates[name];
                            templates.set(name, dependency);
                            if (!leases.has(dependency)) {
                                next.add(dependency);
                            }
                        }
                    }),
                );
                const failure = results.find(result => result.status === "rejected");
                if (failure?.status === "rejected") {
                    throw failure.reason;
                }
            }
            const entry = leases.get(root);
            if (!entry) {
                throw artifactError("Prepared root was not loaded.");
            }
            program = new wasm.PreparedProgram(entry.piece);
            program.set_registry(JSON.stringify(Object.keys(snapshot.templates)));
            for (const [name, id] of templates) {
                const lease = leases.get(id);
                if (lease) {
                    program.add_template(name, lease.piece);
                }
            }
            if (fragment !== undefined) {
                return program.render_shadow_root(
                    fragment,
                    state,
                    options.attributeNameStrategy,
                    options.markersV2 ?? false,
                    selection,
                );
            }
            const output = program.render(
                state,
                options.attributeNameStrategy,
                options.stream ?? false,
                options.markersV2 ?? false,
                selection,
            );
            return options.stream ? JSON.parse(output) : output;
        } finally {
            program?.free();
            for (const lease of leases.values()) {
                lease.release();
            }
        }
    }

    dispose() {
        if (!this.#disposing) {
            this.#closed = true;
            const snapshots = [...this.#snapshots];
            for (const snapshot of snapshots) {
                snapshot.retired = true;
                snapshot.drain();
            }
            this.#disposing = (async () => {
                await Promise.all(snapshots.map(snapshot => snapshot.handle.drained));
                this.#cache.clear();
            })();
        }
        return this.#disposing;
    }
}

/** @param {import("./prepared.js").PreparedRuntimeConfiguration} options */
function createPreparedRuntime(options) {
    return new PreparedRuntime(options);
}

/** Single-directory convenience adapter around the storage-independent runtime. */
class PreparedRenderer {
    /** @type {string} */
    #directory;
    /** @type {Sources | undefined} */
    #sources;
    /** @type {PreparedRuntime} */
    #runtime;
    /** @type {RuntimeOptions} */
    #options;
    /** @type {import("node:fs").FSWatcher[]} */
    #watchers = [];
    #refreshQueue = Promise.resolve();
    /** @type {Promise<void> | undefined} */
    #disposing;
    #closed = false;
    #watchDirty = false;
    #watchRefreshing = false;
    #ownsDirectory;

    /** @param {string} directory @param {Manifest} snapshot @param {RuntimeOptions} options @param {Sources | undefined} sources */
    constructor(directory, snapshot, options, sources) {
        this.#directory = directory;
        if (
            Object.keys(snapshot.entries).length !== 1 ||
            !Object.hasOwn(snapshot.entries, "default")
        ) {
            throw artifactError("Filesystem renderer requires a single default entry.");
        }
        this.#runtime = createPreparedRuntime({
            manifest: snapshot,
            maxMemoryBytes: options.maxMemoryBytes,
            loadArtifact: id =>
                fs.readFile(path.join(directory, `${id}.fast-artifact.json`)),
        });
        this.#options = { ...options };
        this.#sources = sources;
        this.#ownsDirectory = sources !== undefined;
        this.#replaceWatchers(this.#createWatchers(sources));
    }

    get directory() {
        return this.#directory;
    }

    get manifestPath() {
        return path.join(this.directory, "manifest.json");
    }

    get generation() {
        return this.#runtime.generation;
    }

    get memoryUsage() {
        return this.#runtime.memoryUsage;
    }

    /** @param {unknown} [state] @param {import("./prepared.js").PreparedRenderOptions} [options] @returns {Promise<string | string[]>} */
    render(state, options = {}) {
        this.#assertOpen();
        return this.#runtime.render("default", state, options);
    }

    /** @param {string} name @param {unknown} [state] @param {import("./prepared.js").PreparedShadowRootOptions} [options] */
    renderShadowRoot(name, state, options = {}) {
        this.#assertOpen();
        return this.#runtime.renderShadowRoot(name, state, options);
    }

    /** Regenerate from sources, or reload a build-generated manifest when sources are absent. @param {Sources} [changes] */
    refresh(changes = {}) {
        this.#assertOpen();
        const copied = copySources(changes);
        const refresh = this.#refreshQueue.then(async () => {
            const sources =
                this.#sources === undefined
                    ? Object.keys(copied).length
                        ? copied
                        : undefined
                    : copySources({ ...this.#sources, ...copied });
            const watchers = this.#createWatchers(sources);
            let claimed = false;
            try {
                if (sources !== undefined && !this.#ownsDirectory) {
                    if (directoryOwners.has(this.directory)) {
                        throw new Error(
                            "Prepared directory is already owned by a live renderer.",
                        );
                    }
                    directoryOwners.add(this.directory);
                    claimed = true;
                }
                const snapshot =
                    sources === undefined
                        ? await readManifest(this.manifestPath)
                        : await buildManifest(this.directory, sources, true);
                if (
                    Object.keys(snapshot.entries).length !== 1 ||
                    !Object.hasOwn(snapshot.entries, "default")
                ) {
                    throw artifactError(
                        "Filesystem renderer requires a single default entry.",
                    );
                }
                this.#assertOpen();
                this.#runtime.activate(snapshot);
                this.#sources = sources;
                this.#ownsDirectory ||= claimed;
                this.#replaceWatchers(watchers);
                return snapshot.generation;
            } catch (error) {
                if (claimed) {
                    directoryOwners.delete(this.directory);
                }
                for (const watcher of watchers) {
                    watcher.close();
                }
                throw error;
            }
        });
        this.#refreshQueue = refresh.then(
            () => {},
            () => {},
        );
        return refresh;
    }

    #assertOpen() {
        if (this.#closed) {
            throw new Error("Prepared renderer is disposed.");
        }
    }

    /** @param {Sources | undefined} sources */
    #createWatchers(sources) {
        /** @type {import("node:fs").FSWatcher[]} */
        const watchers = [];
        if (!this.#options.watch || this.#closed) {
            return watchers;
        }
        const files = sources
            ? [
                  ...(sources.entryFile ? [sources.entryFile] : []),
                  ...(sources.templateFiles ?? []),
              ]
            : [this.manifestPath];
        if (!files.length) {
            throw new TypeError("watch requires entryFile or templateFiles.");
        }
        const watched = new Set(files.map(filename => path.resolve(filename)));
        try {
            for (const directory of new Set(
                [...watched].map(file => path.dirname(file)),
            )) {
                const watcher = watch(directory, (event, filename) => {
                    if (
                        filename === null ||
                        watched.has(path.resolve(directory, filename.toString()))
                    ) {
                        this.#scheduleRefresh();
                    }
                });
                watcher.on("error", error => this.#report(error));
                watchers.push(watcher);
            }
        } catch (error) {
            for (const watcher of watchers) {
                watcher.close();
            }
            throw error;
        }
        return watchers;
    }

    /** @param {import("node:fs").FSWatcher[]} watchers */
    #replaceWatchers(watchers) {
        for (const watcher of this.#watchers) {
            watcher.close();
        }
        this.#watchers = this.#closed ? [] : watchers;
        if (this.#closed) {
            for (const watcher of watchers) {
                watcher.close();
            }
        }
    }

    #scheduleRefresh() {
        if (this.#closed) {
            return;
        }
        this.#watchDirty = true;
        if (this.#watchRefreshing) {
            return;
        }
        this.#watchRefreshing = true;
        const run = async () => {
            try {
                while (this.#watchDirty && !this.#closed) {
                    this.#watchDirty = false;
                    try {
                        await this.refresh();
                    } catch (error) {
                        this.#report(error);
                    }
                }
            } finally {
                this.#watchRefreshing = false;
            }
        };
        void run();
    }

    /** @param {unknown} error */
    #report(error) {
        const reported = error instanceof Error ? error : new Error(String(error));
        if (this.#options.onError) {
            this.#options.onError(reported);
        } else {
            process.emitWarning(reported);
        }
    }

    /** Stop watching, finish active work, and release cached WASM allocations. */
    dispose() {
        if (!this.#disposing) {
            this.#closed = true;
            for (const watcher of this.#watchers) {
                watcher.close();
            }
            this.#watchers = [];
            this.#disposing = (async () => {
                await this.#refreshQueue;
                await this.#runtime.dispose();
                if (this.#ownsDirectory) {
                    directoryOwners.delete(this.directory);
                }
            })();
        }
        return this.#disposing;
    }
}

/** @param {Sources & RuntimeOptions & { cacheDirectory: string }} options */
async function prepareRenderer(options) {
    const directory = path.resolve(options.cacheDirectory);
    const sources = copySources(options);
    if (directoryOwners.has(directory)) {
        throw new Error("Prepared directory is already owned by a live renderer.");
    }
    directoryOwners.add(directory);
    try {
        await fs.mkdir(directory, { recursive: true });
        const manifest = await buildManifest(directory, sources);
        return new PreparedRenderer(directory, manifest, options, sources);
    } catch (error) {
        directoryOwners.delete(directory);
        throw error;
    }
}

/** @param {RuntimeOptions & { manifestPath: string }} options */
async function loadRenderer(options) {
    const filename = path.resolve(options.manifestPath);
    if (path.basename(filename) !== "manifest.json") {
        throw new TypeError("manifestPath must refer to a generated manifest.json.");
    }
    const manifest = await readManifest(filename);
    return new PreparedRenderer(path.dirname(filename), manifest, options, undefined);
}

module.exports = {
    compileArtifacts,
    createPreparedRuntime,
    PreparedRuntime,
    prepareRenderer,
    loadRenderer,
    PreparedRenderer,
};
