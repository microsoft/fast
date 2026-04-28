import { expect } from "chai";
import { Metadata } from "./metadata.js";
import { emptyArray } from "./platform.js";

function decorator(): ClassDecorator { return (target: any) => target; }

describe("Metadata", () => {
    describe(`getDesignParamTypes()`, () => {
        it(`returns emptyArray if the class has no constructor or decorators`, () => {
            class Foo {}

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).equal(emptyArray);
        });

        it(`returns emptyArray if the class has a decorator but no constructor`, () => {
            @decorator()
            class Foo {}

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).equal(emptyArray);
        });

        it(`returns emptyArray if the class has no constructor args or decorators`, () => {
            class Foo { constructor() { return; } }

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).equal(emptyArray);
        });

        it(`returns emptyArray if the class has constructor args but no decorators`, () => {
            class Bar {}
            class Foo { constructor(public bar: Bar) {} }

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).equal(emptyArray);
        });

        it(`returns emptyArray if the class has constructor args and the decorator is applied via a function call`, () => {
            class Bar {}
            class Foo { constructor(public bar: Bar) {} }

            decorator()(Foo);
            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).equal(emptyArray);
        });

        it(`returns an empty mutable array if the class has a decorator but no constructor args`, () => {
            @decorator()
            class Foo { constructor() { return; } }

            const actual = Metadata.getDesignParamTypes(Foo);

            expect(actual).not.equal(emptyArray);
            expect(actual).length(0);
        });

        describe(`falls back to Object for declarations that cannot be statically analyzed`, () => {
            interface ArgCtor {}

            for (const argCtor of [
                class Bar {},
                function () { return; },
                () => { return; },
                class {},
                {},
                Error,
                Array,
                (class Bar {}).prototype,
                (class Bar {}).prototype.constructor
            ] as any[]) {
                @decorator()
                class FooDecoratorInvocation { constructor(public arg: ArgCtor) {} }

                it(`FooDecoratorInvocation { constructor(${argCtor.name}) }`, () => {
                    const actual = Metadata.getDesignParamTypes(FooDecoratorInvocation);
                    expect(actual).length(1);
                    expect(actual[0]).equal(Object);
                });

                @(decorator as any)
                class FooDecoratorNonInvocation { constructor(public arg: ArgCtor) {} }

                it(`FooDecoratorNonInvocation { constructor(${argCtor.name}) }`, () => {
                    const actual = Metadata.getDesignParamTypes(FooDecoratorInvocation);
                    expect(actual).length(1);
                    expect(actual[0]).equal(Object);
                });
            }
        });

        describe(`returns the correct types for valid declarations`, () =>  {
            class Bar {}
            class Foo {}
            class Baz {}

            describe(`decorator invocation`, () =>  {
                it(`Class { constructor(public arg: Bar) }`, () =>  {
                    @decorator()
                    class FooBar { constructor(public arg: Bar) {} }

                    const actual = Metadata.getDesignParamTypes(FooBar);

                    expect(actual).length(1);
                    expect(actual[0]).equal(Bar);
                });

                it(`Class { constructor(public arg1: Bar, public arg2: Foo) }`, () =>  {
                    @decorator()
                    class FooBar { constructor(public arg1: Bar, public arg2: Foo) {} }

                    const actual = Metadata.getDesignParamTypes(FooBar);

                    expect(actual).length(2);
                    expect(actual[0]).equal(Bar);
                    expect(actual[1]).equal(Foo);
                });

                it(`Class { constructor(public arg1: Bar, public arg2: Foo, public arg3: Baz) }`, () => {
                    @decorator()
                    class FooBar { constructor(public arg1: Bar, public arg2: Foo, public arg3: Baz) {} }

                    const actual = Metadata.getDesignParamTypes(FooBar);

                    expect(actual).length(3);
                    expect(actual[0]).equal(Bar);
                    expect(actual[1]).equal(Foo);
                    expect(actual[2]).equal(Baz);
                });
            });
        });
    });

    describe(`getAnnotationParamTypes()`, () => {
        it("returns emptyArray if the class has no annotations", () => {
            class Foo {}

            const actual = Metadata.getAnnotationParamTypes(Foo);

            expect(actual).equal(emptyArray);
        });

        it("returns added annotations", () => {
            class Foo {}

            const a = Metadata.getOrCreateAnnotationParamTypes(Foo);
            a.push("test");

            const actual = Metadata.getAnnotationParamTypes(Foo);

            expect(actual).length(1);
            expect(actual[0]).equal("test");
        });
    });

    describe(`getOrCreateAnnotationParamTypes()`, () => {
        it("returns an empty mutable array if the class has no annotations", () => {
            class Foo {}

            const actual = Metadata.getOrCreateAnnotationParamTypes(Foo);

            expect(actual).not.equal(emptyArray);
            expect(actual).length(0);
        });

        it("returns added annotations", () => {
            class Foo {}

            const a = Metadata.getOrCreateAnnotationParamTypes(Foo);
            a.push("test");

            const actual = Metadata.getOrCreateAnnotationParamTypes(Foo);

            expect(actual).length(1);
            expect(actual[0]).equal("test");
        });
    });
});
