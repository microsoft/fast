import { expect } from "chai";
import { ContainerConfiguration, DefaultResolver, DI, Container } from "./di.js";

describe("ContainerConfiguration", function () {
    let container0: Container;
    let container1: Container;
    let container2: Container;

    describe("child", function () {
        describe("defaultResolver - transient", function () {
            describe("root container", function () {
                // eslint-disable-next-line mocha/no-hooks
                beforeEach(function () {
                    container0 = DI.createContainer({
                        ...ContainerConfiguration.default,
                        defaultResolver: DefaultResolver.transient,
                    });

                    container1 = container0.createChild();
                    container2 = container0.createChild();
                });

                it("class", function () {
                    class Foo {
                        public test(): string {
                            return "hello";
                        }
                    }

                    const foo1 = container1.get(Foo);
                    const foo2 = container2.get(Foo);

                    expect(foo1.test()).to.equal("hello", "foo1");
                    expect(foo2.test()).to.equal("hello", "foo2");
                    expect(container1.get(Foo)).to.not.equal(
                        foo1,
                        "same child is different instance"
                    );
                    expect(foo1).to.not.equal(
                        foo2,
                        "different child is different instance"
                    );
                    expect(container0.has(Foo, true)).to.equal(
                        true,
                        "root should not have"
                    );
                });
            });

            describe("one child container", function () {
                // eslint-disable-next-line mocha/no-hooks
                beforeEach(function () {
                    container0 = DI.createContainer();

                    container1 = container0.createChild({
                        ...ContainerConfiguration.default,
                        defaultResolver: DefaultResolver.transient,
                    });
                    container2 = container0.createChild();
                });

                it("class", function () {
                    class Foo {
                        public test(): string {
                            return "hello";
                        }
                    }

                    const foo1 = container1.get(Foo);
                    const foo2 = container2.get(Foo);
                    expect(foo2.test()).to.equal("hello", "foo0");
                    expect(foo1.test()).to.equal("hello", "foo1");
                    expect(container1.get(Foo)).to.not.equal(
                        foo2,
                        "same child is same instance"
                    );
                    expect(foo1).to.not.equal(
                        foo2,
                        "different child is different instance"
                    );
                    expect(container0.has(Foo, true)).to.equal(true, "root should have");
                });
            });
        });
    });
});
