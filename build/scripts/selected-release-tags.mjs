import { formatReleaseTagCsv, parseReleaseTagCsv } from "./release-tag-csv.mjs";

/**
 * Format the exact package release tags selected by the check-only phase for
 * the comma-separated Azure stage output.
 */
export function formatSelectedReleaseTags(workspaces) {
    return formatReleaseTagCsv(
        workspaces.map(workspace => workspace.tag),
        "release tags",
    );
}

/**
 * Parse the comma-separated selection handed to the packing stage without
 * trimming or otherwise changing tag boundaries.
 */
export function parseReleaseTags(value, variableName) {
    return parseReleaseTagCsv(value, variableName);
}

export function parseSelectedReleaseTags(value) {
    return parseReleaseTags(value, "SELECTED_RELEASE_TAGS");
}

/**
 * Resolve an Azure-provided tag selection back to publishable workspaces.
 * Packing must never infer a new selection because remote tags can change
 * between the selection and packing stages.
 */
export function resolveSelectedReleaseWorkspaces(value, publishable) {
    const tags = parseSelectedReleaseTags(value);
    formatReleaseTagCsv(
        publishable.map(workspace => workspace.tag),
        "publishable release tags",
    );
    const byTag = new Map(publishable.map(workspace => [workspace.tag, workspace]));
    const unknown = tags.filter(tag => !byTag.has(tag));
    if (unknown.length > 0) {
        throw new Error(
            `SELECTED_RELEASE_TAGS contains unknown release tags: ${unknown.join(", ")}.`,
        );
    }

    return tags.map(tag => byTag.get(tag));
}

export function assertSelectedTagsAreUnreleased(workspaces, tagExists) {
    const existing = workspaces
        .filter(workspace => tagExists(workspace.tag))
        .map(workspace => workspace.tag);

    if (existing.length > 0) {
        throw new Error(
            "Concurrent release detected: selected release tags appeared on origin " +
                `after selection: ${existing.join(", ")}. ` +
                "Refusing to shrink or alter the selected release batch.",
        );
    }
}
