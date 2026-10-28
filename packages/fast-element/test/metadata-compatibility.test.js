import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import ts from "typescript";

const require = createRequire(import.meta.url);
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
    const result = spawnSync(
        process.execPath,
        [
            "--input-type=module",
            "--eval",
            `
                import assert from "node:assert/strict";
                import { readFileSync } from "node:fs";
                import { runInThisContext } from "node:vm";
                const metadataMethods = ${JSON.stringify(metadataMethods)};
                const assertCompleteMetadata = ${assertCompleteMetadata};
                await (${exercise})(${JSON.stringify({ metadataUrl, ...options })});
            `,
        ],
        { cwd: packageRoot, encoding: "utf8", timeout: 30_000 },
    );

    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr || result.stdout);
}

for (const implementation of ["reflect-metadata", "reflect-metadata/lite"]) {
    for (const first of ["FAST", "reflect-metadata"]) {
        test(`${first} first interoperates with independent ${implementation} evaluations`, () => {
            runIsolated(
                async ({ metadataUrl, implementationPath, first }) => {
                    // Evaluate the installed source each time, not a cached module import.
                    const evaluate = () =>
                        runInThisContext(readFileSync(implementationPath, "utf8"), {
                            filename: implementationPath,
                        });
                    assert.equal(Reflect.metadata, undefined);
                    class Existing {}
                    const existingClassValue = {};
                    const existingPropertyValue = {};
                    if (first === "reflect-metadata") {
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
                    if (first === "reflect-metadata") {
                        assert.equal(
                            Reflect.getOwnMetadata("class", Existing),
                            existingClassValue,
                        );
                        assert.equal(
                            Reflect.getOwnMetadata(
                                "property",
                                Existing.prototype,
                                "value",
                            ),
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
                    Reflect.metadata("symbol", propertyValue)(
                        Base.prototype,
                        symbolProperty,
                    );
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
                            Reflect.getOwnMetadata(
                                "property",
                                Derived.prototype,
                                "value",
                            ),
                            undefined,
                        );
                        assert.equal(
                            Reflect.getOwnMetadata("property", Base.prototype),
                            undefined,
                        );
                        assert.equal(
                            Reflect.getMetadata(
                                "symbol",
                                Derived.prototype,
                                symbolProperty,
                            ),
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
                        assert.deepEqual(Metadata.getDesignParamTypes(Base), [
                            Dependency,
                        ]);
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
                { implementationPath: require.resolve(implementation), first },
            );
        });
    }
}

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
    /(?:^|\/)metadata\.js$|(?:^|\/)reflect-metadata\//.test(path.replaceAll("\\", "/"));

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
    test(`bundled ${symbols.join(" and ")} retains one lite implementation and complete metadata support`, async () => {
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
            retained.filter(path => path.endsWith("/reflect-metadata/ReflectLite.js"))
                .length,
            1,
            "used Context/DI must retain exactly one reflect-metadata/lite input",
        );
        assert.equal(
            retained.some(path => path.endsWith("/reflect-metadata/Reflect.js")),
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
