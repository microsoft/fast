(globalThis as any)["document"] = {
    createElement() {
        return {};
    },
};
(globalThis as any)["HTMLElement"] = class {};
