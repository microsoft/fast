var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __param =
    (this && this.__param) ||
    function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
import { expect } from "chai";
import { all, DI, inject, lazy, optional, Registration, singleton } from "./di";
describe("DI.get", function () {
    let container;
    // eslint-disable-next-line mocha/no-hooks
    beforeEach(function () {
        container = DI.createContainer();
    });
    describe("@lazy", function () {
        class Bar {}
        let Foo = class Foo {
            constructor(provider) {
                this.provider = provider;
            }
        };
        Foo = __decorate([__param(0, lazy(Bar))], Foo);
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
            let ScopedFoo = class ScopedFoo {};
            ScopedFoo = __decorate([singleton({ scoped: true })], ScopedFoo);
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
            let ScopedFoo = class ScopedFoo {};
            ScopedFoo = __decorate([singleton({ scoped: false })], ScopedFoo);
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
                let DefaultFoo = class DefaultFoo {};
                DefaultFoo = __decorate([singleton], DefaultFoo);
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
            let Foo = class Foo {
                constructor(test = "hello") {
                    this.test = test;
                }
            };
            Foo = __decorate([__param(0, optional("key"))], Foo);
            expect(container.get(Foo).test).to.equal("hello");
        });
        it("no default, but param allows undefined", function () {
            let Foo = class Foo {
                constructor(test) {
                    this.test = test;
                }
            };
            Foo = __decorate([__param(0, optional("key"))], Foo);
            expect(container.get(Foo).test).to.equal(undefined);
        });
        it("no default, param does not allow undefind", function () {
            let Foo = class Foo {
                constructor(test) {
                    this.test = test;
                }
            };
            Foo = __decorate([__param(0, optional("key"))], Foo);
            expect(container.get(Foo).test).to.equal(undefined);
        });
        it("interface with default", function () {
            const Strings = DI.createInterface(x => x.instance([]));
            let Foo = class Foo {
                constructor(test) {
                    this.test = test;
                }
            };
            Foo = __decorate([__param(0, optional(Strings))], Foo);
            expect(container.get(Foo).test).to.equal(undefined);
        });
        it("interface with default and default in constructor", function () {
            const MyStr = DI.createInterface(x => x.instance("hello"));
            let Foo = class Foo {
                constructor(test = "test") {
                    this.test = test;
                }
            };
            Foo = __decorate([__param(0, optional(MyStr))], Foo);
            expect(container.get(Foo).test).to.equal("test");
        });
        it("interface with default registered and default in constructor", function () {
            const MyStr = DI.createInterface(x => x.instance("hello"));
            container.register(MyStr);
            let Foo = class Foo {
                constructor(test = "test") {
                    this.test = test;
                }
            };
            Foo = __decorate([__param(0, optional(MyStr))], Foo);
            expect(container.get(Foo).test).to.equal("hello");
        });
    });
    describe("intrinsic", function () {
        describe("bad", function () {
            it("Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("ArrayBuffer", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(ArrayBuffer))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Boolean", function () {
                let Foo = class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Boolean))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("DataView", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(DataView))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Date", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Date))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Error", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Error))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("EvalError", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(EvalError))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Float32Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Float32Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Float64Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Float64Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Function", function () {
                let Foo = class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Function))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Int8Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Int8Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Int16Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Int16Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Int32Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Int32Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Map", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Map))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Number", function () {
                let Foo = class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Number))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Object", function () {
                let Foo = class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Object))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Promise", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Promise))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("RangeError", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(RangeError))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("ReferenceError", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(ReferenceError))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("RegExp", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(RegExp))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Set", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Set))], Foo);
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
                let Foo = class Foo {
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(String))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("SyntaxError", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(SyntaxError))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("TypeError", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(TypeError))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Uint8Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Uint8Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Uint8ClampedArray", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Uint8ClampedArray))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Uint16Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Uint16Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("Uint32Array", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(Uint32Array))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("UriError", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(URIError))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("WeakMap", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(WeakMap))], Foo);
                expect(() => container.get(Foo)).throws();
            });
            it("WeakSet", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(WeakSet))], Foo);
                expect(() => container.get(Foo)).throws();
            });
        });
        describe("good", function () {
            it("@all()", function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([__param(0, all("test"))], Foo);
                expect(container.get(Foo).test).to.eql([]);
            });
            it("@optional()", function () {
                let Foo = class Foo {
                    constructor(test = null) {
                        this.test = test;
                    }
                };
                Foo = __decorate([__param(0, optional("test"))], Foo);
                expect(container.get(Foo).test).to.equal(null);
            });
            it("undef instance, with constructor default", function () {
                container.register(Registration.instance("test", undefined));
                let Foo = class Foo {
                    constructor(test = []) {
                        this.test = test;
                    }
                };
                Foo = __decorate([__param(0, inject("test"))], Foo);
                expect(container.get(Foo).test).to.eql([]);
            });
            it("can inject if registered", function () {
                container.register(Registration.instance(String, "test"));
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([singleton, __param(0, inject(String))], Foo);
                expect(container.get(Foo).test).to.equal("test");
            });
        });
    });
});
