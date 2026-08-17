const releaseTagPattern =
    /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*_v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export function validateReleaseTag(tag, label = "release tag") {
    if (typeof tag !== "string" || !releaseTagPattern.test(tag)) {
        throw new Error(`Invalid ${label}: ${String(tag)}.`);
    }
    return tag;
}

export function parseReleaseTagCsv(value, label = "RELEASE_TAGS") {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`${label} is required and must be a non-empty string.`);
    }

    const tags = value.split(",");
    const invalidIndexes = tags
        .map((tag, index) => (tag.length === 0 || tag !== tag.trim() ? index : -1))
        .filter(index => index !== -1);
    if (invalidIndexes.length > 0) {
        throw new Error(
            `Invalid ${label}: empty tags or surrounding whitespace at indexes: ` +
                `${invalidIndexes.join(", ")}.`,
        );
    }

    const malformedTags = tags.filter(tag => !releaseTagPattern.test(tag));
    if (malformedTags.length > 0) {
        throw new Error(
            `Invalid ${label}: malformed release tags: ${malformedTags.join(", ")}.`,
        );
    }

    const duplicateTags = tags.filter((tag, index) => tags.indexOf(tag) !== index);
    if (duplicateTags.length > 0) {
        throw new Error(
            `Invalid ${label}: duplicate release tags: ` +
                `${[...new Set(duplicateTags)].join(", ")}.`,
        );
    }

    return tags;
}

export function formatReleaseTagCsv(tags, label = "release tags") {
    if (!Array.isArray(tags)) {
        throw new Error(`Invalid ${label}: expected an array.`);
    }
    for (const tag of tags) {
        validateReleaseTag(tag, label);
    }
    if (new Set(tags).size !== tags.length) {
        throw new Error(`Invalid ${label}: duplicate release tags.`);
    }
    return tags.join(",");
}

export { releaseTagPattern };
