import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import ts from "typescript";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const metadataUrl = new URL("../dist/esm/metadata.js", import.meta.url).href;
const metadataMethods = [
    "decorate",
    "metadata",
    "defineMetadata",
    "hasMetadata",
    "hasOwnMetadata",
    "getMetadata",
    "getOwnMetadata",
    "getMetadataKeys",
    "getOwnMetadataKeys",
    "deleteMetadata",
];

function assertCompleteMetadata() {
    for (const name of metadataMethods) {
        assert.equal(typeof Reflect[name], "function", `Reflect.${name}`);
    }
}

function runIsolated(exercise, options = {}) {
    const result = spawnSync(process.execPath, ["--input-type=module"], {
        input: `
                import assert from "node:assert/strict";
                import { runInThisContext } from "node:vm";
                const metadataMethods = ${JSON.stringify(metadataMethods)};
                const assertCompleteMetadata = ${assertCompleteMetadata};
                await (${exercise})(${JSON.stringify({ metadataUrl, ...options })});
            `,
        cwd: packageRoot,
        encoding: "utf8",
        timeout: 30_000,
    });

    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr || result.stdout);
}

const independentImplementation = await build({
    entryPoints: [fileURLToPath(metadataUrl)],
    bundle: true,
    format: "iife",
    globalName: "metadataImplementation",
    write: false,
});

for (const first of ["FAST", "independent implementation"]) {
    test(`${first} first interoperates with independently evaluated metadata copies`, () => {
        runIsolated(
            async ({ metadataUrl, implementationCode, first }) => {
                // Evaluate a separate bundle each time, not a cached module import.
                const evaluate = () => runInThisContext(implementationCode);
                assert.equal(Reflect.metadata, undefined);
                class Existing {}
                const existingClassValue = {};
                const existingPropertyValue = {};
                if (first === "independent implementation") {
                    evaluate();
                    Reflect.defineMetadata("class", existingClassValue, Existing);
                    Reflect.defineMetadata(
                        "property",
                        existingPropertyValue,
                        Existing.prototype,
                        "value",
                    );
                }
                const { Metadata } = await import(metadataUrl);
                if (first === "independent implementation") {
                    assert.equal(
                        Reflect.getOwnMetadata("class", Existing),
                        existingClassValue,
                    );
                    assert.equal(
                        Reflect.getOwnMetadata("property", Existing.prototype, "value"),
                        existingPropertyValue,
                    );
                }
                class Dependency {}
                class Base {}
                class Derived extends Base {}
                const classValue = {};
                const propertyValue = {};
                const symbolProperty = Symbol("property");
                const annotation = Metadata.getOrCreateAnnotationParamTypes(Base);
                annotation.push(Dependency);
                Reflect.defineMetadata("class", classValue, Base);
                Reflect.defineMetadata(
                    "property",
                    propertyValue,
                    Base.prototype,
                    "value",
                );
                Reflect.metadata("symbol", propertyValue)(Base.prototype, symbolProperty);
                Reflect.metadata("design:paramtypes", [Dependency])(Base);

                for (let evaluation = 0; evaluation < 2; evaluation++) {
                    evaluate();
                    assertCompleteMetadata();
                    assert.equal(Reflect.getOwnMetadata("class", Base), classValue);
                    assert.equal(Reflect.getMetadata("class", Derived), classValue);
                    assert.equal(Reflect.hasMetadata("class", Derived), true);
                    assert.equal(Reflect.hasOwnMetadata("class", Derived), false);
                    assert.equal(Reflect.getOwnMetadata("class", Derived), undefined);
                    assert.equal(
                        Reflect.getMetadata("property", Derived.prototype, "value"),
                        propertyValue,
                    );
                    assert.equal(
                        Reflect.getOwnMetadata("property", Derived.prototype, "value"),
                        undefined,
                    );
                    assert.equal(
                        Reflect.getOwnMetadata("property", Base.prototype),
                        undefined,
                    );
                    assert.equal(
                        Reflect.getMetadata("symbol", Derived.prototype, symbolProperty),
                        propertyValue,
                    );
                    assert.deepEqual(
                        Reflect.getOwnMetadataKeys(Base.prototype, "value"),
                        ["property"],
                    );
                    assert.deepEqual(Reflect.getOwnMetadataKeys(Derived), []);
                    assert.deepEqual(Reflect.getMetadataKeys(Derived), [
                        "annotation:paramtypes",
                        "class",
                        "design:paramtypes",
                    ]);
                    assert.equal(Metadata.getAnnotationParamTypes(Base), annotation);
                    assert.equal(
                        Metadata.getOrCreateAnnotationParamTypes(Base),
                        annotation,
                    );
                    assert.deepEqual(Metadata.getDesignParamTypes(Base), [Dependency]);
                    assert.equal(
                        Object.isFrozen(Metadata.getAnnotationParamTypes(Derived)),
                        true,
                    );
                    assert.deepEqual(Metadata.getDesignParamTypes(Derived), []);

                    Reflect.defineMetadata("class", "own", Derived);
                    assert.deepEqual(Reflect.getOwnMetadataKeys(Derived), ["class"]);
                    assert.equal(Reflect.getMetadata("class", Derived), "own");
                    assert.equal(Reflect.deleteMetadata("class", Derived), true);
                    assert.equal(Reflect.deleteMetadata("class", Derived), false);
                    assert.equal(Reflect.getMetadata("class", Derived), classValue);
                    Reflect.defineMetadata(
                        "temporary",
                        evaluation,
                        Base.prototype,
                        "value",
                    );
                    assert.deepEqual(
                        Reflect.getOwnMetadataKeys(Base.prototype, "value"),
                        ["property", "temporary"],
                    );
                    assert.equal(
                        Reflect.deleteMetadata("temporary", Base.prototype, "value"),
                        true,
                    );
                }
                const derivedAnnotation =
                    Metadata.getOrCreateAnnotationParamTypes(Derived);
                assert.notEqual(derivedAnnotation, annotation);
                assert.deepEqual(derivedAnnotation, []);
                derivedAnnotation.push("derived");
                assert.equal(
                    Reflect.getOwnMetadata("annotation:paramtypes", Derived),
                    derivedAnnotation,
                );
                assert.deepEqual(annotation, [Dependency]);
            },
            { implementationCode: independentImplementation.outputFiles[0].text, first },
        );
    });
}

test("FAST Element has no external metadata dependency", () => {
    const manifest = JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    for (const field of [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
    ]) {
        assert.equal(manifest[field]?.["reflect-metadata"], undefined);
    }
});

test("captured metadata decorators follow the current shared implementation", () => {
    runIsolated(async ({ metadataUrl }) => {
        await import(metadataUrl);
        const target = {};
        const decorator = Reflect.metadata("key", "value");
        const define = Reflect.defineMetadata;
        const calls = [];
        Reflect.defineMetadata = (...args) => {
            calls.push(args);
            define(...args);
        };
        decorator(target, "property");
        assert.deepEqual(calls, [["key", "value", target, "property"]]);
        assert.equal(Reflect.getOwnMetadata("key", target, "property"), "value");
    });
});

test("initialization reuses a complete API without replacing its methods", () => {
    runIsolated(
        async ({ implementationCode, metadataUrl }) => {
            runInThisContext(implementationCode);
            const methods = metadataMethods.map(name => Reflect[name]);
            await import(metadataUrl);
            assert.deepEqual(
                metadataMethods.map(name => Reflect[name]),
                methods,
            );
            for (const name of metadataMethods) {
                const descriptor = Object.getOwnPropertyDescriptor(Reflect, name);
                assert.equal(descriptor.enumerable, false);
                assert.equal(descriptor.writable, true);
                assert.equal(descriptor.configurable, true);
            }
        },
        { implementationCode: independentImplementation.outputFiles[0].text },
    );
});

test("initialization rejects an incomplete existing API without overwriting it", () => {
    for (const name of ["metadata", "defineMetadata", "getOwnMetadataKeys"]) {
        runIsolated(
            async ({ metadataUrl, name }) => {
                const method = () => {};
                Reflect[name] = method;
                await assert.rejects(import(metadataUrl), {
                    name: "TypeError",
                    message: /incomplete API/,
                });
                assert.equal(Reflect[name], method);
                for (const other of metadataMethods.filter(other => other !== name)) {
                    assert.equal(Reflect[other], undefined);
                }
            },
            { name },
        );
    }
});

test("metadata preserves undefined values, arbitrary keys, and enumeration order", () => {
    runIsolated(async ({ metadataUrl }) => {
        await import(metadataUrl);
        const base = {};
        const target = Object.create(base);
        const key = {};
        const symbol = Symbol("metadata");
        Reflect.defineMetadata("shadowed", "base", base);
        Reflect.defineMetadata("inherited", 1, base);
        Reflect.defineMetadata("shadowed", undefined, target);
        Reflect.defineMetadata(key, 2, target);
        Reflect.defineMetadata(symbol, 3, target);
        Reflect.defineMetadata(NaN, 4, target);
        Reflect.defineMetadata(undefined, 5, target);
        assert.equal(Reflect.hasOwnMetadata("shadowed", target), true);
        assert.equal(Reflect.hasMetadata("shadowed", target), true);
        assert.equal(Reflect.getMetadata("shadowed", target), undefined);
        assert.equal(Reflect.getOwnMetadata(key, target), 2);
        assert.equal(Reflect.getOwnMetadata(symbol, target), 3);
        assert.equal(Reflect.getOwnMetadata(NaN, target), 4);
        assert.equal(Reflect.getOwnMetadata(undefined, target), 5);
        assert.deepEqual(Reflect.getMetadataKeys(target), [
            "shadowed",
            key,
            symbol,
            NaN,
            undefined,
            "inherited",
        ]);
        const keys = Reflect.getOwnMetadataKeys(target);
        keys.length = 0;
        assert.equal(Reflect.getOwnMetadataKeys(target).length, 5);
        assert.equal(Reflect.deleteMetadata("inherited", target), false);
        assert.equal(Reflect.getMetadata("inherited", target), 1);
        assert.equal(Reflect.deleteMetadata("shadowed", target), true);
        assert.equal(Reflect.getMetadata("shadowed", target), "base");
        Reflect.defineMetadata("shadowed", "new", target);
        assert.deepEqual(Reflect.getOwnMetadataKeys(target), [
            key,
            symbol,
            NaN,
            undefined,
            "shadowed",
        ]);
    });
});

test("property metadata uses native key coercion without colliding with target metadata", () => {
    runIsolated(async ({ metadataUrl }) => {
        await import(metadataUrl);
        const target = {};
        const symbol = Symbol("property");
        let conversions = 0;
        const property = {
            [Symbol.toPrimitive](hint) {
                assert.equal(hint, "string");
                conversions++;
                return symbol;
            },
        };
        Reflect.defineMetadata("key", "target", target);
        Reflect.defineMetadata("key", "number", target, 1);
        Reflect.defineMetadata("key", "null", target, null);
        Reflect.defineMetadata("key", "symbol", target, property);
        assert.equal(conversions, 1);
        assert.equal(Reflect.getOwnMetadata("key", target), "target");
        assert.equal(Reflect.getOwnMetadata("key", target, "1"), "number");
        assert.equal(Reflect.getOwnMetadata("key", target, "null"), "null");
        assert.equal(Reflect.getOwnMetadata("key", target, Object(symbol)), "symbol");
        assert.equal(Reflect.hasOwnMetadata("key", target, property), true);
        assert.deepEqual(Reflect.getOwnMetadataKeys(target, property), ["key"]);
        assert.deepEqual(Reflect.getMetadataKeys(target, property), ["key"]);
        assert.equal(Reflect.getMetadata("key", target, property), "symbol");
        assert.equal(Reflect.hasMetadata("key", target, property), true);
        assert.equal(Reflect.deleteMetadata("key", target, property), true);
        assert.equal(Reflect.getOwnMetadata("key", target), "target");
    });
});

test("metadata rejects invalid targets and decorator property keys", () => {
    runIsolated(async ({ metadataUrl }) => {
        await import(metadataUrl);
        for (const target of [undefined, null, false, 1, "target", Symbol(), 1n]) {
            for (const method of [
                "getMetadata",
                "getOwnMetadata",
                "hasMetadata",
                "hasOwnMetadata",
                "deleteMetadata",
            ]) {
                assert.throws(() => Reflect[method]("key", target), TypeError);
            }
            assert.throws(
                () => Reflect.defineMetadata("key", "value", target),
                TypeError,
            );
            assert.throws(() => Reflect.getMetadataKeys(target), TypeError);
            assert.throws(() => Reflect.getOwnMetadataKeys(target), TypeError);
            assert.throws(() => Reflect.metadata("key", "value")(target), TypeError);
        }
        for (const key of [null, 1, false, {}, Object(Symbol())]) {
            assert.throws(() => Reflect.metadata("key", "value")({}, key), TypeError);
        }
        const error = new Error("key conversion failed");
        const key = {
            [Symbol.toPrimitive]() {
                throw error;
            },
        };
        assert.throws(
            () => Reflect.defineMetadata("key", "value", {}, key),
            value => value === error,
        );
    });
});

test("metadata supports legacy constructor prototype inheritance", () => {
    runIsolated(async ({ metadataUrl }) => {
        await import(metadataUrl);
        function Base() {}
        function Derived() {}
        Derived.prototype = Object.create(Base.prototype, {
            constructor: { value: Derived },
        });
        Reflect.defineMetadata("key", "base", Base);
        assert.equal(Reflect.getMetadata("key", Derived), "base");
        assert.equal(Reflect.hasMetadata("key", Derived), true);
        assert.equal(Reflect.hasOwnMetadata("key", Derived), false);
        assert.deepEqual(Reflect.getMetadataKeys(Derived), ["key"]);
    });
});

test("decorate applies class and property decorators in reverse order", () => {
    runIsolated(async ({ metadataUrl }) => {
        await import(metadataUrl);
        class Initial {}
        class Replacement {}
        const calls = [];
        assert.equal(
            Reflect.decorate(
                [
                    Type => {
                        calls.push("first");
                        assert.equal(Type, Replacement);
                        return null;
                    },
                    Type => {
                        calls.push("second");
                        assert.equal(Type, Initial);
                        return Replacement;
                    },
                ],
                Initial,
            ),
            Replacement,
        );
        assert.deepEqual(calls, ["second", "first"]);
        const target = {};
        const original = { configurable: true };
        const replacement = { value: 42 };
        assert.equal(
            Reflect.decorate(
                [
                    (object, key, descriptor) => {
                        assert.equal(object, target);
                        assert.equal(key, "1");
                        assert.equal(descriptor, replacement);
                    },
                    (object, key, descriptor) => {
                        assert.equal(descriptor, original);
                        return replacement;
                    },
                ],
                target,
                1,
                original,
            ),
            replacement,
        );
        assert.equal(Reflect.decorate([], target, "value", null), undefined);
        assert.equal(Reflect.decorate([], Initial), Initial);
        for (const decorators of [undefined, null, {}, new Set()]) {
            assert.throws(() => Reflect.decorate(decorators, Initial), TypeError);
        }
        assert.throws(() => Reflect.decorate([undefined], Initial), TypeError);
        assert.throws(() => Reflect.decorate([() => ({})], Initial), TypeError);
        assert.throws(() => Reflect.decorate([], {}), TypeError);
        assert.throws(() => Reflect.decorate([], null, "value"), TypeError);
        assert.throws(() => Reflect.decorate([], target, "value", 1), TypeError);
        assert.throws(() => Reflect.decorate([() => 1], target, "value"), TypeError);
        const failure = new Error("decorator failed");
        assert.throws(
            () =>
                Reflect.decorate(
                    [
                        () => {
                            throw failure;
                        },
                    ],
                    Initial,
                ),
            value => value === failure,
        );
    });
});

const compiledFixture = ts.transpileModule(
    `
        class Dependency {}
        function decorated(Type: Function) {}
        @decorated
        class Consumer {
            constructor(public dependency: Dependency) {}
        }
        class Undecorated {
            constructor(public dependency: Dependency) {}
        }
        return { Dependency, Consumer, Undecorated };
    `,
    {
        compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.None,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
        },
    },
).outputText;

for (const entrypoint of ["context.js", "di.js"]) {
    test(`${entrypoint} automatically supports compiler-emitted design:paramtypes`, () => {
        runIsolated(
            async ({ entrypoint, compiledFixture, metadataUrl }) => {
                assert.equal(Reflect.metadata, undefined);
                const api = await import(entrypoint);
                assertCompleteMetadata();
                const { Metadata } = await import(metadataUrl);
                const { Dependency, Consumer, Undecorated } = runInThisContext(
                    `(function () { ${compiledFixture} })()`,
                );
                assert.deepEqual(Metadata.getDesignParamTypes(Consumer), [Dependency]);
                assert.deepEqual(Metadata.getDesignParamTypes(Undecorated), []);
                if (api.DI) {
                    assert.deepEqual(api.DI.getDependencies(Consumer), [Dependency]);
                    assert.ok(
                        api.DI.createContainer().get(Consumer).dependency instanceof
                            Dependency,
                    );
                } else {
                    const context = api.Context.create("shared");
                    context(Consumer, undefined, 0);
                    assert.deepEqual(Metadata.getAnnotationParamTypes(Consumer), [
                        context,
                    ]);
                    assert.deepEqual(Metadata.getDesignParamTypes(Consumer), [
                        Dependency,
                    ]);
                }
            },
            {
                entrypoint: import.meta.resolve(`@microsoft/fast-element/${entrypoint}`),
                compiledFixture,
            },
        );
    });
}

async function bundle(contents) {
    return build({
        stdin: { contents, resolveDir: packageRoot, sourcefile: "metadata-consumer.js" },
        bundle: true,
        format: "esm",
        platform: "browser",
        metafile: true,
        write: false,
        logLevel: "silent",
    });
}

const isMetadata = path =>
    /(?:^|\/)(?:metadata|metadata-reflection)\.js$|(?:^|\/)reflect-metadata\//.test(
        path.replaceAll("\\", "/"),
    );

for (const entrypoint of [
    "@microsoft/fast-element",
    "@microsoft/fast-element/fast-element.js",
    "@microsoft/fast-element/declarative.js",
]) {
    test(`${entrypoint} has no metadata implementation in its module graph`, async () => {
        const { metafile } = await bundle(`export * from "${entrypoint}";`);
        assert.deepEqual(Object.keys(metafile.inputs).filter(isMetadata), []);
    });
}

test("unused Context and DI imports add no metadata implementation to the bundle", async () => {
    const { metafile } = await bundle(`
        import { Context } from "@microsoft/fast-element/context.js";
        import { DI } from "@microsoft/fast-element/di.js";
        export const value = 1;
    `);
    for (const output of Object.values(metafile.outputs)) {
        const retained = Object.entries(output.inputs)
            .filter(([, input]) => input.bytesInOutput > 0)
            .map(([path]) => path);
        assert.deepEqual(retained.filter(isMetadata), []);
    }
});

for (const symbols of [["Context"], ["DI"], ["Context", "DI"]]) {
    test(`bundled ${symbols.join(" and ")} retains one FAST-owned implementation and complete metadata support`, async () => {
        const { metafile, outputFiles } = await bundle(
            symbols
                .map(
                    symbol =>
                        `export { ${symbol} } from "@microsoft/fast-element/${symbol === "Context" ? "context" : "di"}.js";`,
                )
                .join("\n"),
        );
        const retained = Object.values(metafile.outputs).flatMap(output =>
            Object.entries(output.inputs)
                .filter(([, input]) => input.bytesInOutput > 0)
                .map(([path]) => path.replaceAll("\\", "/")),
        );
        assert.ok(retained.some(path => path.endsWith("/metadata.js")));
        assert.equal(
            retained.filter(path => path.endsWith("/metadata-reflection.js")).length,
            1,
            "used Context/DI must retain exactly one FAST-owned metadata implementation",
        );
        assert.equal(
            retained.some(path => path.includes("/reflect-metadata/")),
            false,
        );
        runIsolated(
            async ({ code, symbols }) => {
                assert.equal(Reflect.metadata, undefined);
                const api = await import(
                    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
                );
                for (const symbol of symbols) {
                    assert.equal(typeof api[symbol], "object");
                }
                assertCompleteMetadata();
                class Target {}
                Reflect.defineMetadata("shared", true, Target, "value");
                assert.deepEqual(Reflect.getOwnMetadataKeys(Target, "value"), ["shared"]);
                assert.equal(Reflect.deleteMetadata("shared", Target, "value"), true);
                if (api.Context && api.DI) {
                    const context = api.Context.create("shared");
                    context(Target, undefined, 0);
                    assert.deepEqual(
                        Reflect.getOwnMetadata("annotation:paramtypes", Target),
                        [context],
                    );
                    assert.deepEqual(api.DI.getDependencies(Target), [context]);
                }
            },
            { code: outputFiles[0].text, symbols },
        );
    });
}
