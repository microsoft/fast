import { validateNpmAssetFileName } from "./release-manifest.mjs";

export function parsePackOutput(output, expectedName, expectedVersion) {
    let records;
    try {
        records = JSON.parse(output);
    } catch (error) {
        throw new Error("npm pack did not return valid JSON.", { cause: error });
    }

    if (!Array.isArray(records) || records.length !== 1) {
        throw new Error("npm pack must return exactly one package record.");
    }

    const record = records[0];
    if (!record || typeof record !== "object" || Array.isArray(record)) {
        throw new Error("npm pack returned an invalid package record.");
    }
    if (record.name !== expectedName) {
        throw new Error(
            `npm pack returned package ${JSON.stringify(record.name)}, expected ` +
                `${JSON.stringify(expectedName)}.`,
        );
    }
    if (record.version !== expectedVersion) {
        throw new Error(
            `npm pack returned version ${JSON.stringify(record.version)}, expected ` +
                `${JSON.stringify(expectedVersion)}.`,
        );
    }

    return validateNpmAssetFileName(record.filename);
}
