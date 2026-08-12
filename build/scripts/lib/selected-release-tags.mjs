/**
 * Format the exact package release tags selected by the check-only phase for
 * the comma-separated Azure stage output.
 */
export function formatSelectedReleaseTags(workspaces) {
    const tags = workspaces.map(workspace => workspace.tag);
    const commaTag = tags.find(tag => tag.includes(","));
    if (commaTag !== undefined) {
        throw new Error(`Release tags cannot contain commas: ${commaTag}.`);
    }
    return tags.join(",");
}

/**
 * Parse the comma-separated selection handed to the packing stage without
 * trimming or otherwise changing tag boundaries.
 */
export function parseReleaseTags(value, variableName) {
    if (typeof value !== "string" || value === "") {
        throw new Error(
            `${variableName} is required and must be a non-empty comma-separated string.`,
        );
    }

    const tags = value.split(",");
    const invalidIndexes = [];
    for (const [index, tag] of tags.entries()) {
        if (tag.length === 0 || tag !== tag.trim()) {
            invalidIndexes.push(index);
        }
    }
    if (invalidIndexes.length > 0) {
        throw new Error(
            `${variableName} contains empty tags or surrounding whitespace ` +
                `at indexes: ${invalidIndexes.join(", ")}.`,
        );
    }

    const duplicates = [];
    const seen = new Set();
    for (const tag of tags) {
        if (seen.has(tag)) {
            duplicates.push(tag);
        }
        seen.add(tag);
    }
    if (duplicates.length > 0) {
        throw new Error(
            `${variableName} contains duplicate tags: ${[...new Set(duplicates)].join(
                ", ",
            )}.`,
        );
    }

    return tags;
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
    const commaTag = publishable.find(workspace => workspace.tag.includes(","))?.tag;
    if (commaTag !== undefined) {
        throw new Error(`Release tags cannot contain commas: ${commaTag}.`);
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
