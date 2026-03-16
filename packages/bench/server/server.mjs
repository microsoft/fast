import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "dist");
const port = parseInt(process.env.PORT ?? "5174", 10);

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
};

if (!existsSync(distDir)) {
    console.error(`dist/ not found. Run "npm run bundle" first.`);
    process.exit(1);
}

const server = createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    const buildId = url.searchParams.get("buildId");

    // When a buildId query param is present, serve from dist/{buildId}/
    let baseDir = distDir;
    if (buildId) {
        if (/[/\\]|\.\./.test(buildId)) {
            res.writeHead(400, { "content-type": "text/plain" });
            res.end("Invalid buildId");
            return;
        }

        baseDir = join(distDir, buildId);
        if (!existsSync(baseDir) || !statSync(baseDir).isDirectory()) {
            res.writeHead(404, { "content-type": "text/plain" });
            res.end(`Build "${buildId}" not found`);
            return;
        }
    }

    // Resolve to a file path within the base directory
    let filePath = join(baseDir, pathname);

    // Ensure the resolved path stays within baseDir
    if (!resolve(filePath).startsWith(resolve(baseDir))) {
        res.writeHead(400, { "content-type": "text/plain" });
        res.end("Bad Request");
        return;
    }

    // Serve index.html for directory requests
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, "index.html");
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not Found");
        return;
    }

    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    res.writeHead(200, { "content-type": contentType });
    createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
    console.log(`Serving dist/ at http://localhost:${port}`);
});
