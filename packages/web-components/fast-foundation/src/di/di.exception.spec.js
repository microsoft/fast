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
import { DI, optional } from "./di";
describe("DI Exception", function () {
    it("No registration for interface", function () {
        const container = DI.createContainer();
        const Foo = DI.createInterface("Foo");
        let Bar = class Bar {
            constructor(foo) {
                this.foo = foo;
            }
        };
        Bar = __decorate([__param(0, Foo)], Bar);
        expect(() => container.get(Foo)).to.throw(/.*Foo*/, "throws once");
        expect(() => container.get(Foo)).to.throw(/.*Foo*/, "throws twice"); // regression test
        expect(() => container.get(Bar)).to.throw(/.*Foo.*/, "throws on inject into");
    });
    it("cyclic dependency", function () {
        const container = DI.createContainer();
        const Foo = DI.createInterface("IFoo", x => x.singleton(FooImpl));
        let FooImpl = class FooImpl {
            constructor(parent) {
                this.parent = parent;
            }
        };
        FooImpl = __decorate([__param(0, optional(Foo))], FooImpl);
        expect(() => container.get(Foo)).to.throw(/.*Cycl*/, "test");
    });
});
