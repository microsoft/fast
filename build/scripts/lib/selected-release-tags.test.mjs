import assert from "node:assert/strict";
import test from "node:test";
import {
    assertSelectedTagsAreUnreleased,
    resolveSelectedReleaseWorkspaces,
    serializeSelectedReleaseTags,
} from "./selected-release-tags.mjs";

const workspaces = [
    { name: "@microsoft/a", tag: "@microsoft/a_v1.0.0" },
    { name: "@microsoft/b", tag: "@microsoft/b_v2.0.0" },
];

test("serializes and resolves the exact selected tag order", () => {
    const value = serializeSelectedReleaseTags([workspaces[1], workspaces[0]]);

    assert.equal(value, '["@microsoft/b_v2.0.0","@microsoft/a_v1.0.0"]');
    assert.deepEqual(resolveSelectedReleaseWorkspaces(value, workspaces), [
        workspaces[1],
        workspaces[0],
    ]);
});

test("rejects a missing, malformed, non-array, or empty selection", () => {
    assert.throws(
        () => resolveSelectedReleaseWorkspaces(undefined, workspaces),
        /is required/,
    );
    assert.throws(() => resolveSelectedReleaseWorkspaces("{", workspaces), /valid JSON/);
    assert.throws(
        () => resolveSelectedReleaseWorkspaces('"tag"', workspaces),
        /JSON array/,
    );
    assert.throws(
        () => resolveSelectedReleaseWorkspaces("[]", workspaces),
        /at least one/,
    );
});

test("rejects empty, duplicate, and unknown requested tags", () => {
    assert.throws(
        () => resolveSelectedReleaseWorkspaces('["@microsoft/a_v1.0.0"," "]', workspaces),
        /empty or non-string tags at indexes: 1/,
    );
    assert.throws(
        () =>
            resolveSelectedReleaseWorkspaces(
                '["@microsoft/a_v1.0.0","@microsoft/a_v1.0.0"]',
                workspaces,
            ),
        /duplicate tags: @microsoft\/a_v1\.0\.0/,
    );
    assert.throws(
        () =>
            resolveSelectedReleaseWorkspaces(
                '["@microsoft/a_v1.0.0","@microsoft/unknown_v1.0.0"]',
                workspaces,
            ),
        /unknown release tags: @microsoft\/unknown_v1\.0\.0/,
    );
});

test("reports every selected tag that appeared on the remote", () => {
    assert.throws(
        () => assertSelectedTagsAreUnreleased(workspaces, () => true),
        new RegExp(
            "Concurrent release detected.*" +
                "@microsoft/a_v1\\.0\\.0, @microsoft/b_v2\\.0\\.0.*" +
                "Refusing to shrink or alter",
        ),
    );

    assert.doesNotThrow(() => assertSelectedTagsAreUnreleased(workspaces, () => false));
});
