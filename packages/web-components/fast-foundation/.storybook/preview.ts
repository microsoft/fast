/// <reference types="vite/client" />

// Import all component definitions. This is a vite-specific feature:
// https://vitejs.dev/guide/features.html#glob-import
const modules = import.meta.glob("../src/**/*.register.ts");

for (const path in modules) {
    modules[path]();
}

// Provide the `html` tag function as a global. This is needed for some tests.
(async () => {
    const { html } = await import("@microsoft/fast-element");

    Object.defineProperty(globalThis, "html", {
        value: html,
        writable: false,
    });
})();
