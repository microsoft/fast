const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createDocumentationSync } = require("./watch-docs.cjs");

test("synchronizes changed documentation into the staging tree", async t => {
    const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "fast-site-watch-"));
    const sourceRoot = path.join(temporaryRoot, "source");
    const stagingRoot = path.join(temporaryRoot, "staging");
    const sourceFile = path.join(sourceRoot, "advanced", "reactivity.md");
    const stagingFile = path.join(stagingRoot, "advanced", "reactivity.md");
    const syncChangedDocumentation = createDocumentationSync([
        { sourceRoot, stagingRoot },
    ]);

    t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));

    await fs.mkdir(path.dirname(sourceFile), { recursive: true });
    await fs.writeFile(sourceFile, "Updated documentation.");
    await syncChangedDocumentation([sourceFile]);

    assert.equal(await fs.readFile(stagingFile, "utf8"), "Updated documentation.");

    await fs.rm(sourceFile);
    await syncChangedDocumentation([sourceFile]);

    await assert.rejects(fs.stat(stagingFile), { code: "ENOENT" });
});
