import fs from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { load } from "cheerio";

const MIME_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".wasm": "application/wasm",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
};

/**
 * Read the full request body as a string.
 */
function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on("data", chunk => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks).toString()));
        req.on("error", reject);
    });
}

/**
 * Send a JSON response.
 */
function jsonResponse(res, statusCode, data) {
    const body = JSON.stringify(data);
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
    });
    res.end(body);
}

/**
 * Send an HTML response.
 */
function htmlResponse(res, statusCode, html) {
    res.writeHead(statusCode, {
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(html),
    });
    res.end(html);
}

/**
 * Try to serve a static file from `root`. Returns true if served.
 */
async function tryServeStatic(req, res, root) {
    const urlPath = new URL(req.url, "http://localhost").pathname;
    const filePath = resolve(root, `.${urlPath}`);

    // Prevent path traversal — reject if the resolved path escapes root.
    const rel = relative(root, filePath);
    if (rel.startsWith("..") || isAbsolute(rel)) {
        return false;
    }

    try {
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) {
            return false;
        }
        const ext = extname(filePath);
        const mime = MIME_TYPES[ext] || "application/octet-stream";
        const content = await fs.readFile(filePath);
        res.writeHead(200, {
            "Content-Type": mime,
            "Content-Length": content.length,
        });
        res.end(content);
        return true;
    } catch {
        return false;
    }
}

function normalizeBase(base) {
    const withLeadingSlash = base.startsWith("/") ? base : `/${base}`;
    const normalized = withLeadingSlash.replace(/\/{2,}/g, "/");
    return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

function createRoutes(root, base, configuredRoutes) {
    const definitions = configuredRoutes?.length ? configuredRoutes : [{ base, root }];
    const bases = new Set();

    const routes = definitions.map(definition => {
        const route = {
            base: normalizeBase(definition.base ?? "/"),
            root: resolve(definition.root ?? root),
        };

        if (bases.has(route.base)) {
            throw new Error(`Duplicate test route base: ${route.base}`);
        }

        bases.add(route.base);
        return route;
    });

    return routes.sort((a, b) => b.base.length - a.base.length);
}

function findRoute(routes, pathname) {
    return routes.find(
        route => pathname === route.base || pathname.startsWith(route.base),
    );
}

function scopeRootRelativeUrls(html, base) {
    if (base === "/") {
        return html;
    }

    const $ = load(html, {
        xmlMode: false,
        decodeEntities: false,
    });

    for (const element of $("[src], [href]").toArray()) {
        for (const attribute of ["src", "href"]) {
            const value = $(element).attr(attribute);
            if (
                value?.startsWith("/") &&
                !value.startsWith("//") &&
                !value.startsWith("/@")
            ) {
                $(element).attr(attribute, `${base}${value.slice(1)}`);
            }
        }
    }

    return $.html();
}

/**
 * Resolve a route-scoped Vite module ID to a file within that route's root.
 * JavaScript IDs also fall back to matching TypeScript source files.
 *
 * @param {Array<{ base: string; root: string }>} routes - Configured test routes.
 * @param {string} id - Vite module ID, optionally including a query string.
 * @returns {Promise<string | undefined>} The resolved file path, if one exists.
 */
async function findRouteModule(routes, id) {
    const pathname = id.split("?", 1)[0];
    const route = findRoute(routes, pathname);
    if (!route) {
        return undefined;
    }

    const relativePath = decodeURIComponent(pathname.slice(route.base.length));
    const filePath = resolve(route.root, relativePath);
    const rel = relative(route.root, filePath);
    if (rel.startsWith("..") || isAbsolute(rel)) {
        return undefined;
    }

    const candidates = [filePath];
    if (extname(filePath) === ".js") {
        candidates.push(`${filePath.slice(0, -3)}.ts`);
    }

    for (const candidate of candidates) {
        try {
            const stat = await fs.stat(candidate);
            if (stat.isFile()) {
                return candidate;
            }
        } catch {
            // Continue to the next source extension.
        }
    }

    return undefined;
}

export async function startServer(cwd = process.cwd(), root, configFile, options = {}) {
    const {
        port = process.env.PORT ? Number(process.env.PORT) : 3278,
        base = process.env.BASE || "/",
        debug = process.env.FAST_DEBUG === "true",
        routes: configuredRoutes,
    } = options;

    root = root ?? (configuredRoutes?.length ? cwd : resolve(cwd, "./test"));
    const routes = createRoutes(root, base, configuredRoutes);

    try {
        await fs.access(root);
    } catch {
        console.error(
            `Error: Vite root directory does not exist: ${root}\n` +
                `  Use --root to specify a different directory, or run from a package with a test/ folder.`,
        );
        process.exit(1);
    }

    if (configFile) {
        try {
            await fs.access(configFile);
        } catch {
            console.error(
                `Error: Vite config file not found: ${configFile}\n` +
                    `  Use --config to specify a different config file.`,
            );
            process.exit(1);
        }
    }

    for (const route of routes) {
        try {
            await fs.access(route.root);
        } catch {
            console.error(`Error: Test route root does not exist: ${route.root}`);
            process.exit(1);
        }

        if (debug) {
            const tempDir = resolve(route.root, "temp");
            await fs.rm(tempDir, { recursive: true, force: true });
            await fs.mkdir(tempDir, { recursive: true });
            route.tempDir = await fs.realpath(tempDir);
        }
    }

    const pendingGenerations = new Map();
    const cachedIndexHtml = new Map();
    const fixtureCache = new Map();

    const { createServer } = await import("vite");

    const vite = await createServer({
        root,
        ...(configFile && { configFile }),
        server: {
            middlewareMode: true,
            watch: {
                ignored: [
                    "**/.nyc_output/**",
                    "**/temp/**",
                    "**/test-results/**",
                    "**/visual-changes-results/**",
                    "**/ssr-*.html",
                ],
            },
        },
        appType: "custom",
        plugins: [
            {
                name: "fast-test-harness:resolve-route-modules",
                enforce: "pre",
                async resolveId(id) {
                    return await findRouteModule(routes, id);
                },
            },
            {
                name: "fast-test-harness:resolve-css-links",
                transformIndexHtml: {
                    order: "pre",
                    async handler(html, context) {
                        const $ = load(html, {
                            xmlMode: false,
                            decodeEntities: false,
                        });
                        let changed = false;
                        const route = findRoute(routes, context.path);
                        const importer = route ? resolve(route.root, "index.html") : root;

                        for (const el of $("link[href$='.css']").toArray()) {
                            const href = $(el).attr("href");
                            if (
                                !href ||
                                href.startsWith("/") ||
                                href.startsWith(".") ||
                                href.startsWith("http")
                            ) {
                                continue;
                            }
                            const resolved = await vite.pluginContainer.resolveId(
                                href,
                                importer,
                            );
                            if (resolved?.id) {
                                $(el).attr("href", `/@fs/${resolved.id}`);
                                changed = true;
                            }
                        }

                        return changed ? $.html() : html;
                    },
                },
            },
        ],
    });

    const server = createHttpServer(async (req, res) => {
        const url = new URL(req.url, "http://localhost");
        const pathname = url.pathname;
        const route = findRoute(routes, pathname);

        // POST <base>/generate-fixture — SSR fixture generation.
        if (
            req.method === "POST" &&
            route &&
            pathname === `${route.base}generate-fixture`
        ) {
            try {
                const body = JSON.parse(await readBody(req));

                if (!body.testId) {
                    throw new Error("testId is required");
                }

                if (!/^[a-z0-9_-]+$/i.test(body.testId)) {
                    throw new Error("testId contains invalid characters");
                }

                if (body.attributes) {
                    body.attributes = JSON.parse(body.attributes);
                }

                if (body.styles) {
                    body.styles = JSON.parse(body.styles);
                }

                const testId = body.testId;
                const filename = `ssr-${testId}.html`;

                const fixtureUrl = `${route.base}${filename}`;

                if (pendingGenerations.has(fixtureUrl)) {
                    await pendingGenerations.get(fixtureUrl);
                    return jsonResponse(res, 200, { url: fixtureUrl });
                }

                const generateTask = (async () => {
                    const templateFile = await fs.readFile(
                        resolve(route.root, "./ssr.html"),
                        "utf-8",
                    );

                    const { render } = await vite.ssrLoadModule(
                        `${route.base}src/entry-server.js`,
                    );

                    const { template, fixture, preloadLinks } = render(body);

                    const styleTags = (body.styles || [])
                        .map(s => `<style>${s}</style>`)
                        .join("\n");

                    const assembled = templateFile
                        .replace(
                            "<!--fixturetitle-->",
                            () => body.testTitle || "FAST Test Harness (SSR)",
                        )
                        .replace("<!--templates-->", () => template ?? "")
                        .replace("<!--fixture-->", () => fixture ?? "")
                        .replace(
                            "<!--stylespreload-->",
                            () => `${preloadLinks ?? ""}${styleTags}`,
                        );

                    const html = await vite.transformIndexHtml(
                        fixtureUrl,
                        scopeRootRelativeUrls(assembled, route.base),
                    );

                    fixtureCache.set(fixtureUrl, html);

                    if (debug) {
                        const filePath = resolve(route.tempDir, filename);
                        await fs.writeFile(filePath, html, "utf-8");
                    }
                })();

                pendingGenerations.set(fixtureUrl, generateTask);

                try {
                    await generateTask;
                    jsonResponse(res, 200, { url: fixtureUrl });
                } finally {
                    pendingGenerations.delete(fixtureUrl);
                }
            } catch (e) {
                vite?.ssrFixStacktrace?.(e);
                console.log(e.stack);
                res.writeHead(500).end("Internal Server Error");
            }
            return;
        }

        // GET <base>/ssr-*.html — serve cached SSR fixtures.
        const routePath = route ? pathname.slice(route.base.length) : "";
        if (req.method === "GET" && route && /^ssr-[^/]+\.html$/.test(routePath)) {
            const cached = fixtureCache.get(pathname);
            if (cached) {
                return htmlResponse(res, 200, cached);
            }
        }

        const accept = req.headers.accept || "";
        if (
            req.method === "GET" &&
            route &&
            accept.includes("text/html") &&
            (pathname === route.base || pathname === `${route.base}index.html`)
        ) {
            try {
                if (!cachedIndexHtml.has(route.base)) {
                    const indexFile = await fs.readFile(
                        resolve(route.root, "index.html"),
                        "utf-8",
                    );
                    const scopedIndex = scopeRootRelativeUrls(indexFile, route.base);
                    cachedIndexHtml.set(
                        route.base,
                        await vite.transformIndexHtml(pathname, scopedIndex),
                    );
                }

                return htmlResponse(res, 200, cachedIndexHtml.get(route.base));
            } catch (e) {
                vite?.ssrFixStacktrace?.(e);
                console.log(e.stack);
                res.writeHead(500).end("Internal Server Error");
                return;
            }
        }

        // Try static files from cwd.
        if (
            !configuredRoutes?.length &&
            req.method === "GET" &&
            (await tryServeStatic(req, res, cwd))
        ) {
            return;
        }

        // Delegate to Vite's middleware (module transforms, HMR, etc.).
        // Vite handles its own routes; for anything left over, serve
        // the HTML shell for navigation requests.
        vite.middlewares(req, res, async () => {
            if (!accept.includes("text/html")) {
                res.writeHead(404).end();
                return;
            }

            if (!route) {
                res.writeHead(404).end();
                return;
            }

            try {
                if (!cachedIndexHtml.has(route.base)) {
                    const indexFile = await fs.readFile(
                        resolve(route.root, "index.html"),
                        "utf-8",
                    );
                    const scopedIndex = scopeRootRelativeUrls(indexFile, route.base);
                    cachedIndexHtml.set(
                        route.base,
                        await vite.transformIndexHtml(req.url || "/", scopedIndex),
                    );
                }

                htmlResponse(res, 200, cachedIndexHtml.get(route.base));
            } catch (e) {
                vite?.ssrFixStacktrace?.(e);
                console.log(e.stack);
                res.writeHead(500).end("Internal Server Error");
            }
        });
    });

    try {
        await new Promise((resolve, reject) => {
            server.once("error", reject);
            server.listen(port, resolve);
        });
    } catch (error) {
        await vite.close();
        throw error;
    }

    const address = server.address();
    const listeningPort = typeof address === "object" && address ? address.port : port;
    console.log(`Server started at http://localhost:${listeningPort}`);

    return {
        port: listeningPort,
        async close() {
            await new Promise((resolve, reject) => {
                server.close(error => (error ? reject(error) : resolve()));
            });
            await vite.close();
        },
    };
}
