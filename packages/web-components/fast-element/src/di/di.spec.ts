import {
    Container,
    ContainerImpl,
    DI,
    FactoryImpl,
    inject,
    Registration,
    ResolverImpl,
    ResolverStrategy,
    singleton,
    transient,
} from "./di.js";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { uniqueElementName } from "../testing/fixture.js";
import { Context } from "../context.js";
import { customElement, FASTElement } from "../components/fast-element.js";
import { html } from "../templating/template.js";
import { ref } from "../templating/ref.js";

chai.use(spies);

function decorator(): ClassDecorator {
    return (target: any) => target;
}

function simulateTSCompilerDesignParamTypes(target: any, deps: any[]) {
    (Reflect as any).defineMetadata("design:paramtypes", deps, target);
}

describe(`The DI object`, function () {
    describe(`createContainer()`, function () {
        it(`returns an instance of Container`, function () {
            const actual = DI.createContainer();
            expect(actual).instanceOf(ContainerImpl, `actual`);
        });

        it(`returns a new container every time`, function () {
            expect(DI.createContainer()).not.equal(
                DI.createContainer(),
                `DI.createContainer()`
            );
        });
    });

    describe("installAsContextRequestStrategy", () => {
        it(`causes DI to handle Context.request`, () => {
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

            expect(capture).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });

        it(`causes DI to handle Context.get`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            DI.installAsContextRequestStrategy();
            DI.getOrCreateDOMContainer().register(
                Registration.instance(TestContext, value)
            );

            let capture = Context.get(child, TestContext);

            expect(capture).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });

        it(`causes DI to handle Context.defineProperty`, () => {
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

            expect((child as any).test).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });

        it(`causes DI to handle Context decorators`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const elementName = uniqueElementName();

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

            expect(child.test).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });
    });

    describe(`findResponsibleContainer()`, function () {
        it(`finds the parent by default`, function () {
            const parent = document.createElement('div');
            const child = document.createElement('div');

            parent.appendChild(child);

            const parentContainer = DI.getOrCreateDOMContainer(parent);
            const childContainer = DI.getOrCreateDOMContainer(child);

            expect(DI.findResponsibleContainer(child)).equal(parentContainer);
        });

        it(`finds the host for a shadowed element by default`, function () {
            @customElement({name: "test-child"})
            class TestChild extends FASTElement {}
            @customElement({name: "test-parent", template: html`<test-child ${ref("child")}></test-child>`})
            class TestParent extends FASTElement {
                public child: TestChild;
            }

            const parent = document.createElement("test-parent") as TestParent;
            document.body.appendChild(parent);
            const child = parent.child;

            const parentContainer = DI.getOrCreateDOMContainer(parent);

            expect(DI.findResponsibleContainer(child)).equal(parentContainer);
        });

        it(`uses the owner when specified at creation time`, function () {
            const parent = document.createElement('div');
            const child = document.createElement('div');

            parent.appendChild(child);

            const parentContainer = DI.getOrCreateDOMContainer(parent);
            const childContainer = DI.getOrCreateDOMContainer(
                child,
                { responsibleForOwnerRequests: true }
            );

            expect(DI.findResponsibleContainer(child)).equal(childContainer);
        });
    });

    describe(`getDependencies()`, function () {
        it(`throws when inject is not an array`, function () {
            class Bar {}
            class Foo {
                public static inject = Bar;
            }

            expect(() => DI.getDependencies(Foo)).throws();
        });

        for (const deps of [
            [class Bar {}],
            [class Bar {}, class Bar {}],
            [undefined],
            [null],
            [42],
        ]) {
            it(`returns a copy of the inject array ${deps}`, function () {
                class Foo {
                    public static inject = deps.slice();
                }
                const actual = DI.getDependencies(Foo);

                expect(actual).eql(deps, `actual`);
                expect(actual).not.equal(Foo.inject, `actual`);
            });
        }

        for (const deps of [
            [class Bar {}],
            [class Bar {}, class Bar {}],
            [undefined],
            [null],
            [42],
        ]) {
            it(`does not traverse the 2-layer prototype chain for inject array ${deps}`, function () {
                class Foo {
                    public static inject = deps.slice();
                }
                class Bar extends Foo {
                    public static inject = deps.slice();
                }
                const actual = DI.getDependencies(Bar);

                expect(actual).eql(deps, `actual`);
            });

            it(`does not traverse the 3-layer prototype chain for inject array ${deps}`, function () {
                class Foo {
                    public static inject = deps.slice();
                }
                class Bar extends Foo {
                    public static inject = deps.slice();
                }
                class Baz extends Bar {
                    public static inject = deps.slice();
                }
                const actual = DI.getDependencies(Baz);

                expect(actual).eql(deps, `actual`);
            });

            it(`does not traverse the 1-layer + 2-layer prototype chain (with gap) for inject array ${deps}`, function () {
                class Foo {
                    public static inject = deps.slice();
                }
                class Bar extends Foo {}
                class Baz extends Bar {
                    public static inject = deps.slice();
                }
                class Qux extends Baz {
                    public static inject = deps.slice();
                }
                const actual = DI.getDependencies(Qux);

                expect(actual).eql(deps, `actual`);
            });
        }
    });

    describe(`createContext()`, function () {
        it(`returns a function that stringifies its default friendly name`, function () {
            const sut = DI.createContext();
            const expected = "DIContext<(anonymous)>";
            expect(sut.toString()).equal(expected, `sut.toString() === '${expected}'`);
            expect(String(sut)).equal(expected, `String(sut) === '${expected}'`);
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            expect(`${sut}`).equal(expected, `\`\${sut}\` === '${expected}'`);
        });

        it(`returns a function that stringifies its configured friendly name`, function () {
            const sut = DI.createContext("IFoo");
            const expected = "DIContext<IFoo>";
            expect(sut.toString()).equal(expected, `sut.toString() === '${expected}'`);
            expect(String(sut)).equal(expected, `String(sut) === '${expected}'`);
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            expect(`${sut}`).equal(expected, `\`\${sut}\` === '${expected}'`);
        });
    });
});

describe(`The inject decorator`, function () {
    class Dep1 {}
    class Dep2 {}
    class Dep3 {}

    it(`can decorate classes with explicit dependencies`, function () {
        @inject(Dep1, Dep2, Dep3)
        class Foo {}

        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3], `Foo['inject']`);
    });

    it(`can decorate classes with implicit dependencies`, function () {
        @inject()
        class Foo {
            constructor(dep1: Dep1, dep2: Dep2, dep3: Dep3) {
                return;
            }
        }

        simulateTSCompilerDesignParamTypes(Foo, [Dep1, Dep2, Dep3]);

        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3]);
    });

    it(`can decorate constructor parameters explicitly`, function () {
        class Foo {
            public constructor(
                @inject(Dep1) dep1: Dep1,
                @inject(Dep2) dep2: Dep2,
                @inject(Dep3) dep3: Dep3
            ) {
                return;
            }
        }

        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3], `Foo['inject']`);
    });

    it(`can decorate constructor parameters implicitly`, function () {
        class Foo {
            constructor(
                @inject() dep1: Dep1,
                @inject() dep2: Dep2,
                @inject() dep3: Dep3
            ) {
                return;
            }
        }

        simulateTSCompilerDesignParamTypes(Foo, [Dep1, Dep2, Dep3]);

        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3]);
    });

    it(`can decorate properties explicitly`, function () {
        // @ts-ignore
        class Foo {
            @inject(Dep1) public dep1: Dep1;
            @inject(Dep2) public dep2: Dep2;
            @inject(Dep3) public dep3: Dep3;
        }

        const instance = new Foo();

        expect(instance.dep1).instanceof(Dep1);
        expect(instance.dep2).instanceof(Dep2);
        expect(instance.dep3).instanceof(Dep3);
    });
});

describe(`The transient decorator`, function () {
    it(`works as a plain decorator`, function () {
        @transient
        class Foo {}
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).not.eq(foo2, `foo1`);
    });
    it(`works as an invocation`, function () {
        @transient()
        class Foo {}
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).not.eq(foo2, `foo1`);
    });
});

describe(`The singleton decorator`, function () {
    it(`works as a plain decorator`, function () {
        @singleton
        class Foo {}
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).eq(foo2, `foo1`);
    });
    it(`works as an invocation`, function () {
        @singleton()
        class Foo {}
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).eq(foo2, `foo1`);
    });
});

describe(`The Resolver class`, function () {
    let container: Container;

    beforeEach(function () {
        container = DI.createContainer();
        chai.spy.on(container, "registerResolver");
    });

    describe(`register()`, function () {
        it(`registers the resolver to the container with its own key`, function () {
            const sut = new ResolverImpl("foo", 0, null);
            sut.register(container);
            expect(container.registerResolver).called.with("foo", sut);
        });
    });

    describe(`resolve()`, function () {
        it(`instance - returns state`, function () {
            const state = {};
            const sut = new ResolverImpl("foo", ResolverStrategy.instance, state);
            const actual = sut.resolve(container, container);
            expect(actual).eq(state, `actual`);
        });

        it(`singleton - returns an instance of the type and sets strategy to instance`, function () {
            class Foo {}
            const sut = new ResolverImpl("foo", ResolverStrategy.singleton, Foo);
            const actual = sut.resolve(container, container);
            expect(actual).instanceOf(Foo, `actual`);

            const actual2 = sut.resolve(container, container);
            expect(actual2).eq(actual, `actual2`);
        });

        it(`transient - always returns a new instance of the type`, function () {
            class Foo {}
            const sut = new ResolverImpl("foo", ResolverStrategy.transient, Foo);
            const actual1 = sut.resolve(container, container);
            expect(actual1).instanceOf(Foo, `actual1`);

            const actual2 = sut.resolve(container, container);
            expect(actual2).instanceOf(Foo, `actual2`);
            expect(actual2).not.eq(actual1, `actual2`);
        });

        it(`array - calls resolve() on the first item in the state array`, function () {
            const resolver = { resolve: chai.spy() };
            const sut = new ResolverImpl("foo", ResolverStrategy.array, [resolver]);
            sut.resolve(container, container);
            expect(resolver.resolve).called.with(container, container);
        });

        it(`throws for unknown strategy`, function () {
            const sut = new ResolverImpl("foo", -1, null);
            expect(() => sut.resolve(container, container)).throws();
        });
    });

    describe(`getFactory()`, function () {
        it(`returns a new singleton Factory if it does not exist`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.singleton, Foo);
            const actual = sut.getFactory(container)!;
            expect(actual).instanceOf(FactoryImpl, `actual`);
            expect(actual.Type).eq(Foo, `actual.Type`);
        });

        it(`returns a new transient Factory if it does not exist`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.transient, Foo);
            const actual = sut.getFactory(container)!;
            expect(actual).instanceOf(FactoryImpl, `actual`);
            expect(actual.Type).eq(Foo, `actual.Type`);
        });

        it(`returns a null for instance strategy`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.instance, Foo);
            const actual = sut.getFactory(container);
            expect(actual).eq(null, `actual`);
        });

        it(`returns a null for array strategy`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.array, Foo);
            const actual = sut.getFactory(container);
            expect(actual).eq(null, `actual`);
        });

        it(`returns the alias resolved factory for alias strategy`, function () {
            class Foo {}
            class Bar {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.alias, Bar);
            const actual = sut.getFactory(container)!;
            expect(actual.Type).eq(Bar, `actual`);
        });

        it(`returns a null for callback strategy`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, ResolverStrategy.callback, Foo);
            const actual = sut.getFactory(container);
            expect(actual).eq(null, `actual`);
        });
    });
});

describe(`The Factory class`, function () {
    describe(`construct()`, function () {
        for (const staticCount of [0, 1, 2, 3, 4, 5, 6, 7]) {
            for (const dynamicCount of [0, 1, 2]) {
                const container = DI.createContainer();
                it(`instantiates a type with ${staticCount} static deps and ${dynamicCount} dynamic deps`, function () {
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
                        expect(actual.args[i]).instanceOf(
                            DI.getDependencies(Foo)[i],
                            `actual.args[i]`
                        );
                    }

                    for (
                        let i = 0, ii = dynamicDeps ? dynamicDeps.length : 0;
                        i < ii;
                        ++i
                    ) {
                        expect(actual.args[DI.getDependencies(Foo).length + i]).eq(
                            dynamicDeps![i],
                            `actual.args[Foo.inject.length + i]`
                        );
                    }
                });
            }
        }
    });

    describe(`registerTransformer()`, function () {
        it(`registers the transformer`, function () {
            const container = DI.createContainer();
            class Foo {
                public bar: string;
                public baz: string;
            }
            const sut = new FactoryImpl(Foo, DI.getDependencies(Foo));
            // eslint-disable-next-line prefer-object-spread
            sut.registerTransformer(foo2 => Object.assign(foo2, { bar: 1 }));
            // eslint-disable-next-line prefer-object-spread
            sut.registerTransformer(foo2 => Object.assign(foo2, { baz: 2 }));
            const foo = sut.construct(container);
            expect(foo.bar).eq(1, `foo.bar`);
            expect(foo.baz).eq(2, `foo.baz`);
            expect(foo).instanceOf(Foo, `foo`);
        });
    });
});

describe(`The Container class`, function () {
    function createFixture() {
        const sut = DI.createContainer();
        const register = chai.spy();
        return { sut, register, context: {} };
    }

    const registrationMethods = [
        {
            name: 'register',
            createTest() {
                const { sut, register } = createFixture();

                return {
                    register,
                    test: (...args: any[]) => {
                        sut.register(...args);

                        expect(register).to.have.been.first.called.with(sut);

                        if (args.length === 2) {
                            expect(register).to.have.been.second.called.with(sut);
                        }
                    }
                };
            }
        }
    ];

    for (const method of registrationMethods) {
        describe(`${method.name}()`, () => {
            it(`calls ${method.name}() on {register}`, () => {
                const { test, register } = method.createTest();
                test({ register });
            });

            it(`calls ${method.name}() on {register},{register}`, () => {
                const { test, register } = method.createTest();
                test({ register }, { register });
            });

            it(`calls ${method.name}() on [{register},{register}]`, () => {
                const { test, register } = method.createTest();
                test([{ register }, { register }]);
            });

            it(`calls ${method.name}() on {foo:{register}}`, () => {
                const { test, register } = method.createTest();
                test({ foo: { register } });
            });

            it(`calls ${method.name}() on {foo:{register}},{foo:{register}}`, () => {
                const { test, register } = method.createTest();
                test({ foo: { register } }, { foo: { register } });
            });

            it(`calls ${method.name}() on [{foo:{register}},{foo:{register}}]`, () => {
                const { test, register } = method.createTest();
                test([{ foo: { register } }, { foo: { register } }]);
            });

            it(`calls ${method.name}() on {register},{foo:{register}}`, () => {
                const { test, register } = method.createTest();
                test({ register }, { foo: { register } });
            });

            it(`calls ${method.name}() on [{register},{foo:{register}}]`, () => {
                const { test, register } = method.createTest();
                test([{ register }, { foo: { register } }]);
            });

            it(`calls ${method.name}() on [{register},{}]`, () => {
                const { test, register } = method.createTest();
                test([{ register }, {}]);
            });

            it(`calls ${method.name}() on [{},{register}]`, () => {
                const { test, register } = method.createTest();
                test([{}, { register }]);
            });

            it(`calls ${method.name}() on [{foo:{register}},{foo:{}}]`, () => {
                const { test, register } = method.createTest();
                test([{ foo: { register } }, { foo: {} }]);
            });

            it(`calls ${method.name}() on [{foo:{}},{foo:{register}}]`, () => {
                const { test, register } = method.createTest();
                test([{ foo: {} }, { foo: { register } }]);
            });
        });
    }

    describe(`does NOT throw when attempting to register primitive values`, () => {
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
            it(`{foo:${String(value)}}`, () => {
                const { sut } = createFixture();
                sut.register({ foo: value });
            });

            it(`{foo:{bar:${String(value)}}}`, () => {
                const { sut } = createFixture();
                sut.register({ foo: { bar: value } });
            });

            it(`[${String(value)}]`, () => {
                const { sut } = createFixture();
                sut.register([value]);
            });

            it(`${String(value)}`, () => {
                const { sut } = createFixture();
                sut.register(value);
            });
        }
    });

    describe(`registerResolver()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.registerResolver(key as any, null as any)).throws();
            });
        }

        it(`registers the resolver if it does not exist yet`, function () {
            const { sut } = createFixture();
            const key = {};
            const resolver = new ResolverImpl(key, ResolverStrategy.instance, {});
            sut.registerResolver(key, resolver);
            const actual = sut.getResolver(key);
            expect(actual).eql(resolver, `actual`);
        });

        it(`changes to array resolver if the key already exists`, function () {
            const { sut } = createFixture();
            const key = {};
            const resolver1 = new ResolverImpl(key, ResolverStrategy.instance, {});
            const resolver2 = new ResolverImpl(key, ResolverStrategy.instance, {});
            sut.registerResolver(key, resolver1);
            const actual1 = sut.getResolver(key);
            expect(actual1).eql(resolver1, `actual1`);
            sut.registerResolver(key, resolver2);
            const actual2 = sut.getResolver(key)!;
            expect(actual2).not.eql(actual1, `actual2`);
            expect(actual2).not.eql(resolver1, `actual2`);
            expect(actual2).not.eql(resolver2, `actual2`);
            expect(actual2["strategy"]).eql(
                ResolverStrategy.array,
                `actual2['strategy']`
            );
            expect(actual2["state"][0]).eql(resolver1, `actual2['state'][0]`);
            expect(actual2["state"][1]).eql(resolver2, `actual2['state'][1]`);
        });

        it(`appends to the array resolver if the key already exists more than once`, function () {
            const { sut } = createFixture();
            const key = {};
            const resolver1 = new ResolverImpl(key, ResolverStrategy.instance, {});
            const resolver2 = new ResolverImpl(key, ResolverStrategy.instance, {});
            const resolver3 = new ResolverImpl(key, ResolverStrategy.instance, {});
            sut.registerResolver(key, resolver1);
            sut.registerResolver(key, resolver2);
            sut.registerResolver(key, resolver3);
            const actual1 = sut.getResolver(key)!;
            expect(actual1["strategy"]).eql(
                ResolverStrategy.array,
                `actual1['strategy']`
            );
            expect(actual1["state"][0]).eql(resolver1, `actual1['state'][0]`);
            expect(actual1["state"][1]).eql(resolver2, `actual1['state'][1]`);
            expect(actual1["state"][2]).eql(resolver3, `actual1['state'][2]`);
        });
    });

    describe(`registerTransformer()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.registerTransformer(key as any, null as any)).throws();
            });
        }
    });

    describe(`getResolver()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.getResolver(key as any, null as any)).throws();
            });
        }
    });

    describe(`has()`, function () {
        for (const key of [null, undefined, Object]) {
            it(`returns false for non-existing key ${key}`, function () {
                const { sut } = createFixture();
                expect(sut.has(key as any, false)).eql(
                    false,
                    `sut.has(key as any, false)`
                );
            });
        }
        it(`returns true for existing key`, function () {
            const { sut } = createFixture();
            const key = {};
            sut.registerResolver(
                key,
                new ResolverImpl(key, ResolverStrategy.instance, {})
            );
            expect(sut.has(key as any, false)).eql(true, `sut.has(key as any, false)`);
        });
    });

    describe(`get()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.get(key as any)).throws();
            });
        }
    });

    describe(`getAll()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.getAll(key as any)).throws();
            });
        }
    });

    describe(`getFactory()`, function () {
        for (const count of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            const sut = DI.createContainer();
            it(`returns a new Factory with ${count} deps if it does not exist`, function () {
                class Bar {}
                class Foo {
                    public static inject = Array(count).map(c => Bar);
                }
                const actual = sut.getFactory(Foo);
                expect(actual).instanceOf(FactoryImpl, `actual`);
                expect(actual.Type).eql(Foo, `actual.Type`);
                expect(actual["dependencies"]).deep.eq(Foo.inject);
            });
        }
    });
});

describe(`The Registration object`, function () {
    it(`instance() returns the correct resolver`, function () {
        const value = {};
        const actual = Registration.instance("key", value);
        expect(actual["key"]).eq("key", `actual['key']`);
        expect(actual["strategy"]).eq(ResolverStrategy.instance, `actual['strategy']`);
        expect(actual["state"]).eq(value, `actual['state']`);
    });

    it(`singleton() returns the correct resolver`, function () {
        class Foo {}
        const actual = Registration.singleton("key", Foo);
        expect(actual["key"]).eq("key", `actual['key']`);
        expect(actual["strategy"]).eq(ResolverStrategy.singleton, `actual['strategy']`);
        expect(actual["state"]).eq(Foo, `actual['state']`);
    });

    it(`transient() returns the correct resolver`, function () {
        class Foo {}
        const actual = Registration.transient("key", Foo);
        expect(actual["key"]).eq("key", `actual['key']`);
        expect(actual["strategy"]).eq(ResolverStrategy.transient, `actual['strategy']`);
        expect(actual["state"]).eq(Foo, `actual['state']`);
    });

    it(`callback() returns the correct resolver`, function () {
        const callback = () => {
            return;
        };
        const actual = Registration.callback("key", callback);
        expect(actual["key"]).eq("key", `actual['key']`);
        expect(actual["strategy"]).eq(ResolverStrategy.callback, `actual['strategy']`);
        expect(actual["state"]).eq(callback, `actual['state']`);
    });

    it(`alias() returns the correct resolver`, function () {
        const actual = Registration.aliasTo("key", "key2");
        expect(actual["key"]).eq("key2", `actual['key']`);
        expect(actual["strategy"]).eq(ResolverStrategy.alias, `actual['strategy']`);
        expect(actual["state"]).eq("key", `actual['state']`);
    });
});
