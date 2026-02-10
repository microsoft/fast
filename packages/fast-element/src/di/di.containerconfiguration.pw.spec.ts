import { expect, test } from "@playwright/test";
import { ContainerConfiguration, DefaultResolver, DI } from "./di.js";

test.describe("ContainerConfiguration", () => {
    test.describe("child", () => {
        test.describe("defaultResolver - transient", () => {
            test.describe("root container", () => {
                test("class", async () => {
                    const container0 = DI.createContainer({
                        ...ContainerConfiguration.default,
                        defaultResolver: DefaultResolver.transient,
                    });

                    const container1 = container0.createChild();
                    const container2 = container0.createChild();

                    class Foo {
                        public test(): string {
                            return "hello";
                        }
                    }

                    const foo1 = container1.get(Foo);
                    const foo2 = container2.get(Foo);

                    expect(foo1.test()).toBe("hello");
                    expect(foo2.test()).toBe("hello");
                    expect(container1.get(Foo) !== foo1).toBe(true);
                    expect(foo1 !== foo2).toBe(true);
                    expect(container0.has(Foo, true)).toBe(true);
                });
            });

            test.describe("one child container", () => {
                test("class", async () => {
                    const container0 = DI.createContainer();

                    const container1 = container0.createChild({
                        ...ContainerConfiguration.default,
                        defaultResolver: DefaultResolver.transient,
                    });
                    const container2 = container0.createChild();

                    class Foo {
                        public test(): string {
                            return "hello";
                        }
                    }

                    const foo1 = container1.get(Foo);
                    const foo2 = container2.get(Foo);

                    expect(foo2.test()).toBe("hello");
                    expect(foo1.test()).toBe("hello");
                    expect(container1.get(Foo) !== foo2).toBe(true);
                    expect(foo1 !== foo2).toBe(true);
                    expect(container0.has(Foo, true)).toBe(true);
                });
            });
        });
    });
});
