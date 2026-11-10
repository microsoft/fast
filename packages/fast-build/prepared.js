// @ts-check

const { createHash, randomUUID } = require("node:crypto");
const { watch } = require("node:fs");
const fs = require("node:fs/promises");
const path = require("node:path");

const wasm = require("./wasm/microsoft_fast_build.js");

const FORMAT_VERSION = 1;
const DEFAULT_MEMORY_BYTES = 32 * 1024 * 1024;
const HASH = /^[a-f0-9]{64}$/;

/** @typedef {{ checksum: string, dependencies: string[] }} PieceDescriptor */
/** @typedef {{ version: number, compiler: string, generation: string, entry: string, templates: Record<string, string>, pieces: Record<string, PieceDescriptor> }} Manifest */
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

/** @param {Record<string, unknown>} manifest */
function generation(manifest) {
    return digest(JSON.stringify(manifest));
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
    let input;
    const bytes = await fs.readFile(filename, "utf8");
    try {
        input = JSON.parse(bytes);
    } catch {
        throw artifactError("Prepared manifest is not valid JSON.");
    }
    if (
        !object(input) ||
        input.version !== FORMAT_VERSION ||
        input.compiler !== wasm.prepared_compiler_id() ||
        !object(input.templates) ||
        !object(input.pieces)
    ) {
        throw artifactError("Incompatible or invalid prepared manifest.");
    }
    hash(input.entry, "entry");
    hash(input.generation, "generation");
    for (const id of Object.values(input.templates)) {
        hash(id, "template");
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
    for (const id of [input.entry, ...Object.values(input.templates)]) {
        if (!Object.hasOwn(input.pieces, id)) {
            throw artifactError(`Missing prepared piece ${id}.`);
        }
    }
    const { generation: expected, ...contents } = input;
    if (generation(contents) !== expected) {
        throw artifactError("Prepared manifest checksum does not match.");
    }
    return /** @type {Manifest} */ (input);
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

/** @param {string} directory @param {string} id @param {PieceDescriptor | undefined} descriptor */
async function readPiece(directory, id, descriptor) {
    const bytes = await fs.readFile(path.join(directory, `${id}.fastpiece`));
    if (descriptor && digest(bytes) !== descriptor.checksum) {
        throw artifactError(`Checksum mismatch for prepared piece ${id}.`);
    }
    const piece = wasm.PreparedPiece.load(bytes);
    if (
        piece.id !== id ||
        (descriptor &&
            JSON.stringify(JSON.parse(piece.dependencies)) !==
                JSON.stringify(descriptor.dependencies))
    ) {
        piece.free();
        throw artifactError(`Prepared piece ${id} does not match its manifest.`);
    }
    return { piece, bytes };
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

/** @param {string} directory @param {Sources} sources @param {PieceCache} cache */
async function buildManifest(directory, sources, cache) {
    const { entry, templates } = await loadSources(sources);
    /** @type {Record<string, PieceDescriptor>} */
    const pieces = Object.create(null);
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

    const compiler = new wasm.PreparedCompiler(
        JSON.stringify([...templates.keys()].sort()),
    );

    /** @param {unknown} template */
    async function prepare(template) {
        const json = JSON.stringify(template);
        const id = compiler.identity(json);
        if (Object.hasOwn(pieces, id)) {
            return id;
        }
        const existing = previous?.pieces[id];
        if (existing) {
            try {
                const bytes = await fs.readFile(path.join(directory, `${id}.fastpiece`));
                if (digest(bytes) === existing.checksum) {
                    pieces[id] = existing;
                    return id;
                }
            } catch (error) {
                if (errorCode(error) !== "ENOENT") {
                    throw error;
                }
            }
        }
        let checksum;
        const lease = await cache.acquire(id, async () => {
            try {
                const loaded = await readPiece(directory, id, undefined);
                checksum = digest(loaded.bytes);
                return loaded.piece;
            } catch (error) {
                if (
                    errorCode(error) !== "ENOENT" &&
                    errorCode(error) !== "invalid-prepared-artifact"
                ) {
                    throw error;
                }
            }
            const piece = compiler.compile(json);
            try {
                const bytes = piece.serialize();
                await atomicWrite(path.join(directory, `${id}.fastpiece`), bytes);
                checksum = digest(bytes);
                return piece;
            } catch (error) {
                piece.free();
                throw error;
            }
        });
        try {
            if (checksum === undefined) {
                const bytes = lease.piece.serialize();
                checksum = digest(bytes);
                // A cached piece may outlive a removed/corrupt disk artifact.
                await atomicWrite(path.join(directory, `${id}.fastpiece`), bytes);
            }
            pieces[id] = {
                checksum,
                dependencies: JSON.parse(lease.piece.dependencies),
            };
        } finally {
            lease.release();
        }
        return id;
    }

    try {
        const entryId = await prepare(entry);
        /** @type {Record<string, string>} */
        const linked = Object.create(null);
        for (const [name, template] of [...templates].sort(([a], [b]) =>
            a < b ? -1 : a > b ? 1 : 0,
        )) {
            linked[name] = await prepare(template);
        }
        const contents = {
            version: FORMAT_VERSION,
            compiler: wasm.prepared_compiler_id(),
            entry: entryId,
            templates: linked,
            pieces,
        };
        const manifest = { ...contents, generation: generation(contents) };
        await atomicWrite(
            path.join(directory, "manifest.json"),
            JSON.stringify(manifest) + "\n",
        );
        return manifest;
    } finally {
        compiler.free();
    }
}

/** An asynchronous host for portable pieces and synchronous, request-local WASM execution. */
class PreparedRenderer {
    /** @type {string} */
    #directory;
    /** @type {Manifest} */
    #snapshot;
    /** @type {Sources | undefined} */
    #sources;
    /** @type {PieceCache} */
    #cache;
    /** @type {RuntimeOptions} */
    #options;
    /** @type {Set<Promise<unknown>>} */
    #renders = new Set();
    /** @type {import("node:fs").FSWatcher[]} */
    #watchers = [];
    #refreshQueue = Promise.resolve();
    /** @type {Promise<void> | undefined} */
    #disposing;
    #closed = false;
    #watchDirty = false;
    #watchRefreshing = false;

    /** @param {string} directory @param {Manifest} snapshot @param {PieceCache} cache @param {RuntimeOptions} options @param {Sources | undefined} sources */
    constructor(directory, snapshot, cache, options, sources) {
        this.#directory = directory;
        this.#snapshot = snapshot;
        this.#cache = cache;
        this.#options = { ...options };
        this.#sources = sources;
        this.#replaceWatchers(this.#createWatchers(sources));
    }

    get directory() {
        return this.#directory;
    }

    get manifestPath() {
        return path.join(this.directory, "manifest.json");
    }

    get generation() {
        return this.#snapshot.generation;
    }

    get memoryUsage() {
        return {
            bytes: this.#cache.bytes,
            pieces: this.#cache.records.size,
            pendingLoads: this.#cache.pending.size,
        };
    }

    /** @param {unknown} [state] @param {{ stream?: boolean, markersV2?: boolean, attributeNameStrategy?: "camelCase" | "none" }} [options] @returns {Promise<string | string[]>} */
    render(state, options = {}) {
        this.#assertOpen();
        const snapshot = this.#snapshot;
        const json = state === undefined ? undefined : JSON.stringify(state);
        const request = this.#render(snapshot, json, { ...options });
        this.#renders.add(request);
        request.then(
            () => this.#renders.delete(request),
            () => this.#renders.delete(request),
        );
        return request;
    }

    /** @param {Manifest} snapshot @param {string | undefined} state @param {{ stream?: boolean, markersV2?: boolean, attributeNameStrategy?: string }} options */
    async #render(snapshot, state, options) {
        /** @type {Map<string, Lease>} */
        const leases = new Map();
        /** @type {Map<string, string>} */
        const templates = new Map();
        let program;
        try {
            const next = new Set([snapshot.entry]);
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
                        const lease = await this.#cache.acquire(
                            id,
                            async () =>
                                (await readPiece(this.directory, id, descriptor)).piece,
                        );
                        leases.set(id, lease);
                        next.delete(id);
                        for (const name of descriptor.dependencies) {
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
            const entry = leases.get(snapshot.entry);
            if (!entry) {
                throw artifactError("Prepared entry was not loaded.");
            }
            program = new wasm.PreparedProgram(entry.piece);
            for (const [name, id] of templates) {
                const lease = leases.get(id);
                if (lease) {
                    program.add_template(name, lease.piece);
                }
            }
            const output = program.render(
                state,
                options.attributeNameStrategy,
                options.stream ?? false,
                options.markersV2 ?? false,
            );
            return options.stream ? JSON.parse(output) : output;
        } finally {
            program?.free();
            for (const lease of leases.values()) {
                lease.release();
            }
        }
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
            try {
                const snapshot =
                    sources === undefined
                        ? await readManifest(this.manifestPath)
                        : await buildManifest(this.directory, sources, this.#cache);
                this.#snapshot = snapshot;
                this.#sources = sources;
                this.#replaceWatchers(watchers);
                return snapshot.generation;
            } catch (error) {
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
                await Promise.allSettled([...this.#renders]);
                this.#cache.clear();
            })();
        }
        return this.#disposing;
    }
}

/** @param {Sources & RuntimeOptions & { cacheDirectory: string }} options */
async function prepareRenderer(options) {
    const directory = path.resolve(options.cacheDirectory);
    const cache = new PieceCache(options.maxMemoryBytes ?? DEFAULT_MEMORY_BYTES);
    const sources = copySources(options);
    try {
        await fs.mkdir(directory, { recursive: true });
        const manifest = await buildManifest(directory, sources, cache);
        return new PreparedRenderer(directory, manifest, cache, options, sources);
    } catch (error) {
        cache.clear();
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
    const cache = new PieceCache(options.maxMemoryBytes ?? DEFAULT_MEMORY_BYTES);
    return new PreparedRenderer(
        path.dirname(filename),
        manifest,
        cache,
        options,
        undefined,
    );
}

module.exports = { prepareRenderer, loadRenderer, PreparedRenderer };
