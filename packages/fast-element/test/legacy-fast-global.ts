Reflect.defineProperty(globalThis, "FAST", {
    value: {
        versions: ["2.10.4", "3.0.0"],
    },
    configurable: true,
    enumerable: false,
    writable: true,
});

await import("../src/platform.ts");

document.body.dataset.ready = "true";
