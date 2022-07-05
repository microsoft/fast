import { expect } from "chai";
import {
    all,
    DI,
    Container,
    inject,
    lazy,
    optional,
    Registration,
    singleton,
} from "./di.js";

describe("DI.get", function () {
    let container: Container;

    // eslint-disable-next-line mocha/no-hooks
    beforeEach(function () {
        container = DI.createContainer();
    });

    describe("@lazy", function () {
        class Bar {}
        class Foo {
            public constructor(@lazy(Bar) public readonly provider: () => Bar) {}
        }
        it("@singleton", function () {
            const bar0 = container.get(Foo).provider();
            const bar1 = container.get(Foo).provider();

            expect(bar0).to.equal(bar1);
        });

        it("@transient", function () {
            container.register(Registration.transient(Bar, Bar));
            const bar0 = container.get(Foo).provider();
            const bar1 = container.get(Foo).provider();

            expect(bar0).to.not.equal(bar1);
        });
    });

    describe("@scoped", function () {
        describe("true", function () {
            @singleton({ scoped: true })
            class ScopedFoo {}

            describe("Foo", function () {
                const constructor = ScopedFoo;
                it("children", function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = child1.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);

                    expect(a).to.equal(c, "a and c are the same");
                    expect(a).to.not.equal(b, "a and b are not the same");
                    expect(root.has(constructor, false)).to.equal(
                        false,
                        "root has class"
                    );
                    expect(child1.has(constructor, false)).to.equal(
                        true,
                        "child1 has class"
                    );
                    expect(child2.has(constructor, false)).to.equal(
                        true,
                        "child2 has class"
                    );
                });

                it("root", function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = root.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);

                    expect(a).to.equal(c, "a and c are the same");
                    expect(a).to.equal(b, "a and b are the same");
                    expect(root.has(constructor, false)).to.equal(true, "root has class");
                    expect(child1.has(constructor, false)).to.equal(
                        false,
                        "child1 does not have class"
                    );
                    expect(child2.has(constructor, false)).to.equal(
                        false,
                        "child2 does not have class"
                    );
                });
            });
        });

        describe("false", function () {
            @singleton({ scoped: false })
            class ScopedFoo {}

            describe("Foo", function () {
                const constructor = ScopedFoo;
                it("children", function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = child1.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);

                    expect(a).to.equal(c, "a and c are the same");
                    expect(a).to.equal(b, "a and b are the same");
                    expect(root.has(constructor, false)).to.equal(true, "root has class");
                    expect(child1.has(constructor, false)).to.equal(
                        false,
                        "child1 has class"
                    );
                    expect(child2.has(constructor, false)).to.equal(
                        false,
                        "child2 has class"
                    );
                });
            });

            describe("default", function () {
                @singleton
                class DefaultFoo {}

                const constructor = DefaultFoo;
                it("children", function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();

                    const a = child1.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);

                    expect(a).to.equal(c, "a and c are the same");
                    expect(a).to.equal(b, "a and b are the same");
                    expect(root.has(constructor, false)).to.equal(true, "root has class");
                    expect(child1.has(constructor, false)).to.equal(
                        false,
                        "child1 has class"
                    );
                    expect(child2.has(constructor, false)).to.equal(
                        false,
                        "child2 has class"
                    );
                });
            });
        });
    });

    describe("@optional", function () {
        it("with default", function () {
            class Foo {
                public constructor(
                    @optional("key") public readonly test: string = "hello"
                ) {}
            }

            expect(container.get(Foo).test).to.equal("hello");
        });

        it("no default, but param allows undefined", function () {
            class Foo {
                public constructor(@optional("key") public readonly test?: string) {}
            }

            expect(container.get(Foo).test).to.equal(undefined);
        });

        it("no default, param does not allow undefind", function () {
            class Foo {
                public constructor(@optional("key") public readonly test: string) {}
            }

            expect(container.get(Foo).test).to.equal(undefined);
        });

        it("interface with default", function () {
            const Strings = DI.createContext<string[]>(x => x.instance([]));
            class Foo {
                public constructor(@optional(Strings) public readonly test: string[]) {}
            }

            expect(container.get(Foo).test).to.equal(undefined);
        });

        it("interface with default and default in constructor", function () {
            const MyStr = DI.createContext<string>(x => x.instance("hello"));
            class Foo {
                public constructor(
                    @optional(MyStr) public readonly test: string = "test"
                ) {}
            }

            expect(container.get(Foo).test).to.equal("test");
        });

        it("interface with default registered and default in constructor", function () {
            const MyStr = DI.createContext<string>(x => x.instance("hello"));
            container.register(MyStr);
            class Foo {
                public constructor(
                    @optional(MyStr) public readonly test: string = "test"
                ) {}
            }

            expect(container.get(Foo).test).to.equal("hello");
        });
    });

    describe("intrinsic", function () {
        describe("bad", function () {
            it("Array", function () {
                @singleton
                class Foo {
                    public constructor(@inject(Array) private readonly test: string[]) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("ArrayBuffer", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(ArrayBuffer) private readonly test: ArrayBuffer
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Boolean", function () {
                @singleton
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(@inject(Boolean) private readonly test: Boolean) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("DataView", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(DataView) private readonly test: DataView
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Date", function () {
                @singleton
                class Foo {
                    public constructor(@inject(Date) private readonly test: Date) {}
                }
                expect(() => container.get(Foo)).throws();
            });
            it("Error", function () {
                @singleton
                class Foo {
                    public constructor(@inject(Error) private readonly test: Error) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("EvalError", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(EvalError) private readonly test: EvalError
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Float32Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Float32Array) private readonly test: Float32Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Float64Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Float64Array) private readonly test: Float64Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Function", function () {
                @singleton
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(
                        @inject(Function) private readonly test: Function
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Int8Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Int8Array) private readonly test: Int8Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Int16Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Int16Array) private readonly test: Int16Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Int32Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Int32Array) private readonly test: Int16Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Map", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Map) private readonly test: Map<unknown, unknown>
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Number", function () {
                @singleton
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(@inject(Number) private readonly test: Number) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Object", function () {
                @singleton
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(@inject(Object) private readonly test: Object) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Promise", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Promise) private readonly test: Promise<unknown>
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("RangeError", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(RangeError) private readonly test: RangeError
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("ReferenceError", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(ReferenceError) private readonly test: ReferenceError
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("RegExp", function () {
                @singleton
                class Foo {
                    public constructor(@inject(RegExp) private readonly test: RegExp) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Set", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Set) private readonly test: Set<unknown>
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            // if (typeof SharedArrayBuffer !== 'undefined') {
            //   it('SharedArrayBuffer', function () {
            //     @singleton
            //     class Foo {
            //       public constructor(private readonly test: SharedArrayBuffer) {
            //       }
            //     }
            //     assert.throws(() => container.get(Foo));
            //   });
            // }

            it("String", function () {
                @singleton
                class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    public constructor(@inject(String) private readonly test: String) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("SyntaxError", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(SyntaxError) private readonly test: SyntaxError
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("TypeError", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(TypeError) private readonly test: TypeError
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Uint8Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Uint8Array) private readonly test: Uint8Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Uint8ClampedArray", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Uint8ClampedArray)
                        private readonly test: Uint8ClampedArray
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("Uint16Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Uint16Array) private readonly test: Uint16Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });
            it("Uint32Array", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(Uint32Array) private readonly test: Uint32Array
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });
            it("UriError", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(URIError) private readonly test: URIError
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("WeakMap", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(WeakMap) private readonly test: WeakMap<any, unknown>
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });

            it("WeakSet", function () {
                @singleton
                class Foo {
                    public constructor(
                        @inject(WeakSet) private readonly test: WeakSet<any>
                    ) {}
                }
                expect(() => container.get(Foo)).throws();
            });
        });

        describe("good", function () {
            it("@all()", function () {
                class Foo {
                    public constructor(@all("test") public readonly test: string[]) {}
                }
                expect(container.get(Foo).test).to.eql([]);
            });
            it("@optional()", function () {
                class Foo {
                    public constructor(
                        @optional("test") public readonly test: string | null = null
                    ) {}
                }
                expect(container.get(Foo).test).to.equal(null);
            });

            it("undef instance, with constructor default", function () {
                container.register(Registration.instance("test", undefined));
                class Foo {
                    public constructor(
                        @inject("test") public readonly test: string[] = []
                    ) {}
                }
                expect(container.get(Foo).test).to.eql([]);
            });

            it("can inject if registered", function () {
                container.register(Registration.instance(String, "test"));
                @singleton
                class Foo {
                    public constructor(@inject(String) public readonly test: string) {}
                }
                expect(container.get(Foo).test).to.equal("test");
            });
        });
    });
});
