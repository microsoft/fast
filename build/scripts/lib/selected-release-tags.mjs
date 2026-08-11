/**
 * Serialize the exact package release tags selected by the check-only phase.
 * JSON preserves tag boundaries when the value is handed between Azure stages.
 */
export function serializeSelectedReleaseTags(workspaces) {
    return JSON.stringify(workspaces.map(workspace => workspace.tag));
}

/**
 * Resolve an Azure-provided tag selection back to publishable workspaces.
 * Packing must never infer a new selection because remote tags can change
 * between the selection and packing stages.
 */
export function resolveSelectedReleaseWorkspaces(value, publishable) {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(
            "SELECTED_RELEASE_TAGS is required in packing mode and must be a non-empty JSON array.",
        );
    }

    let tags;
    try {
        tags = JSON.parse(value);
    } catch {
        throw new Error("SELECTED_RELEASE_TAGS must be valid JSON.");
    }

    if (!Array.isArray(tags)) {
        throw new Error("SELECTED_RELEASE_TAGS must be a JSON array.");
    }
    if (tags.length === 0) {
        throw new Error("SELECTED_RELEASE_TAGS must contain at least one release tag.");
    }

    const emptyIndexes = [];
    const duplicates = [];
    const seen = new Set();
    for (const [index, tag] of tags.entries()) {
        if (typeof tag !== "string" || tag.trim().length === 0) {
            emptyIndexes.push(index);
            continue;
        }
        if (seen.has(tag)) {
            duplicates.push(tag);
        }
        seen.add(tag);
    }

    if (emptyIndexes.length > 0) {
        throw new Error(
            `SELECTED_RELEASE_TAGS contains empty or non-string tags at indexes: ${emptyIndexes.join(", ")}.`,
        );
    }
    if (duplicates.length > 0) {
        throw new Error(
            `SELECTED_RELEASE_TAGS contains duplicate tags: ${[...new Set(duplicates)].join(", ")}.`,
        );
    }

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
