import { expect, test } from "@playwright/test";
import { all, DI, inject, lazy, optional, Registration, singleton } from "./di.js";

test.describe("DI.get", () => {
    test.describe("@lazy", () => {
        test("@singleton", async () => {
            class Bar {}
            class Foo {
                public constructor(public readonly provider: () => Bar) {}
            }
            lazy(Bar)(Foo, undefined, 0);

            const container = DI.createContainer();
            const bar0 = container.get(Foo).provider();
            const bar1 = container.get(Foo).provider();

            expect(bar0 === bar1).toBe(true);
        });

        test("@transient", async () => {
            class Bar {}
            class Foo {
                public constructor(public readonly provider: () => Bar) {}
            }
            lazy(Bar)(Foo, undefined, 0);

            const container = DI.createContainer();
            container.register(Registration.transient(Bar, Bar));
            const bar0 = container.get(Foo).provider();
            const bar1 = container.get(Foo).provider();

            expect(bar0 !== bar1).toBe(true);
        });
    });

    test.describe("@scoped", () => {
        test.describe("true", () => {
            test.describe("Foo", () => {
                test("children", async () => {
                    class ScopedFoo {}
                    singleton({ scoped: true })(ScopedFoo);

                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = child1.get(ScopedFoo);
                    const b = child2.get(ScopedFoo);
                    const c = child1.get(ScopedFoo);

                    expect(a === c).toBe(true);
                    expect(a !== b).toBe(true);
                    expect(root.has(ScopedFoo, false)).toBe(false);
                    expect(child1.has(ScopedFoo, false)).toBe(true);
                    expect(child2.has(ScopedFoo, false)).toBe(true);
                });

                test("root", async () => {
                    class ScopedFoo {}
                    singleton({ scoped: true })(ScopedFoo);

                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = root.get(ScopedFoo);
                    const b = child2.get(ScopedFoo);
                    const c = child1.get(ScopedFoo);

                    expect(a === c).toBe(true);
                    expect(a === b).toBe(true);
                    expect(root.has(ScopedFoo, false)).toBe(true);
                    expect(child1.has(ScopedFoo, false)).toBe(false);
                    expect(child2.has(ScopedFoo, false)).toBe(false);
                });
            });
        });

        test.describe("false", () => {
            test.describe("Foo", () => {
                test("children", async () => {
                    class ScopedFoo {}
                    singleton({ scoped: false })(ScopedFoo);

                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = child1.get(ScopedFoo);
                    const b = child2.get(ScopedFoo);
                    const c = child1.get(ScopedFoo);

                    expect(a === c).toBe(true);
                    expect(a === b).toBe(true);
                    expect(root.has(ScopedFoo, false)).toBe(true);
                    expect(child1.has(ScopedFoo, false)).toBe(false);
                    expect(child2.has(ScopedFoo, false)).toBe(false);
                });
            });

            test.describe("default", () => {
                test("children", async () => {
                    class DefaultFoo {}
                    singleton(DefaultFoo);

                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = child1.get(DefaultFoo);
                    const b = child2.get(DefaultFoo);
                    const c = child1.get(DefaultFoo);

                    expect(a === c).toBe(true);
                    expect(a === b).toBe(true);
                    expect(root.has(DefaultFoo, false)).toBe(true);
                    expect(child1.has(DefaultFoo, false)).toBe(false);
                    expect(child2.has(DefaultFoo, false)).toBe(false);
                });
            });
        });
    });

    test.describe("@optional", () => {
        test("with default", async () => {
            class Foo {
                public constructor(public readonly test: string = "hello") {}
            }
            optional("key")(Foo, undefined, 0);

            const container = DI.createContainer();
            expect(container.get(Foo).test).toBe("hello");
        });

        test("no default, but param allows undefined", async () => {
            class Foo {
                public constructor(public readonly test?: string) {}
            }
            optional("key")(Foo, undefined, 0);

            const container = DI.createContainer();
            expect(container.get(Foo).test).toBe(undefined);
        });

        test("no default, param does not allow undefind", async () => {
            class Foo {
                public constructor(public readonly test: string) {}
            }
            optional("key")(Foo, undefined, 0);

            const container = DI.createContainer();
            expect(container.get(Foo).test).toBe(undefined);
        });

        test("interface with default", async () => {
            const Strings = DI.createContext<string[]>(x => x.instance([]));
            class Foo {
                public constructor(public readonly test: string[]) {}
            }
            optional(Strings)(Foo, undefined, 0);

            const container = DI.createContainer();
            expect(container.get(Foo).test).toBe(undefined);
        });

        test("interface with default and default in constructor", async () => {
            const MyStr = DI.createContext<string>(x => x.instance("hello"));
            class Foo {
                public constructor(public readonly test: string = "test") {}
            }
            optional(MyStr)(Foo, undefined, 0);

            const container = DI.createContainer();
            expect(container.get(Foo).test).toBe("test");
        });

        test("interface with default registered and default in constructor", async () => {
            const MyStr = DI.createContext<string>(x => x.instance("hello"));
            const container = DI.createContainer();
            container.register(MyStr);
            class Foo {
                public constructor(public readonly test: string = "test") {}
            }
            optional(MyStr)(Foo, undefined, 0);

            expect(container.get(Foo).test).toBe("hello");
        });
    });

    test.describe("intrinsic", () => {
        test.describe("bad", () => {
            test("Array", async () => {
                class Foo {
                    public constructor(private readonly test: string[]) {}
                }
                inject(Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("ArrayBuffer", async () => {
                class Foo {
                    public constructor(private readonly test: ArrayBuffer) {}
                }
                inject(ArrayBuffer)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Boolean", async () => {
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(private readonly test: Boolean) {}
                }
                inject(Boolean)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("DataView", async () => {
                class Foo {
                    public constructor(private readonly test: DataView) {}
                }
                inject(DataView)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Date", async () => {
                class Foo {
                    public constructor(private readonly test: Date) {}
                }
                inject(Date)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Error", async () => {
                class Foo {
                    public constructor(private readonly test: Error) {}
                }
                inject(Error)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("EvalError", async () => {
                class Foo {
                    public constructor(private readonly test: EvalError) {}
                }
                inject(EvalError)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Float32Array", async () => {
                class Foo {
                    public constructor(private readonly test: Float32Array) {}
                }
                inject(Float32Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Float64Array", async () => {
                class Foo {
                    public constructor(private readonly test: Float64Array) {}
                }
                inject(Float64Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Function", async () => {
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(private readonly test: Function) {}
                }
                inject(Function)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Int8Array", async () => {
                class Foo {
                    public constructor(private readonly test: Int8Array) {}
                }
                inject(Int8Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Int16Array", async () => {
                class Foo {
                    public constructor(private readonly test: Int16Array) {}
                }
                inject(Int16Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Int32Array", async () => {
                class Foo {
                    public constructor(private readonly test: Int16Array) {}
                }
                inject(Int32Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Map", async () => {
                class Foo {
                    public constructor(private readonly test: Map<unknown, unknown>) {}
                }
                inject(Map)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Number", async () => {
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(private readonly test: Number) {}
                }
                inject(Number)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Object", async () => {
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(private readonly test: Object) {}
                }
                inject(Object)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Promise", async () => {
                class Foo {
                    public constructor(private readonly test: Promise<unknown>) {}
                }
                inject(Promise)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("RangeError", async () => {
                class Foo {
                    public constructor(private readonly test: RangeError) {}
                }
                inject(RangeError)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("ReferenceError", async () => {
                class Foo {
                    public constructor(private readonly test: ReferenceError) {}
                }
                inject(ReferenceError)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("RegExp", async () => {
                class Foo {
                    public constructor(private readonly test: RegExp) {}
                }
                inject(RegExp)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Set", async () => {
                class Foo {
                    public constructor(private readonly test: Set<unknown>) {}
                }
                inject(Set)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("String", async () => {
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(private readonly test: String) {}
                }
                inject(String)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("SyntaxError", async () => {
                class Foo {
                    public constructor(private readonly test: SyntaxError) {}
                }
                inject(SyntaxError)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("TypeError", async () => {
                class Foo {
                    public constructor(private readonly test: TypeError) {}
                }
                inject(TypeError)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Uint8Array", async () => {
                class Foo {
                    public constructor(private readonly test: Uint8Array) {}
                }
                inject(Uint8Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Uint8ClampedArray", async () => {
                class Foo {
                    public constructor(private readonly test: Uint8ClampedArray) {}
                }
                inject(Uint8ClampedArray)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Uint16Array", async () => {
                class Foo {
                    public constructor(private readonly test: Uint16Array) {}
                }
                inject(Uint16Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("Uint32Array", async () => {
                class Foo {
                    public constructor(private readonly test: Uint32Array) {}
                }
                inject(Uint32Array)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("UriError", async () => {
                class Foo {
                    public constructor(private readonly test: URIError) {}
                }
                inject(URIError)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("WeakMap", async () => {
                class Foo {
                    public constructor(private readonly test: WeakMap<any, unknown>) {}
                }
                inject(WeakMap)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });

            test("WeakSet", async () => {
                class Foo {
                    public constructor(private readonly test: WeakSet<any>) {}
                }
                inject(WeakSet)(Foo, undefined, 0);
                singleton(Foo);

                const container = DI.createContainer();
                let didThrow = false;
                try {
                    container.get(Foo);
                } catch {
                    didThrow = true;
                }

                expect(didThrow).toBe(true);
            });
        });

        test.describe("good", () => {
            test("@all()", async () => {
                class Foo {
                    public constructor(public readonly test: string[]) {}
                }
                all("test")(Foo, undefined, 0);

                const container = DI.createContainer();
                const testValue = container.get(Foo).test;

                expect(testValue).toEqual([]);
            });

            test("@optional()", async () => {
                class Foo {
                    public constructor(public readonly test: string | null = null) {}
                }
                optional("test")(Foo, undefined, 0);

                const container = DI.createContainer();
                const testValue = container.get(Foo).test;

                expect(testValue).toBe(null);
            });

            test("undef instance, with constructor default", async () => {
                const container = DI.createContainer();
                container.register(Registration.instance("test", undefined));
                class Foo {
                    public constructor(public readonly test: string[] = []) {}
                }
                inject("test")(Foo, undefined, 0);

                const testValue = container.get(Foo).test;

                expect(testValue).toEqual([]);
            });

            test("can inject if registered", async () => {
                const container = DI.createContainer();
                container.register(Registration.instance(String, "test"));
                class Foo {
                    public constructor(public readonly test: string) {}
                }
                inject(String)(Foo, undefined, 0);
                singleton(Foo);

                const testValue = container.get(Foo).test;

                expect(testValue).toBe("test");
            });
        });
    });
});

test.describe("DI.getAsync", () => {
    test("calls the registration locator for unknown keys", async () => {
        const key = "key";
        const instance = {};

        const asyncRegistrationLocator = async (key: any) => {
            return Registration.instance(key, instance);
        };

        const container = DI.createContainer({
            asyncRegistrationLocator,
        });

        const found = await container.getAsync(key);
        const foundIsInstance = found === instance;

        const foundAgain = container.get(key);
        const foundAgainIsInstance = foundAgain === instance;

        expect(foundIsInstance).toBe(true);
        expect(foundAgainIsInstance).toBe(true);
    });

    test("calls the registration locator for unknown dependencies", async () => {
        const key1 = "key";
        const instance1 = {};

        const key2 = "key2";
        const instance2 = {};

        const key3 = "key3";
        const instance3 = {};

        const asyncRegistrationLocator = async (key: any) => {
            switch (key) {
                case key1:
                    return Registration.instance(key1, instance1);
                case key2:
                    return Registration.instance(key2, instance2);
                case key3:
                    return Registration.instance(key3, instance3);
            }

            throw new Error();
        };

        const container = DI.createContainer({
            asyncRegistrationLocator,
        });

        class Test {
            constructor(public one: any, public two: any, public three: any) {}
        }
        inject(key1)(Test, undefined, 0);
        inject(key2)(Test, undefined, 1);
        inject(key3)(Test, undefined, 2);

        container.register(Registration.singleton(Test, Test));

        const found = await container.getAsync(Test);
        const oneMatch = found.one === instance1;
        const twoMatch = found.two === instance2;
        const threeMatch = found.three === instance3;

        const foundAgain = container.get(Test);
        const sameInstance = foundAgain === found;

        expect(oneMatch).toBe(true);
        expect(twoMatch).toBe(true);
        expect(threeMatch).toBe(true);
        expect(sameInstance).toBe(true);
    });

    test("calls the registration locator for a hierarchy of unknowns", async () => {
        const key1 = "key";
        const instance1 = {};

        const key2 = "key2";
        const instance2 = {};

        const key3 = "key3";
        const instance3 = {};

        class Test {
            constructor(public one: any, public two: any, public three: any) {}
        }
        inject(key1)(Test, undefined, 0);
        inject(key2)(Test, undefined, 1);
        inject(key3)(Test, undefined, 2);

        class Test2 {
            constructor(public test: Test) {}
        }
        inject(Test)(Test2, undefined, 0);

        const asyncRegistrationLocator = async (key: any) => {
            switch (key) {
                case key1:
                    return Registration.instance(key1, instance1);
                case key2:
                    return Registration.instance(key2, instance2);
                case key3:
                    return Registration.instance(key3, instance3);
                case Test:
                    return Registration.singleton(key, Test);
                case Test2:
                    return Registration.transient(key, Test2);
            }

            throw new Error();
        };

        const container = DI.createContainer({
            asyncRegistrationLocator,
        });

        const found = await container.getAsync(Test2);
        const oneMatch = found.test.one === instance1;
        const twoMatch = found.test.two === instance2;
        const threeMatch = found.test.three === instance3;

        const foundTest = container.get(Test);
        const testSame = foundTest === found.test;

        const foundTransient = container.get(Test2);
        const notSame = foundTransient !== found;
        const isTest2 = foundTransient instanceof Test2;
        const transientOneMatch = foundTransient.test.one === instance1;
        const transientTwoMatch = foundTransient.test.two === instance2;
        const transientThreeMatch = foundTransient.test.three === instance3;
        const transientTestSame = foundTransient.test === foundTest;

        expect(oneMatch).toBe(true);
        expect(twoMatch).toBe(true);
        expect(threeMatch).toBe(true);
        expect(testSame).toBe(true);
        expect(notSame).toBe(true);
        expect(isTest2).toBe(true);
        expect(transientOneMatch).toBe(true);
        expect(transientTwoMatch).toBe(true);
        expect(transientThreeMatch).toBe(true);
        expect(transientTestSame).toBe(true);
    });
});
