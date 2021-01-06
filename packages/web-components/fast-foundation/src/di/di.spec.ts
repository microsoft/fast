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
} from "./di";
import chai, { expect } from "chai";
import spies from "chai-spies";

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
                @inject(Dep1) dep1,
                @inject(Dep2) dep2,
                @inject(Dep3) dep3
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

    // it(`can decorate properties explicitly`, function () {
    //     // @ts-ignore
    //     class Foo {
    //         @inject(Dep1) public dep1;
    //         @inject(Dep2) public dep2;
    //         @inject(Dep3) public dep3;
    //     }

    //     expect(DI.getDependencies(Foo)["dep1"]).eq(Dep1, `Foo['inject'].dep1`);
    //     expect(DI.getDependencies(Foo)["dep2"]).eq(Dep2, `Foo['inject'].dep2`);
    //     expect(DI.getDependencies(Foo)["dep3"]).eq(Dep3, `Foo['inject'].dep3`);
    // });

    // it(`cannot decorate properties implicitly`, function () {
    //     // @ts-ignore
    //     class Foo {
    //         @inject() public dep1: Dep1;
    //         @inject() public dep2: Dep2;
    //         @inject() public dep3: Dep3;
    //     }

    //     expect(DI.getDependencies(Foo)["dep1"]).eq(undefined, `Foo['inject'].dep1`);
    //     expect(DI.getDependencies(Foo)["dep2"]).eq(undefined, `Foo['inject'].dep2`);
    //     expect(DI.getDependencies(Foo)["dep3"]).eq(undefined, `Foo['inject'].dep3`);
    // });
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
                public bar;
                public baz;
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
            sut.register([{ register }, { register }] as any);

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
            sut.register([{ foo: { register } }, { foo: { register } }] as any);
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
            sut.register([{ register }, { foo: { register } }] as any);

            expect(register).to.have.been.first.called.with(sut);
            expect(register).to.have.been.second.called.with(sut);
        });

        it(`calls register() on [{register},{}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ register }, {}] as any);

            expect(register).to.have.been.first.called.with(sut);
        });

        it(`calls register() on [{},{register}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{}, { register }] as any);

            expect(register).to.have.been.first.called.with(sut);
        });

        it(`calls register() on [{foo:{register}},{foo:{}}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ foo: { register } }, { foo: {} }] as any);

            expect(register).to.have.been.first.called.with(sut);
        });

        it(`calls register() on [{foo:{}},{foo:{register}}]`, function () {
            const { sut, register } = createFixture();
            sut.register([{ foo: {} }, { foo: { register } }] as any);

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
        // for (const key of [null, undefined]) {
        //   it(_`throws on invalid key ${key}`, function () {
        //     const { sut } = createFixture();
        //     assert.throws(() => sut.registerTransformer(key, null as any), /key\/value cannot be null or undefined/, `() => sut.registerTransformer(key, null as any)`);
        //   });
        // }

        it(`registers the transformer if it does not exist yet`, function () {
            return;
        });

        it(`reuses the existing transformer if it exists`, function () {
            return;
        });
    });

    describe(`getResolver()`, function () {
        // for (const key of [null, undefined]) {
        //   it(_`throws on invalid key ${key}`, function () {
        //     const { sut } = createFixture();
        //     assert.throws(() => sut.getResolver(key, null as any), /key\/value cannot be null or undefined/, `() => sut.getResolver(key, null as any)`);
        //   });
        // }
    });

    describe(`has()`, function () {
        //   for (const key of [null, undefined, Object]) {
        //     it(_`returns false for non-existing key ${key}`, function () {
        //       assert.strictEqual(sut.has(key as any, false), false, `sut.has(key as any, false)`);
        //     });
        //   }
        //   it(`returns true for existing key`, function () {
        //     const key = {};
        //     sut.registerResolver(key, new Resolver(key, ResolverStrategy.instance, {}));
        //     assert.strictEqual(sut.has(key as any, false), true, `sut.has(key as any, false)`);
        //   });
    });

    describe(`get()`, function () {
        // for (const key of [null, undefined]) {
        //   it(_`throws on invalid key ${key}`, function () {
        //     const { sut } = createFixture();
        //     assert.throws(() => sut.get(key), /key\/value cannot be null or undefined/, `() => sut.get(key)`);
        //   });
        // }
    });

    describe(`getAll()`, function () {
        // for (const key of [null, undefined]) {
        //   it(_`throws on invalid key ${key}`, function () {
        //     const { sut } = createFixture();
        //     assert.throws(() => sut.getAll(key), /key\/value cannot be null or undefined/, `() => sut.getAll(key)`);
        //   });
        // }
    });

    describe(`getFactory()`, function () {
        //   for (const count of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        //     sut = new Container(); // ensure the state is reset (beforeEach doesn't know about loops)
        //     it(`returns a new Factory with ${count} deps if it does not exist`, function () {
        //       class Bar {}
        //       class Foo {public static inject = Array(count).map(c => Bar); }
        //       const actual = sut.getFactory(Foo);
        //       assert.instanceOf(actual, Factory, `actual`);
        //       assert.strictEqual(actual.Type, Foo, `actual.Type`);
        //       if (count < 6) {
        //         assert.strictEqual(actual['invoker'], classInvokers[count], `actual['invoker']`);
        //       } else {
        //         assert.strictEqual(actual['invoker'], fallbackInvoker, `actual['invoker']`);
        //       }
        //       assert.notStrictEqual(actual['dependencies'], Foo.inject, `actual['dependencies']`);
        //       assert.deepStrictEqual(actual['dependencies'], Foo.inject, `actual['dependencies']`);
        //     });
        //   }
        //   it(`reuses the existing factory if it already exists`, function () {
        //     const create = spy(Factory, 'create');
        //     class Foo {}
        //     const actual = sut.getFactory(Foo);
        //     assert.instanceOf(actual, Factory, `actual`);
        //     const actual2 = sut.getFactory(Foo);
        //     assert.strictEqual(actual, actual2, `actual`);
        //     expect(create).to.have.been.calledOnce;
        //     create.restore();
        //   });
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
