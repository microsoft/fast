import { expect, test } from "@playwright/test";
import {
    Container,
    ContainerImpl,
    DI,
    FactoryImpl,
    inject,
    Registration,
    ResolverImpl,
    ResolverStrategy,
} from "./di.js";

function simulateTSCompilerDesignParamTypes(target: any, deps: any[]) {
    (Reflect as any).defineMetadata("design:paramtypes", deps, target);
}

test.describe(`The DI object`, () => {
    test.describe(`createContainer()`, () => {
        test(`returns an instance of Container`, () => {
            const actual = DI.createContainer();
            expect(actual).toBeInstanceOf(ContainerImpl);
        });

        test(`returns a new container every time`, () => {
            expect(DI.createContainer()).not.toBe(DI.createContainer());
        });
    });

    test.describe("installAsContextRequestStrategy", () => {
        test(`causes DI to handle Context.request`, async ({ page }) => {
            await page.goto("/");

            const { capture, value } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context, DI, Registration } = await import("/main.js");

                const value = "hello world";
                const TestContext = Context.create<string>("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                DI.installAsContextRequestStrategy();
                DI.getOrCreateDOMContainer().register(
                    Registration.instance(TestContext, value)
                );

                let capture;

                Context.request(parent, TestContext, response => {
                    capture = response;
                });

                return {
                    capture,
                    value,
                };
            }, {});

            expect(capture).toBe(value);

            await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                Context.setDefaultRequestStrategy(Context.dispatch);
            });
        });

        test(`causes DI to handle Context.get`, async ({ page }) => {
            await page.goto("/");

            const { capture, value } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context, DI, Registration } = await import("/main.js");

                const value = "hello world";
                const TestContext = Context.create<string>("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                DI.installAsContextRequestStrategy();
                DI.getOrCreateDOMContainer().register(
                    Registration.instance(TestContext, value)
                );

                return {
                    capture: Context.get(child, TestContext),
                    value,
                };
            });

            expect(capture).toBe(value);

            await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                Context.setDefaultRequestStrategy(Context.dispatch);
            });
        });

        test(`causes DI to handle Context.defineProperty`, async ({ page }) => {
            await page.goto("/");

            const { test, value } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context, DI, Registration } = await import("/main.js");

                const value = "hello world";
                const TestContext = Context.create<string>("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                DI.installAsContextRequestStrategy();
                DI.getOrCreateDOMContainer().register(
                    Registration.instance(TestContext, value)
                );

                Context.defineProperty(child, "test", TestContext);

                return {
                    test: (child as any).test,
                    value,
                };
            });

            expect(test).toBe(value);

            await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                Context.setDefaultRequestStrategy(Context.dispatch);
            });
        });

        test(`causes DI to handle Context decorators`, async ({ page }) => {
            test.fixme(true, "Decorator doesn’t work in page.evaluate");

            await page.goto("/");

            const { result, value } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context, DI, Registration } = await import("/main.js");

                const value = "hello world";
                const TestContext = Context.create<string>("TestContext");
                const elementName = "a-a";
                class TestElement extends HTMLElement {
                    @TestContext test: string;
                }

                customElements.define(elementName, TestElement);

                const parent = document.createElement("div");
                const child = document.createElement(elementName) as TestElement;
                parent.append(child);

                DI.installAsContextRequestStrategy();
                DI.getOrCreateDOMContainer().register(
                    Registration.instance(TestContext, value)
                );

                return {
                    result: child.test,
                    value,
                };
            });

            expect(result).toBe(value);

            await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                Context.setDefaultRequestStrategy(Context.dispatch);
            });
        });
    });

    test.describe(`findResponsibleContainer()`, () => {
        test(`finds the parent by default`, async ({ page }) => {
            await page.goto("/");

            const parentContainerMatchesChild = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { DI } = await import("/main.js");

                const parent = document.createElement("div");
                const child = document.createElement("div");

                parent.appendChild(child);

                const parentContainer = DI.getOrCreateDOMContainer(parent);
                DI.getOrCreateDOMContainer(child);

                return DI.findResponsibleContainer(child) === parentContainer;
            });

            expect(parentContainerMatchesChild).toBe(true);
        });

        test(`finds the host for a shadowed element by default`, async ({ page }) => {
            await page.goto("/");

            const parentContainerMatchesChild = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { DI, FASTElement, html, ref } = await import("/main.js");
                console.log(document);
                class TestChild extends FASTElement {} // ???
                TestChild.define({
                    name: "test-child",
                });
                class TestParent extends FASTElement {
                    public child!: TestChild;
                }
                TestParent.define({
                    name: "test-parent",
                    template: html`
                        <test-child ${ref("child")}></test-child>
                    `,
                });

                const parent = document.createElement("test-parent") as TestParent;
                document.body.appendChild(parent);
                const child = parent.child;

                const parentContainer = DI.getOrCreateDOMContainer(parent);
                return DI.findResponsibleContainer(child) === parentContainer;
            });

            expect(parentContainerMatchesChild).toBe(true);
        });

        test(`uses the owner when specified at creation time`, async ({ page }) => {
            await page.goto("/");

            const childContainerMatchesChild = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { DI } = await import("/main.js");

                const parent = document.createElement("div");
                const child = document.createElement("div");

                parent.appendChild(child);

                DI.getOrCreateDOMContainer(parent);
                const childContainer = DI.getOrCreateDOMContainer(child, {
                    responsibleForOwnerRequests: true,
                });

                return DI.findResponsibleContainer(child) === childContainer;
            });

            expect(childContainerMatchesChild).toBe(true);
        });
    });

    test.describe(`getDependencies()`, () => {
        test(`throws when inject is not an array`, () => {
            class Bar {}
            class Foo {
                public static inject = Bar;
            }

            expect(() => DI.getDependencies(Foo)).toThrow();
        });

        const deps = [
            [class Bar {}],
            [class Bar {}, class Bar {}],
            [undefined],
            [null],
            [42],
        ];

        for (let i = 0, ii = deps.length; i < ii; i++) {
            test(`returns a copy of the inject array ${i}`, () => {
                class Foo {
                    public static inject = deps[i].slice();
                }
                const actual = DI.getDependencies(Foo);

                expect(actual).toEqual(deps[i]);
                expect(actual).not.toBe(Foo.inject);
            });
        }

        for (let i = 0, ii = deps.length; i < ii; i++) {
            test(`does not traverse the 2-layer prototype chain for inject array ${i}`, () => {
                class Foo {
                    public static inject = deps[i].slice();
                }
                class Bar extends Foo {
                    public static inject = deps[i].slice();
                }
                const actual = DI.getDependencies(Bar);

                expect(actual).toEqual(deps[i]);
            });

            test(`does not traverse the 3-layer prototype chain for inject array ${i}`, () => {
                class Foo {
                    public static inject = deps[i].slice();
                }
                class Bar extends Foo {
                    public static inject = deps[i].slice();
                }
                class Baz extends Bar {
                    public static inject = deps[i].slice();
                }
                const actual = DI.getDependencies(Baz);

                expect(actual).toEqual(deps[i]);
            });

            test(`does not traverse the 1-layer + 2-layer prototype chain (with gap) for inject array ${i}`, () => {
                class Foo {
                    public static inject = deps[i].slice();
                }
                class Bar extends Foo {}
                class Baz extends Bar {
                    public static inject = deps[i].slice();
                }
                class Qux extends Baz {
                    public static inject = deps[i].slice();
                }
                const actual = DI.getDependencies(Qux);

                expect(actual).toEqual(deps[i]);
            });
        }
    });

    test.describe(`createContext()`, () => {
        test(`returns a function that stringifies its default friendly name`, () => {
            const sut = DI.createContext();
            const expected = "DIContext<(anonymous)>";
            expect(sut.toString()).toBe(expected);
            expect(String(sut)).toBe(expected);
            expect(`${sut}`).toBe(expected);
        });

        test(`returns a function that stringifies its configured friendly name`, () => {
            const sut = DI.createContext("IFoo");
            const expected = "DIContext<IFoo>";
            expect(sut.toString()).toBe(expected);
            expect(String(sut)).toBe(expected);
            expect(`${sut}`).toBe(expected);
        });
    });
});

test.describe(`The inject function`, () => {
    class Dep1 {}
    class Dep2 {}
    class Dep3 {}

    test(`can decorate classes with explicit dependencies`, () => {
        class Foo {}
        inject(Dep1, Dep2, Dep3)(Foo);

        expect(DI.getDependencies(Foo)).toEqual([Dep1, Dep2, Dep3]);
    });

    test(`can decorate classes with implicit dependencies`, () => {
        class Foo {
            constructor(dep1: Dep1, dep2: Dep2, dep3: Dep3) {
                return;
            }
        }
        inject(Dep1, Dep2, Dep3)(Foo, undefined, 0);

        simulateTSCompilerDesignParamTypes(Foo, [Dep1, Dep2, Dep3]);

        expect(DI.getDependencies(Foo)).toEqual([Dep1, Dep2, Dep3]);
    });

    test(`can decorate constructor parameters explicitly`, () => {
        test.fixme(true, "Decorator doesn't work in Playwright environment");

        class Foo {
            public constructor() // @inject(Dep1) dep1: Dep1, // TODO: uncomment these when test is fixed
            // @inject(Dep2) dep2: Dep2,
            // @inject(Dep3) dep3: Dep3
            {
                return;
            }
        }

        expect(DI.getDependencies(Foo)).toEqual([Dep1, Dep2, Dep3]);
    });

    test(`can decorate constructor parameters implicitly`, () => {
        test.fixme(true, "Decorator doesn't work in Playwright environment");

        class Foo {
            constructor() // @inject() dep1: Dep1, // TODO: uncomment these when test is fixed
            // @inject() dep2: Dep2,
            // @inject() dep3: Dep3
            {
                return;
            }
        }

        simulateTSCompilerDesignParamTypes(Foo, [Dep1, Dep2, Dep3]);

        expect(DI.getDependencies(Foo)).toEqual([Dep1, Dep2, Dep3]);
    });

    test(`can decorate properties explicitly`, () => {
        test.fixme(true, "Decorator doesn't work in Playwright environment");

        // @ts-ignore
        class Foo {
            // TODO: uncomment these when test is fixed
            // @inject(Dep1) public dep1: Dep1;
            // @inject(Dep2) public dep2: Dep2;
            // @inject(Dep3) public dep3: Dep3;
        }

        const instance = new Foo();

        expect(instance.dep1).toBeInstanceOf(Dep1);
        expect(instance.dep2).toBeInstanceOf(Dep2);
        expect(instance.dep3).toBeInstanceOf(Dep3);
    });
});

test.describe(`The transient decorator`, () => {
    test(`works as a plain decorator`, () => {
        test.fixme(true, "Decorator doesn't work in Playwright environment");

        // TODO: uncomment these when test is fixed
        // @transient
        class Foo {}
        expect(Foo["register"]).toBeInstanceOf(Function);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).not.toBe(foo2);
    });
    test(`works as an invocation`, () => {
        test.fixme(true, "Decorator doesn't work in Playwright environment");

        // TODO: uncomment these when test is fixed
        // @transient()
        class Foo {}
        expect(Foo["register"]).toBeInstanceOf(Function);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).not.toBe(foo2);
    });
});

test.describe(`The singleton decorator`, () => {
    test(`works as a plain decorator`, () => {
        test.fixme(true, "Decorator doesn't work in Playwright environment");

        // TODO: uncomment these when test is fixed
        // @singleton
        class Foo {}
        expect(Foo["register"]).toBeInstanceOf(Function);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).toBe(foo2);
    });
    test(`works as an invocation`, () => {
        test.fixme(true, "Decorator doesn't work in Playwright environment");

        // TODO: uncomment these when test is fixed
        // @singleton()
        class Foo {}
        expect(Foo["register"]).toBeInstanceOf(Function);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).toBe(foo2);
    });
});

test.describe(`The Resolver class`, () => {
    let container: Container;
    let registerResolverSpy: any;

    test.beforeEach(() => {
        container = DI.createContainer();
        registerResolverSpy = { called: false, args: null as any };
        const originalRegisterResolver = container.registerResolver.bind(container);
        container.registerResolver = ((...args: any[]) => {
            registerResolverSpy.called = true;
            registerResolverSpy.args = args;
            return originalRegisterResolver(...args);
        }) as any;
    });

    test.describe(`register()`, () => {
        test(`registers the resolver to the container with its own key`, () => {
            const sut = new ResolverImpl("foo", 0, null);
            sut.register(container);
            expect(registerResolverSpy.called).toBe(true);
            expect(registerResolverSpy.args[0]).toBe("foo");
            expect(registerResolverSpy.args[1]).toBe(sut);
        });
    });

    test.describe(`resolve()`, () => {
        test(`instance - returns state`, () => {
            const state = {};
            const sut = new ResolverImpl("foo", ResolverStrategy.instance, state);
            const actual = sut.resolve(container, container);
            expect(actual).toBe(state);
        });

        test(`singleton - returns an instance of the type and sets strategy to instance`, () => {
            class Foo {}
            const sut = new ResolverImpl("foo", ResolverStrategy.singleton, Foo);
            const actual = sut.resolve(container, container);
            expect(actual).toBeInstanceOf(Foo);

            const actual2 = sut.resolve(container, container);
            expect(actual2).toBe(actual);
        });

        test(`transient - always returns a new instance of the type`, () => {
            class Foo {}
            const sut = new ResolverImpl("foo", ResolverStrategy.transient, Foo);
            const actual1 = sut.resolve(container, container);
            expect(actual1).toBeInstanceOf(Foo);

            const actual2 = sut.resolve(container, container);
            expect(actual2).toBeInstanceOf(Foo);
            expect(actual2).not.toBe(actual1);
        });

        test(`array - calls resolve() on the first item in the state array`, () => {
            const resolveSpy = { called: false, args: null as any };
            const resolver = {
                resolve: (...args: any[]) => {
                    resolveSpy.called = true;
                    resolveSpy.args = args;
                },
            };
            const sut = new ResolverImpl("foo", ResolverStrategy.array, [resolver]);
            sut.resolve(container, container);
            expect(resolveSpy.called).toBe(true);
            expect(resolveSpy.args[0]).toBe(container);
            expect(resolveSpy.args[1]).toBe(container);
        });

        test(`throws for unknown strategy`, () => {
            const sut = new ResolverImpl("foo", -1 as any, null);
            expect(() => sut.resolve(container, container)).toThrow();
        });
    });

    test.describe(`getFactory()`, () => {
        test(`returns a new singleton Factory if it does not exist`, () => {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.singleton, Foo);
            const actual = sut.getFactory(container)!;
            expect(actual).toBeInstanceOf(FactoryImpl);
            expect(actual.Type).toBe(Foo);
        });

        test(`returns a new transient Factory if it does not exist`, () => {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.transient, Foo);
            const actual = sut.getFactory(container)!;
            expect(actual).toBeInstanceOf(FactoryImpl);
            expect(actual.Type).toBe(Foo);
        });

        test(`returns a null for instance strategy`, () => {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.instance, Foo);
            const actual = sut.getFactory(container);
            expect(actual).toBe(null);
        });

        test(`returns a null for array strategy`, () => {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.array, Foo);
            const actual = sut.getFactory(container);
            expect(actual).toBe(null);
        });

        test(`returns the alias resolved factory for alias strategy`, () => {
            class Foo {}
            class Bar {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.alias, Bar);
            const actual = sut.getFactory(container)!;
            expect(actual.Type).toBe(Bar);
        });

        test(`returns a null for callback strategy`, () => {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.callback, Foo);
            const actual = sut.getFactory(container);
            expect(actual).toBe(null);
        });
    });
});

test.describe(`The Factory class`, () => {
    test.describe(`construct()`, () => {
        for (const staticCount of [0, 1, 2, 3, 4, 5, 6, 7]) {
            for (const dynamicCount of [0, 1, 2]) {
                const container = DI.createContainer();
                test(`instantiates a type with ${staticCount} static deps and ${dynamicCount} dynamic deps`, () => {
                    class Bar {}
                    class Foo {
                        public static inject = Array(staticCount).fill(Bar);
                        public args: any[];
                        constructor(...args: any[]) {
                            this.args = args;
                        }
                    }
                    const sut = new FactoryImpl(Foo, DI.getDependencies(Foo));
                    const dynamicDeps = dynamicCount
                        ? Array(dynamicCount).fill({})
                        : undefined;

                    const actual = sut.construct(container, dynamicDeps);

                    for (let i = 0, ii = Foo.inject.length; i < ii; ++i) {
                        expect(actual.args[i]).toBeInstanceOf(DI.getDependencies(Foo)[i]);
                    }

                    for (
                        let i = 0, ii = dynamicDeps ? dynamicDeps.length : 0;
                        i < ii;
                        ++i
                    ) {
                        expect(actual.args[DI.getDependencies(Foo).length + i]).toBe(
                            dynamicDeps![i]
                        );
                    }
                });
            }
        }
    });

    test.describe(`registerTransformer()`, () => {
        test(`registers the transformer`, () => {
            const container = DI.createContainer();
            class Foo {
                public bar: string;
                public baz: string;
            }
            const sut = new FactoryImpl(Foo, DI.getDependencies(Foo));
            sut.registerTransformer(foo2 => Object.assign(foo2, { bar: 1 }));
            sut.registerTransformer(foo2 => Object.assign(foo2, { baz: 2 }));
            const foo = sut.construct(container);
            expect(foo.bar).toBe(1);
            expect(foo.baz).toBe(2);
            expect(foo).toBeInstanceOf(Foo);
        });
    });
});

test.describe(`The Container class`, () => {
    function createFixture() {
        const sut = DI.createContainer();
        const registerSpy = {
            called: 0,
            firstArgs: null as any,
            secondArgs: null as any,
        };
        const register = ((...args: any[]) => {
            registerSpy.called++;
            if (registerSpy.called === 1) {
                registerSpy.firstArgs = args;
            } else if (registerSpy.called === 2) {
                registerSpy.secondArgs = args;
            }
        }) as any;
        return { sut, register, registerSpy, context: {} };
    }

    const registrationMethods = [
        {
            name: "register",
            createTest() {
                const { sut, register, registerSpy } = createFixture();

                return {
                    register,
                    registerSpy,
                    test: (...args: any[]) => {
                        sut.register(...args);

                        expect(registerSpy.called).toBeGreaterThanOrEqual(1);
                        expect(registerSpy.firstArgs[0]).toBe(sut);

                        if (args.length === 2) {
                            expect(registerSpy.called).toBeGreaterThanOrEqual(2);
                            expect(registerSpy.secondArgs[0]).toBe(sut);
                        }
                    },
                };
            },
        },
    ];

    for (const method of registrationMethods) {
        test.describe(`${method.name}()`, () => {
            test(`calls ${method.name}() on {register}`, () => {
                const { test, register } = method.createTest();
                test({ register });
            });

            test(`calls ${method.name}() on {register},{register}`, () => {
                const { test, register } = method.createTest();
                test({ register }, { register });
            });

            test(`calls ${method.name}() on [{register},{register}]`, () => {
                const { test, register } = method.createTest();
                test([{ register }, { register }]);
            });

            test(`calls ${method.name}() on {foo:{register}}`, () => {
                const { test, register } = method.createTest();
                test({ foo: { register } });
            });

            test(`calls ${method.name}() on {foo:{register}},{foo:{register}}`, () => {
                const { test, register } = method.createTest();
                test({ foo: { register } }, { foo: { register } });
            });

            test(`calls ${method.name}() on [{foo:{register}},{foo:{register}}]`, () => {
                const { test, register } = method.createTest();
                test([{ foo: { register } }, { foo: { register } }]);
            });

            test(`calls ${method.name}() on {register},{foo:{register}}`, () => {
                const { test, register } = method.createTest();
                test({ register }, { foo: { register } });
            });

            test(`calls ${method.name}() on [{register},{foo:{register}}]`, () => {
                const { test, register } = method.createTest();
                test([{ register }, { foo: { register } }]);
            });

            test(`calls ${method.name}() on [{register},{}]`, () => {
                const { test, register } = method.createTest();
                test([{ register }, {}]);
            });

            test(`calls ${method.name}() on [{},{register}]`, () => {
                const { test, register } = method.createTest();
                test([{}, { register }]);
            });

            test(`calls ${method.name}() on [{foo:{register}},{foo:{}}]`, () => {
                const { test, register } = method.createTest();
                test([{ foo: { register } }, { foo: {} }]);
            });

            test(`calls ${method.name}() on [{foo:{}},{foo:{register}}]`, () => {
                const { test, register } = method.createTest();
                test([{ foo: {} }, { foo: { register } }]);
            });
        });
    }

    test.describe(`does NOT throw when attempting to register primitive values`, () => {
        for (const value of [
            void 0,
            null,
            true,
            false,
            "",
            "asdf",
            NaN,
            Infinity,
            0,
            42,
            Symbol(),
            Symbol("a"),
        ]) {
            test(`{foo:${String(value)}}`, () => {
                const { sut } = createFixture();
                sut.register({ foo: value });
            });

            test(`{foo:{bar:${String(value)}}}`, () => {
                const { sut } = createFixture();
                sut.register({ foo: { bar: value } });
            });

            test(`[${String(value)}]`, () => {
                const { sut } = createFixture();
                sut.register([value]);
            });

            test(`${String(value)}`, () => {
                const { sut } = createFixture();
                sut.register(value);
            });
        }
    });

    test.describe(`registerResolver()`, () => {
        for (const key of [null, undefined]) {
            test(`throws on invalid key ${key}`, () => {
                const { sut } = createFixture();
                expect(() => sut.registerResolver(key as any, null as any)).toThrow();
            });
        }

        test(`registers the resolver if it does not exist yet`, () => {
            const { sut } = createFixture();
            const key = {};
            const resolver = new ResolverImpl(key, ResolverStrategy.instance, {});
            sut.registerResolver(key, resolver);
            const actual = sut.getResolver(key);
            expect(actual).toEqual(resolver);
        });

        test(`changes to array resolver if the key already exists`, () => {
            const { sut } = createFixture();
            const key = {};
            const resolver1 = new ResolverImpl(key, ResolverStrategy.instance, {});
            const resolver2 = new ResolverImpl(key, ResolverStrategy.instance, {});
            sut.registerResolver(key, resolver1);
            const actual1 = sut.getResolver(key);
            expect(actual1).toEqual(resolver1);
            sut.registerResolver(key, resolver2);
            const actual2 = sut.getResolver(key)!;
            expect(actual2).not.toEqual(actual1);
            expect(actual2).not.toEqual(resolver1);
            expect(actual2).not.toEqual(resolver2);
            expect(actual2["strategy"]).toEqual(ResolverStrategy.array);
            expect(actual2["state"][0]).toEqual(resolver1);
            expect(actual2["state"][1]).toEqual(resolver2);
        });

        test(`appends to the array resolver if the key already exists more than once`, () => {
            const { sut } = createFixture();
            const key = {};
            const resolver1 = new ResolverImpl(key, ResolverStrategy.instance, {});
            const resolver2 = new ResolverImpl(key, ResolverStrategy.instance, {});
            const resolver3 = new ResolverImpl(key, ResolverStrategy.instance, {});
            sut.registerResolver(key, resolver1);
            sut.registerResolver(key, resolver2);
            sut.registerResolver(key, resolver3);
            const actual1 = sut.getResolver(key)!;
            expect(actual1["strategy"]).toEqual(ResolverStrategy.array);
            expect(actual1["state"][0]).toEqual(resolver1);
            expect(actual1["state"][1]).toEqual(resolver2);
            expect(actual1["state"][2]).toEqual(resolver3);
        });
    });

    test.describe(`registerTransformer()`, () => {
        for (const key of [null, undefined]) {
            test(`throws on invalid key ${key}`, () => {
                const { sut } = createFixture();
                expect(() => sut.registerTransformer(key as any, null as any)).toThrow();
            });
        }
    });

    test.describe(`getResolver()`, () => {
        for (const key of [null, undefined]) {
            test(`throws on invalid key ${key}`, () => {
                const { sut } = createFixture();
                expect(() => sut.getResolver(key as any, null as any)).toThrow();
            });
        }
    });

    test.describe(`has()`, () => {
        for (const key of [null, undefined, Object]) {
            test(`returns false for non-existing key ${key}`, () => {
                const { sut } = createFixture();
                expect(sut.has(key as any, false)).toBe(false);
            });
        }
        test(`returns true for existing key`, () => {
            const { sut } = createFixture();
            const key = {};
            sut.registerResolver(
                key,
                new ResolverImpl(key, ResolverStrategy.instance, {})
            );
            expect(sut.has(key as any, false)).toBe(true);
        });
    });

    test.describe(`get()`, () => {
        for (const key of [null, undefined]) {
            test(`throws on invalid key ${key}`, () => {
                const { sut } = createFixture();
                expect(() => sut.get(key as any)).toThrow();
            });
        }
    });

    test.describe(`getAll()`, () => {
        for (const key of [null, undefined]) {
            test(`throws on invalid key ${key}`, () => {
                const { sut } = createFixture();
                expect(() => sut.getAll(key as any)).toThrow();
            });
        }
    });

    test.describe(`getFactory()`, () => {
        for (const count of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            const sut = DI.createContainer();
            test(`returns a new Factory with ${count} deps if it does not exist`, () => {
                class Bar {}
                class Foo {
                    public static inject = Array(count).map(c => Bar);
                }
                const actual = sut.getFactory(Foo);
                expect(actual).toBeInstanceOf(FactoryImpl);
                expect(actual.Type).toEqual(Foo);
                expect(actual["dependencies"]).toEqual(Foo.inject);
            });
        }
    });
});

test.describe(`The Registration object`, () => {
    test(`instance() returns the correct resolver`, () => {
        const value = {};
        const actual = Registration.instance("key", value);
        expect(actual["key"]).toBe("key");
        expect(actual["strategy"]).toBe(ResolverStrategy.instance);
        expect(actual["state"]).toBe(value);
    });

    test(`singleton() returns the correct resolver`, () => {
        class Foo {}
        const actual = Registration.singleton("key", Foo);
        expect(actual["key"]).toBe("key");
        expect(actual["strategy"]).toBe(ResolverStrategy.singleton);
        expect(actual["state"]).toBe(Foo);
    });

    test(`transient() returns the correct resolver`, () => {
        class Foo {}
        const actual = Registration.transient("key", Foo);
        expect(actual["key"]).toBe("key");
        expect(actual["strategy"]).toBe(ResolverStrategy.transient);
        expect(actual["state"]).toBe(Foo);
    });

    test(`callback() returns the correct resolver`, () => {
        const callback = () => {
            return;
        };
        const actual = Registration.callback("key", callback);
        expect(actual["key"]).toBe("key");
        expect(actual["strategy"]).toBe(ResolverStrategy.callback);
        expect(actual["state"]).toBe(callback);
    });

    test(`alias() returns the correct resolver`, () => {
        const actual = Registration.aliasTo("key", "key2");
        expect(actual["key"]).toBe("key2");
        expect(actual["strategy"]).toBe(ResolverStrategy.alias);
        expect(actual["state"]).toBe("key");
    });
});
