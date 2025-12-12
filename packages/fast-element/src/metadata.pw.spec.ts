import { expect, test } from "@playwright/test";
import { Metadata } from "./metadata.js";
import { emptyArray } from "./platform.js";

function decorator(): ClassDecorator {
    return (target: any) => target;
}

test.describe("Metadata", () => {
    test.describe(`getDesignParamTypes()`, () => {
        test(`returns emptyArray if the class has no constructor or decorators`, () => {
            class Foo {}

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).toBe(emptyArray);
        });

        test(`returns emptyArray if the class has a decorator but no constructor`, () => {
            class Foo {}
            decorator()(Foo);

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).toBe(emptyArray);
        });

        test(`returns emptyArray if the class has no constructor args or decorators`, () => {
            class Foo {
                constructor() {
                    return;
                }
            }

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).toBe(emptyArray);
        });

        test(`returns emptyArray if the class has constructor args but no decorators`, () => {
            class Bar {}
            class Foo {
                constructor(public bar: Bar) {}
            }

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).toBe(emptyArray);
        });

        test(`returns emptyArray if the class has constructor args and the decorator is applied via a function call`, () => {
            class Bar {}
            class Foo {
                constructor(public bar: Bar) {}
            }

            decorator()(Foo);
            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).toBe(emptyArray);
        });

        test(`returns an empty mutable array if the class has a decorator but no constructor args`, () => {
            test.fixme();

            class Foo {
                constructor() {
                    return;
                }
            }
            decorator()(Foo);

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).not.toBe(emptyArray);
            expect(actual).toHaveLength(0);
        });

        test.describe(`falls back to Object for declarations that cannot be statically analyzed`, () => {
            test.fixme();

            interface ArgCtor {}

            for (const argCtor of [
                class Bar {},
                function () {
                    return;
                },
                () => {
                    return;
                },
                class {},
                {},
                Error,
                Array,
                class Bar {}.prototype,
                class Bar {}.prototype.constructor,
            ] as any[]) {
                test.fixme();

                class FooDecoratorInvocation {
                    constructor(public arg: ArgCtor) {}
                }
                decorator()(FooDecoratorInvocation);

                test(`FooDecoratorInvocation { constructor(${argCtor.name}) }`, () => {
                    const actual = Metadata.getDesignParamTypes(FooDecoratorInvocation);
                    expect(actual).toHaveLength(1);
                    expect(actual[0]).toBe(Object);
                });

                class FooDecoratorNonInvocation {
                    constructor(public arg: ArgCtor) {}
                }
                decorator()(FooDecoratorNonInvocation);

                test(`FooDecoratorNonInvocation { constructor(${argCtor.name}) }`, () => {
                    const actual = Metadata.getDesignParamTypes(FooDecoratorInvocation);
                    expect(actual).toHaveLength(1);
                    expect(actual[0]).toBe(Object);
                });
            }
        });

        test.describe(`returns the correct types for valid declarations`, () => {
            test.fixme();

            class Bar {}
            class Foo {}
            class Baz {}

            test.describe(`decorator invocation`, () => {
                test(`Class { constructor(public arg: Bar) }`, () => {
                    class FooBar {
                        constructor(public arg: Bar) {}
                    }
                    decorator()(FooBar);

                    const actual = Metadata.getDesignParamTypes(FooBar);

                    expect(actual).toHaveLength(1);
                    expect(actual[0]).toBe(Bar);
                });

                test(`Class { constructor(public arg1: Bar, public arg2: Foo) }`, () => {
                    class FooBar {
                        constructor(public arg1: Bar, public arg2: Foo) {}
                    }
                    decorator()(FooBar);

                    const actual = Metadata.getDesignParamTypes(FooBar);

                    expect(actual).toHaveLength(2);
                    expect(actual[0]).toBe(Bar);
                    expect(actual[1]).toBe(Foo);
                });

                test(`Class { constructor(public arg1: Bar, public arg2: Foo, public arg3: Baz) }`, () => {
                    class FooBar {
                        constructor(
                            public arg1: Bar,
                            public arg2: Foo,
                            public arg3: Baz
                        ) {}
                    }
                    decorator()(FooBar);

                    const actual = Metadata.getDesignParamTypes(FooBar);

                    expect(actual).toHaveLength(3);
                    expect(actual[0]).toBe(Bar);
                    expect(actual[1]).toBe(Foo);
                    expect(actual[2]).toBe(Baz);
                });
            });
        });
    });

    test.describe(`getAnnotationParamTypes()`, () => {
        test("returns emptyArray if the class has no annotations", () => {
            class Foo {}

            const actual = Metadata.getAnnotationParamTypes(Foo);

            expect(actual).toBe(emptyArray);
        });

        test("returns added annotations", () => {
            class Foo {}

            const a = Metadata.getOrCreateAnnotationParamTypes(Foo);
            a.push("test");

            const actual = Metadata.getAnnotationParamTypes(Foo);

            expect(actual).toHaveLength(1);
            expect(actual[0]).toBe("test");
        });
    });

    test.describe(`getOrCreateAnnotationParamTypes()`, () => {
        test("returns an empty mutable array if the class has no annotations", () => {
            class Foo {}

            const actual = Metadata.getOrCreateAnnotationParamTypes(Foo);

            expect(actual).not.toBe(emptyArray);
            expect(actual).toHaveLength(0);
        });

        test("returns added annotations", () => {
            class Foo {}

            const a = Metadata.getOrCreateAnnotationParamTypes(Foo);
            a.push("test");

            const actual = Metadata.getOrCreateAnnotationParamTypes(Foo);

            expect(actual).toHaveLength(1);
            expect(actual[0]).toBe("test");
        });
    });
});
