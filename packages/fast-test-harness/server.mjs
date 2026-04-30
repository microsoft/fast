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

export async function startServer(cwd = process.cwd(), root, configFile, options = {}) {
    const {
        port = process.env.PORT ? Number(process.env.PORT) : 3278,
        base = process.env.BASE || "/",
        debug = process.env.FAST_DEBUG === "true",
    } = options;

    root = root ?? resolve(cwd, "./test");

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

    const indexPath = resolve(root, "./index.html");

    let realTempDir;
    if (debug) {
        const tempDir = resolve(root, "temp");
        await fs.rm(tempDir, { recursive: true, force: true });
        await fs.mkdir(tempDir, { recursive: true });
        realTempDir = await fs.realpath(tempDir);
    }

    const pendingGenerations = new Map();
    let cachedIndexHtml = null;
    const fixtureCache = new Map();

    const { createServer } = await import("vite");

    const vite = await createServer({
        root,
        ...(configFile && { configFile }),
        server: {
            middlewareMode: true,
            watch: {
                ignored: ["**/temp/**", "**/ssr-*.html"],
            },
        },
        appType: "custom",
        plugins: [
            {
                name: "fast-test-harness:resolve-css-links",
                transformIndexHtml: {
                    order: "pre",
                    async handler(html) {
                        const $ = load(html, {
                            xmlMode: false,
                            decodeEntities: false,
                        });
                        let changed = false;

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
                                root,
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

        // POST /generate-fixture — SSR fixture generation.
        if (req.method === "POST" && pathname === "/generate-fixture") {
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

                const fixtureUrl = `/${filename}`;

                if (pendingGenerations.has(filename)) {
                    await pendingGenerations.get(filename);
                    return jsonResponse(res, 200, { url: fixtureUrl });
                }

                const generateTask = (async () => {
                    const templateFile = await fs.readFile(
                        resolve(root, "./ssr.html"),
                        "utf-8",
                    );

                    const { render } = await vite.ssrLoadModule("/src/entry-server.js");

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

                    const html = await vite.transformIndexHtml(fixtureUrl, assembled);

                    fixtureCache.set(fixtureUrl, html);

                    if (debug) {
                        const filePath = resolve(realTempDir, filename);
                        await fs.writeFile(filePath, html, "utf-8");
                    }
                })();

                pendingGenerations.set(filename, generateTask);

                try {
                    await generateTask;
                    jsonResponse(res, 200, { url: fixtureUrl });
                } finally {
                    pendingGenerations.delete(filename);
                }
            } catch (e) {
                vite?.ssrFixStacktrace?.(e);
                console.log(e.stack);
                res.writeHead(500).end("Internal Server Error");
            }
            return;
        }

        // GET /ssr-*.html — serve cached SSR fixtures.
        if (req.method === "GET" && /^\/ssr-[^/]+\.html$/.test(pathname)) {
            const cached = fixtureCache.get(pathname);
            if (cached) {
                return htmlResponse(res, 200, cached);
            }
        }

        // Try static files from cwd.
        if (req.method === "GET" && (await tryServeStatic(req, res, cwd))) {
            return;
        }

        // Delegate to Vite's middleware (module transforms, HMR, etc.).
        // Vite handles its own routes; for anything left over, serve
        // the HTML shell for navigation requests.
        vite.middlewares(req, res, async () => {
            const accept = req.headers.accept || "";
            if (!accept.includes("text/html")) {
                res.writeHead(404).end();
                return;
            }

            try {
                const urlPath = (req.url || "").replace(base, "");

                if (!cachedIndexHtml) {
                    const indexFile = await fs.readFile(indexPath, "utf-8");
                    cachedIndexHtml = await vite.transformIndexHtml(urlPath, indexFile);
                }

                htmlResponse(res, 200, cachedIndexHtml);
            } catch (e) {
                vite?.ssrFixStacktrace?.(e);
                console.log(e.stack);
                res.writeHead(500).end("Internal Server Error");
            }
        });
    });

    server.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}
