import { expect } from "chai";
import { DI, optional } from "./di.js";

describe("DI Exception", function () {
    it("No registration for interface", function () {
        const container = DI.createContainer();

        interface Foo {}

        const Foo = DI.createContext<Foo>("Foo");

        class Bar {
            public constructor(@Foo public readonly foo: Foo) {}
        }

        expect(() => container.get(Foo)).to.throw(/.*Foo*/, "throws once");
        expect(() => container.get(Foo)).to.throw(/.*Foo*/, "throws twice"); // regression test
        expect(() => container.get(Bar)).to.throw(/.*Foo.*/, "throws on inject into");
    });

    it("cyclic dependency", function () {
        const container = DI.createContainer();
        interface Foo {
            parent: Foo | null;
        }

        const Foo = DI.createContext<Foo>("IFoo", x => x.singleton(FooImpl));

        class FooImpl {
            public constructor(@optional(Foo) public parent: Foo) {}
        }

        expect(() => container.get(Foo)).to.throw(/.*Cycl*/, "test");
    });
});
