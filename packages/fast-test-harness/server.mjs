import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = fileURLToPath(dirname(import.meta.url));

const PORT = process.env.PORT || 5273;
const base = process.env.BASE || "/";

export const app = express();

export async function startServer(cwd = process.cwd(), root, configFile) {
    root = root ?? resolve(cwd, "./test");
    configFile = configFile ?? resolve(root, "vite.config.ts");
    const indexPath = resolve(root, "./index.html");

    const tempDir = resolve(root, "temp");
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.mkdir(tempDir, { recursive: true });
    const realTempDir = await fs.realpath(tempDir);

    const pendingGenerations = new Map();
    let cachedIndexHtml = null;
    const fixtureCache = new Map();

    const { createServer } = await import("vite");

    const vite = await createServer({
        root,
        configFile,
        server: {
            middlewareMode: true,
            watch: {
                ignored: ["**/temp/**", "**/ssr-*.html"],
            },
        },
        appType: "custom",
        publicDir: resolve(__dirname, "./public"),
    });

    app.use(vite.middlewares);

    app.use(express.static(cwd));

    app.post("/generate-fixture", express.json(), async (req, res) => {
        try {
            if (!req.body.testId) {
                throw new Error("testId is required");
            }

            if (!/^[a-z0-9_-]+$/i.test(req.body.testId)) {
                throw new Error("testId contains invalid characters");
            }

            if (req.body.attributes) {
                req.body.attributes = JSON.parse(req.body.attributes);
            }

            if (req.body.styles) {
                req.body.styles = JSON.parse(req.body.styles);
            }

            const testId = req.body.testId;
            const filename = `ssr-${testId}.html`;
            const filePath = resolve(realTempDir, filename);

            const url = `/${filename}`;

            if (pendingGenerations.has(filename)) {
                await pendingGenerations.get(filename);
                return res.status(200).json({ url });
            }

            const generateTask = (async () => {
                const templateFile = await fs.readFile(
                    resolve(root, "./ssr.html"),
                    "utf-8",
                );
                const page = await vite.transformIndexHtml(url, templateFile);

                const { render } = await vite.ssrLoadModule("/src/entry-server.js");

                const { template, fixture, preloadLinks } = render(req.body);

                const styleTags = (req.body.styles || [])
                    .map(s => `<style>${s}</style>`)
                    .join("\n");

                const html = page
                    .replace(
                        "<!--fixturetitle-->",
                        () => req.body.testTitle || "FAST Test Harness (SSR)",
                    )
                    .replace("<!--templates-->", () => template ?? "")
                    .replace("<!--fixture-->", () => fixture ?? "")
                    .replace(
                        "<!--stylespreload-->",
                        () => `${preloadLinks ?? ""}${styleTags}`,
                    );

                fixtureCache.set(url, html);

                // Write to disk for debugging; served from cache above.
                await fs.writeFile(filePath, html, "utf-8");
            })();

            pendingGenerations.set(filename, generateTask);

            try {
                await generateTask;
                res.status(200).json({ url });
            } finally {
                pendingGenerations.delete(filename);
            }
        } catch (e) {
            vite?.ssrFixStacktrace?.(e);
            console.log(e.stack);
            res.status(500).end("Internal Server Error");
        }
    });

    // Serve SSR fixtures from cache without hitting the filesystem.
    app.get("/ssr-:id.html", (req, res, next) => {
        const url = req.path;
        const cached = fixtureCache.get(url);
        if (cached) {
            return res.status(200).set({ "Content-Type": "text/html" }).send(cached);
        }
        next();
    });

    // This server is a Playwright test harness, not a production service.
    // It only serves localhost during test runs (local and CI). Rate limiting
    // is unnecessary.
    app.use("*all", async (req, res, next) => {
        // Only serve the HTML shell for navigation requests, not for
        // module/asset requests that Vite's middleware didn't handle.
        const accept = req.headers.accept || "";
        if (!accept.includes("text/html")) {
            return next();
        }

        try {
            const url = req.originalUrl.replace(base, "");

            if (!cachedIndexHtml) {
                const indexFile = await fs.readFile(indexPath, "utf-8");
                cachedIndexHtml = await vite.transformIndexHtml(url, indexFile);
            }

            res.status(200).set({ "Content-Type": "text/html" }).send(cachedIndexHtml);
        } catch (e) {
            vite?.ssrFixStacktrace?.(e);
            console.log(e.stack);
            res.status(500).end("Internal Server Error");
        }
    });

    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
}
