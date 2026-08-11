import assert from "node:assert/strict";
import test from "node:test";
import { formatAzureBuildNumber } from "./azure-build-number.mjs";

test("formats build pipeline names from the selected package count", () => {
    assert.equal(formatAzureBuildNumber(0, "build", "123"), "0-build-123");
    assert.equal(formatAzureBuildNumber(4, "build", "456"), "4-build-456");
});

test("formats CD pipeline names from the manifest package count", () => {
    assert.equal(formatAzureBuildNumber(0, "cd", "789"), "0-cd-789");
    assert.equal(formatAzureBuildNumber(2, "cd", "789"), "2-cd-789");
});
