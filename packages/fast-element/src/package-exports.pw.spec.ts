import { expect, test } from "@playwright/test";

type ImportError = Error & {
    code?: string;
};

async function getImportError(specifier: string): Promise<ImportError> {
    try {
        await import(specifier);
    } catch (error) {
        return error as ImportError;
    }

    throw new Error(`Expected import "${specifier}" to fail.`);
}

test.describe("package exports", () => {
    test("resolves the grouped binding and hydration entrypoints", async () => {
        const binding = await import("@microsoft/fast-element/binding.js");
        expect(binding.Binding).toBeDefined();
        expect(binding.Signal).toBeDefined();
        expect(binding.twoWay).toBeDefined();

        const hydration = await import("@microsoft/fast-element/hydration.js");
        expect(hydration.HydrationMarkup).toBeDefined();
        expect(hydration.installElementHydration).toBeDefined();
        expect(hydration.installHydratableViewTemplates).toBeDefined();
    });

    test("does not resolve the removed legacy subpath entrypoints", async () => {
        for (const specifier of [
            "@microsoft/fast-element/binding/two-way.js",
            "@microsoft/fast-element/binding/signal.js",
            "@microsoft/fast-element/element-hydration.js",
            "@microsoft/fast-element/install-element-hydration.js",
            "@microsoft/fast-element/install-hydratable-view-templates.js",
            "@microsoft/fast-element/metadata.js",
            "@microsoft/fast-element/pending-task.js",
        ]) {
            const error = await getImportError(specifier);
            expect(error.code).toBe("ERR_PACKAGE_PATH_NOT_EXPORTED");
        }
    });
});
