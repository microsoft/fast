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
import {
    ContainerImpl,
    DI,
    FactoryImpl,
    inject,
    Registration,
    ResolverImpl,
    singleton,
    transient,
} from "./di";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { customElement, FASTElement, html, ref } from "@microsoft/fast-element";
chai.use(spies);
function decorator() {
    return target => target;
}
function simulateTSCompilerDesignParamTypes(target, deps) {
    Reflect.defineMetadata("design:paramtypes", deps, target);
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
    describe(`findResponsibleContainer()`, function () {
        it(`finds the parent by default`, function () {
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);
            const parentContainer = DI.getOrCreateDOMContainer(parent);
            const childContainer = DI.getOrCreateDOMContainer(child);
            expect(DI.findResponsibleContainer(child)).equal(parentContainer);
        });
        it(`finds the host for a shadowed element by default`, function () {
            let TestChild = class TestChild extends FASTElement {};
            TestChild = __decorate([customElement({ name: "test-child" })], TestChild);
            let TestParent = class TestParent extends FASTElement {};
            TestParent = __decorate(
                [
                    customElement({
                        name: "test-parent",
                        template: html`
                            <test-child ${ref("child")}></test-child>
                        `,
                    }),
                ],
                TestParent
            );
            const parent = document.createElement("test-parent");
            document.body.appendChild(parent);
            const child = parent.child;
            const parentContainer = DI.getOrCreateDOMContainer(parent);
            expect(DI.findResponsibleContainer(child)).equal(parentContainer);
        });
        it(`uses the owner when specified at creation time`, function () {
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);
            const parentContainer = DI.getOrCreateDOMContainer(parent);
            const childContainer = DI.getOrCreateDOMContainer(child, {
                responsibleForOwnerRequests: true,
            });
            expect(DI.findResponsibleContainer(child)).equal(childContainer);
        });
    });
    describe(`getDependencies()`, function () {
        it(`throws when inject is not an array`, function () {
            class Bar {}
            class Foo {}
            Foo.inject = Bar;
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
                class Foo {}
                Foo.inject = deps.slice();
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
                class Foo {}
                Foo.inject = deps.slice();
                class Bar extends Foo {}
                Bar.inject = deps.slice();
                const actual = DI.getDependencies(Bar);
                expect(actual).eql(deps, `actual`);
            });
            it(`does not traverse the 3-layer prototype chain for inject array ${deps}`, function () {
                class Foo {}
                Foo.inject = deps.slice();
                class Bar extends Foo {}
                Bar.inject = deps.slice();
                class Baz extends Bar {}
                Baz.inject = deps.slice();
                const actual = DI.getDependencies(Baz);
                expect(actual).eql(deps, `actual`);
            });
            it(`does not traverse the 1-layer + 2-layer prototype chain (with gap) for inject array ${deps}`, function () {
                class Foo {}
                Foo.inject = deps.slice();
                class Bar extends Foo {}
                class Baz extends Bar {}
                Baz.inject = deps.slice();
                class Qux extends Baz {}
                Qux.inject = deps.slice();
                const actual = DI.getDependencies(Qux);
                expect(actual).eql(deps, `actual`);
            });
        }
    });
    describe(`createInterface()`, function () {
        it(`returns a function that stringifies its default friendly name`, function () {
            const sut = DI.createInterface();
            const expected = "InterfaceSymbol<(anonymous)>";
            expect(sut.toString()).equal(expected, `sut.toString() === '${expected}'`);
            expect(String(sut)).equal(expected, `String(sut) === '${expected}'`);
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            expect(`${sut}`).equal(expected, `\`\${sut}\` === '${expected}'`);
        });
        it(`returns a function that stringifies its configured friendly name`, function () {
            const sut = DI.createInterface("IFoo");
            const expected = "InterfaceSymbol<IFoo>";
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
        let Foo = class Foo {};
        Foo = __decorate([inject(Dep1, Dep2, Dep3)], Foo);
        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3], `Foo['inject']`);
    });
    it(`can decorate classes with implicit dependencies`, function () {
        let Foo = class Foo {
            constructor(dep1, dep2, dep3) {
                return;
            }
        };
        Foo = __decorate([inject()], Foo);
        simulateTSCompilerDesignParamTypes(Foo, [Dep1, Dep2, Dep3]);
        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3]);
    });
    it(`can decorate constructor parameters explicitly`, function () {
        let Foo = class Foo {
            constructor(dep1, dep2, dep3) {
                return;
            }
        };
        Foo = __decorate(
            [
                __param(0, inject(Dep1)),
                __param(1, inject(Dep2)),
                __param(2, inject(Dep3)),
            ],
            Foo
        );
        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3], `Foo['inject']`);
    });
    it(`can decorate constructor parameters implicitly`, function () {
        let Foo = class Foo {
            constructor(dep1, dep2, dep3) {
                return;
            }
        };
        Foo = __decorate(
            [__param(0, inject()), __param(1, inject()), __param(2, inject())],
            Foo
        );
        simulateTSCompilerDesignParamTypes(Foo, [Dep1, Dep2, Dep3]);
        expect(DI.getDependencies(Foo)).deep.eq([Dep1, Dep2, Dep3]);
    });
    it(`can decorate properties explicitly`, function () {
        // @ts-ignore
        class Foo {}
        __decorate([inject(Dep1)], Foo.prototype, "dep1", void 0);
        __decorate([inject(Dep2)], Foo.prototype, "dep2", void 0);
        __decorate([inject(Dep3)], Foo.prototype, "dep3", void 0);
        const instance = new Foo();
        expect(instance.dep1).instanceof(Dep1);
        expect(instance.dep2).instanceof(Dep2);
        expect(instance.dep3).instanceof(Dep3);
    });
});
describe(`The transient decorator`, function () {
    it(`works as a plain decorator`, function () {
        let Foo = class Foo {};
        Foo = __decorate([transient], Foo);
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).not.eq(foo2, `foo1`);
    });
    it(`works as an invocation`, function () {
        let Foo = class Foo {};
        Foo = __decorate([transient()], Foo);
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).not.eq(foo2, `foo1`);
    });
});
describe(`The singleton decorator`, function () {
    it(`works as a plain decorator`, function () {
        let Foo = class Foo {};
        Foo = __decorate([singleton], Foo);
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).eq(foo2, `foo1`);
    });
    it(`works as an invocation`, function () {
        let Foo = class Foo {};
        Foo = __decorate([singleton()], Foo);
        expect(Foo["register"]).instanceOf(Function, `Foo['register']`);
        const container = DI.createContainer();
        const foo1 = container.get(Foo);
        const foo2 = container.get(Foo);
        expect(foo1).eq(foo2, `foo1`);
    });
});
describe(`The Resolver class`, function () {
    let container;
    beforeEach(function () {
        container = DI.createContainer();
        chai.spy.on(container, "registerResolver");
    });
    describe(`register()`, function () {
        it(`registers the resolver to the container with the provided key`, function () {
            const sut = new ResolverImpl("foo", 0, null);
            sut.register(container, "bar");
            expect(container.registerResolver).called.with("bar", sut);
        });
        it(`registers the resolver to the container with its own`, function () {
            const sut = new ResolverImpl("foo", 0, null);
            sut.register(container);
            expect(container.registerResolver).called.with("foo", sut);
        });
    });
    describe(`resolve()`, function () {
        it(`instance - returns state`, function () {
            const state = {};
            const sut = new ResolverImpl("foo", 0 /* instance */, state);
            const actual = sut.resolve(container, container);
            expect(actual).eq(state, `actual`);
        });
        it(`singleton - returns an instance of the type and sets strategy to instance`, function () {
            class Foo {}
            const sut = new ResolverImpl("foo", 1 /* singleton */, Foo);
            const actual = sut.resolve(container, container);
            expect(actual).instanceOf(Foo, `actual`);
            const actual2 = sut.resolve(container, container);
            expect(actual2).eq(actual, `actual2`);
        });
        it(`transient - always returns a new instance of the type`, function () {
            class Foo {}
            const sut = new ResolverImpl("foo", 2 /* transient */, Foo);
            const actual1 = sut.resolve(container, container);
            expect(actual1).instanceOf(Foo, `actual1`);
            const actual2 = sut.resolve(container, container);
            expect(actual2).instanceOf(Foo, `actual2`);
            expect(actual2).not.eq(actual1, `actual2`);
        });
        it(`array - calls resolve() on the first item in the state array`, function () {
            const resolver = { resolve: chai.spy() };
            const sut = new ResolverImpl("foo", 4 /* array */, [resolver]);
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
            const sut = new ResolverImpl(Foo, 1 /* singleton */, Foo);
            const actual = sut.getFactory(container);
            expect(actual).instanceOf(FactoryImpl, `actual`);
            expect(actual.Type).eq(Foo, `actual.Type`);
        });
        it(`returns a new transient Factory if it does not exist`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, 2 /* transient */, Foo);
            const actual = sut.getFactory(container);
            expect(actual).instanceOf(FactoryImpl, `actual`);
            expect(actual.Type).eq(Foo, `actual.Type`);
        });
        it(`returns a null for instance strategy`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, 0 /* instance */, Foo);
            const actual = sut.getFactory(container);
            expect(actual).eq(null, `actual`);
        });
        it(`returns a null for array strategy`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, 4 /* array */, Foo);
            const actual = sut.getFactory(container);
            expect(actual).eq(null, `actual`);
        });
        it(`returns the alias resolved factory for alias strategy`, function () {
            class Foo {}
            class Bar {}
            const sut = new ResolverImpl(Foo, 5 /* alias */, Bar);
            const actual = sut.getFactory(container);
            expect(actual.Type).eq(Bar, `actual`);
        });
        it(`returns a null for callback strategy`, function () {
            class Foo {}
            const sut = new ResolverImpl(Foo, 3 /* callback */, Foo);
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
                        constructor(...args) {
                            this.args = args;
                        }
                    }
                    Foo.inject = Array(staticCount).fill(Bar);
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
                            dynamicDeps[i],
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
            class Foo {}
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
        return { sut, register };
    }
    describe(`register()`, function () {
        it(`calls register() on {register}`, function () {
            const { sut, register } = createFixture();
            sut.register({ register });
            expect(register).called.with(sut);
        });
        it(`calls register() on {register},{register}`, function () {
            const { sut, register } = createFixture();
            sut.register({ register }, { register });
            expect(register).to.have.been.first.called.with(sut);
            expect(register).to.have.been.second.called.with(sut);
        });
        it(`calls register() on [{register},{register}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ register }, { register }]);
            expect(register).to.have.been.first.called.with(sut);
            expect(register).to.have.been.second.called.with(sut);
        });
        it(`calls register() on {foo:{register}}`, function () {
            const { sut, register } = createFixture();
            sut.register({ foo: { register } });
            expect(register).to.have.been.first.called.with(sut);
        });
        it(`calls register() on {foo:{register}},{foo:{register}}`, function () {
            const { sut, register } = createFixture();
            sut.register({ foo: { register } }, { foo: { register } });
            expect(register).to.have.been.first.called.with(sut);
            expect(register).to.have.been.second.called.with(sut);
        });
        it(`calls register() on [{foo:{register}},{foo:{register}}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ foo: { register } }, { foo: { register } }]);
            expect(register).to.have.been.first.called.with(sut);
            expect(register).to.have.been.second.called.with(sut);
        });
        it(`calls register() on {register},{foo:{register}}`, function () {
            const { sut, register } = createFixture();
            sut.register({ register }, { foo: { register } });
            expect(register).to.have.been.first.called.with(sut);
            expect(register).to.have.been.second.called.with(sut);
        });
        it(`calls register() on [{register},{foo:{register}}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ register }, { foo: { register } }]);
            expect(register).to.have.been.first.called.with(sut);
            expect(register).to.have.been.second.called.with(sut);
        });
        it(`calls register() on [{register},{}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ register }, {}]);
            expect(register).to.have.been.first.called.with(sut);
        });
        it(`calls register() on [{},{register}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{}, { register }]);
            expect(register).to.have.been.first.called.with(sut);
        });
        it(`calls register() on [{foo:{register}},{foo:{}}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ foo: { register } }, { foo: {} }]);
            expect(register).to.have.been.first.called.with(sut);
        });
        it(`calls register() on [{foo:{}},{foo:{register}}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ foo: {} }, { foo: { register } }]);
            expect(register).to.have.been.first.called.with(sut);
        });
        describe(`does NOT throw when attempting to register primitive values`, function () {
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
                it(`{foo:${String(value)}}`, function () {
                    const { sut } = createFixture();
                    sut.register({ foo: value });
                });
                it(`{foo:{bar:${String(value)}}}`, function () {
                    const { sut } = createFixture();
                    sut.register({ foo: { bar: value } });
                });
                it(`[${String(value)}]`, function () {
                    const { sut } = createFixture();
                    sut.register([value]);
                });
                it(`${String(value)}`, function () {
                    const { sut } = createFixture();
                    sut.register(value);
                });
            }
        });
    });
    describe(`registerResolver()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.registerResolver(key, null)).throws();
            });
        }
        it(`registers the resolver if it does not exist yet`, function () {
            const { sut } = createFixture();
            const key = {};
            const resolver = new ResolverImpl(key, 0 /* instance */, {});
            sut.registerResolver(key, resolver);
            const actual = sut.getResolver(key);
            expect(actual).eql(resolver, `actual`);
        });
        it(`changes to array resolver if the key already exists`, function () {
            const { sut } = createFixture();
            const key = {};
            const resolver1 = new ResolverImpl(key, 0 /* instance */, {});
            const resolver2 = new ResolverImpl(key, 0 /* instance */, {});
            sut.registerResolver(key, resolver1);
            const actual1 = sut.getResolver(key);
            expect(actual1).eql(resolver1, `actual1`);
            sut.registerResolver(key, resolver2);
            const actual2 = sut.getResolver(key);
            expect(actual2).not.eql(actual1, `actual2`);
            expect(actual2).not.eql(resolver1, `actual2`);
            expect(actual2).not.eql(resolver2, `actual2`);
            expect(actual2["strategy"]).eql(4 /* array */, `actual2['strategy']`);
            expect(actual2["state"][0]).eql(resolver1, `actual2['state'][0]`);
            expect(actual2["state"][1]).eql(resolver2, `actual2['state'][1]`);
        });
        it(`appends to the array resolver if the key already exists more than once`, function () {
            const { sut } = createFixture();
            const key = {};
            const resolver1 = new ResolverImpl(key, 0 /* instance */, {});
            const resolver2 = new ResolverImpl(key, 0 /* instance */, {});
            const resolver3 = new ResolverImpl(key, 0 /* instance */, {});
            sut.registerResolver(key, resolver1);
            sut.registerResolver(key, resolver2);
            sut.registerResolver(key, resolver3);
            const actual1 = sut.getResolver(key);
            expect(actual1["strategy"]).eql(4 /* array */, `actual1['strategy']`);
            expect(actual1["state"][0]).eql(resolver1, `actual1['state'][0]`);
            expect(actual1["state"][1]).eql(resolver2, `actual1['state'][1]`);
            expect(actual1["state"][2]).eql(resolver3, `actual1['state'][2]`);
        });
    });
    describe(`registerTransformer()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.registerTransformer(key, null)).throws();
            });
        }
    });
    describe(`getResolver()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.getResolver(key, null)).throws();
            });
        }
    });
    describe(`has()`, function () {
        for (const key of [null, undefined, Object]) {
            it(`returns false for non-existing key ${key}`, function () {
                const { sut } = createFixture();
                expect(sut.has(key, false)).eql(false, `sut.has(key as any, false)`);
            });
        }
        it(`returns true for existing key`, function () {
            const { sut } = createFixture();
            const key = {};
            sut.registerResolver(key, new ResolverImpl(key, 0 /* instance */, {}));
            expect(sut.has(key, false)).eql(true, `sut.has(key as any, false)`);
        });
    });
    describe(`get()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.get(key)).throws();
            });
        }
    });
    describe(`getAll()`, function () {
        for (const key of [null, undefined]) {
            it(`throws on invalid key ${key}`, function () {
                const { sut } = createFixture();
                expect(() => sut.getAll(key)).throws();
            });
        }
    });
    describe(`getFactory()`, function () {
        for (const count of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            const sut = DI.createContainer();
            it(`returns a new Factory with ${count} deps if it does not exist`, function () {
                class Bar {}
                class Foo {}
                Foo.inject = Array(count).map(c => Bar);
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
        expect(actual["strategy"]).eq(0 /* instance */, `actual['strategy']`);
        expect(actual["state"]).eq(value, `actual['state']`);
    });
    it(`singleton() returns the correct resolver`, function () {
        class Foo {}
        const actual = Registration.singleton("key", Foo);
        expect(actual["key"]).eq("key", `actual['key']`);
        expect(actual["strategy"]).eq(1 /* singleton */, `actual['strategy']`);
        expect(actual["state"]).eq(Foo, `actual['state']`);
    });
    it(`transient() returns the correct resolver`, function () {
        class Foo {}
        const actual = Registration.transient("key", Foo);
        expect(actual["key"]).eq("key", `actual['key']`);
        expect(actual["strategy"]).eq(2 /* transient */, `actual['strategy']`);
        expect(actual["state"]).eq(Foo, `actual['state']`);
    });
    it(`callback() returns the correct resolver`, function () {
        const callback = () => {
            return;
        };
        const actual = Registration.callback("key", callback);
        expect(actual["key"]).eq("key", `actual['key']`);
        expect(actual["strategy"]).eq(3 /* callback */, `actual['strategy']`);
        expect(actual["state"]).eq(callback, `actual['state']`);
    });
    it(`alias() returns the correct resolver`, function () {
        const actual = Registration.aliasTo("key", "key2");
        expect(actual["key"]).eq("key2", `actual['key']`);
        expect(actual["strategy"]).eq(5 /* alias */, `actual['strategy']`);
        expect(actual["state"]).eq("key", `actual['state']`);
    });
});
