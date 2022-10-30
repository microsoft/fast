// Allow fast-element to bootstrap. This is necessary
// because DesignTokenNode uses fast-element's Observable,
// and importing Observable forces access to several DOM globals
(globalThis as any)["document"] = {
    createElement() {
        return {};
    },
};
(globalThis as any)["HTMLElement"] = class {};
