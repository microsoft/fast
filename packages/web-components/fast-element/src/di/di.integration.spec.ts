import { DI, Container, inject, Registration, singleton } from "./di.js";
import chai, { expect } from "chai";
import spies from "chai-spies";
import type { ContextDecorator } from "../context.js";

chai.use(spies);

describe("DI.singleton", function () {
    describe("registerInRequester", function () {
        class Foo {}
        const fooSelfRegister = DI.singleton(Foo, { scoped: true });

        it("root", function () {
            const root = DI.createContainer();
            const foo1 = root.get(fooSelfRegister);
            const foo2 = root.get(fooSelfRegister);

            expect(foo1).to.equal(foo2);
            expect(foo1).to.be.instanceOf(Foo);
        });

        it("children", function () {
            const root = DI.createContainer();
            const child1 = root.createChild();
            const child2 = root.createChild();
            const foo1 = child1.get(fooSelfRegister);
            const foo2 = child2.get(fooSelfRegister);

            expect(foo1).not.equal(foo2);
            expect(foo1).to.be.instanceOf(Foo);
            expect(foo2).to.be.instanceOf(Foo);
        });
    });
});

describe("DI.getDependencies", function () {
    it("string param", function () {
        @singleton
        class Foo {
            public constructor(@inject(String) public readonly test: string) {}
        }
        const actual = DI.getDependencies(Foo);
        expect(actual).to.eql([String]);
    });

    it("class param", function () {
        class Bar {}
        @singleton
        class Foo {
            public constructor(@inject(Bar) public readonly test: Bar) {}
        }
        const actual = DI.getDependencies(Foo);
        expect(actual).to.eql([Bar]);
    });
});

describe("DI.createContext() -> container.get()", function () {
    let container: Container;

    interface ITransient {}
    class Transient implements ITransient {}
    let ITransient: ContextDecorator<ITransient>;

    interface ISingleton {}
    class Singleton implements ISingleton {}
    let ISingleton: ContextDecorator<ISingleton>;

    interface IInstance {}
    class Instance implements IInstance {}
    let IInstance: ContextDecorator<IInstance>;
    let instance: Instance;

    interface ICallback {}
    class Callback implements ICallback {}
    let ICallback: ContextDecorator<ICallback>;

    interface ICachedCallback {}
    class CachedCallback implements ICachedCallback {}
    let ICachedCallback: ContextDecorator<ICachedCallback>;
    const cachedCallback = "cachedCallBack";
    let callbackCount = 0;
    function callbackToCache() {
        ++callbackCount;
        return new CachedCallback();
    }

    let callback: any;

    // eslint-disable-next-line mocha/no-hooks
    beforeEach(function () {
        callbackCount = 0;
        container = DI.createContainer();
        ITransient = DI.createContext<ITransient>("ITransient", x =>
            x.transient(Transient)
        );
        ISingleton = DI.createContext<ISingleton>("ISingleton", x =>
            x.singleton(Singleton)
        );
        instance = new Instance();
        IInstance = DI.createContext<IInstance>("IInstance", x => x.instance(instance));
        callback = chai.spy(() => new Callback());
        ICallback = DI.createContext<ICallback>("ICallback", x => x.callback(callback));
        ICachedCallback = DI.createContext<ICachedCallback>("ICachedCallback", x =>
            x.cachedCallback(callbackToCache)
        );
        chai.spy.on(container, "get");
    });

    describe("leaf", function () {
        it(`transient registration returns a new instance each time`, function () {
            const actual1 = container.get(ITransient);

            expect(actual1).to.be.instanceOf(Transient, `actual1`);

            const actual2 = container.get(ITransient);
            expect(actual2).to.be.instanceOf(Transient, `actual2`);

            expect(actual1).to.not.equal(actual2, `actual1`);

            expect(container.get).to.have.been.first.called.with(ITransient);
            expect(container.get).to.have.been.second.called.with(ITransient);
        });

        it(`singleton registration returns the same instance each time`, function () {
            const actual1 = container.get(ISingleton);
            expect(actual1).to.be.instanceOf(Singleton, `actual1`);

            const actual2 = container.get(ISingleton);
            expect(actual2).to.be.instanceOf(Singleton, `actual2`);

            expect(actual1).to.equal(actual2, `actual1`);

            expect(container.get).to.have.been.first.called.with(ISingleton);
            expect(container.get).to.have.been.second.called.with(ISingleton);
        });

        it(`instance registration returns the same instance each time`, function () {
            const actual1 = container.get(IInstance);
            expect(actual1).to.be.instanceOf(Instance, `actual1`);

            const actual2 = container.get(IInstance);
            expect(actual2).instanceOf(Instance, `actual2`);

            expect(actual1).equal(instance, `actual1`);
            expect(actual2).equal(instance, `actual2`);

            expect(container.get).to.have.been.first.called.with(IInstance);
            expect(container.get).to.have.been.second.called.with(IInstance);
        });

        it(`callback registration is invoked each time`, function () {
            const actual1 = container.get(ICallback);
            expect(actual1).instanceOf(Callback, `actual1`);

            const actual2 = container.get(ICallback);
            expect(actual2).instanceOf(Callback, `actual2`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(callback).to.have.been.first.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );
            expect(callback).to.have.been.second.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );

            expect(container.get).to.have.been.first.called.with(ICallback);
            expect(container.get).to.have.been.second.called.with(ICallback);
        });

        it(`cachedCallback registration is invoked once`, function () {
            container.register(
                Registration.cachedCallback(cachedCallback, callbackToCache)
            );
            const child = container.createChild();
            child.register(Registration.cachedCallback(cachedCallback, callbackToCache));
            const actual1 = container.get(cachedCallback);
            const actual2 = container.get(cachedCallback);

            expect(callbackCount).equal(1, `only called once`);
            expect(actual2).equal(actual1, `getting from the same container`);

            const actual3 = child.get(cachedCallback);
            expect(actual3).not.equal(actual1, `get from child that has new resolver`);
        });

        it(`cacheCallback multiple root containers`, function () {
            const container0 = DI.createContainer();
            const container1 = DI.createContainer();
            container0.register(
                Registration.cachedCallback(cachedCallback, callbackToCache)
            );
            container1.register(
                Registration.cachedCallback(cachedCallback, callbackToCache)
            );

            const actual11 = container0.get(cachedCallback);
            const actual12 = container0.get(cachedCallback);

            expect(callbackCount).equal(1, "one callback");
            expect(actual11).equal(actual12);

            const actual21 = container1.get(cachedCallback);
            const actual22 = container1.get(cachedCallback);

            expect(callbackCount).equal(2);
            expect(actual21).equal(actual22);
        });

        it(`cacheCallback shared registration`, function () {
            const reg = Registration.cachedCallback(cachedCallback, callbackToCache);
            const container0 = DI.createContainer();
            const container1 = DI.createContainer();
            container0.register(reg);
            container1.register(reg);

            const actual11 = container0.get(cachedCallback);
            const actual12 = container0.get(cachedCallback);

            expect(callbackCount).equal(1);
            expect(actual11).equal(actual12);

            const actual21 = container1.get(cachedCallback);
            const actual22 = container1.get(cachedCallback);

            expect(callbackCount).equal(1);
            expect(actual21).equal(actual22);
            expect(actual11).equal(actual21);
        });

        it(`cachedCallback registration on interface is invoked once`, function () {
            const actual1 = container.get(ICachedCallback);
            const actual2 = container.get(ICachedCallback);

            expect(callbackCount).equal(1, `only called once`);
            expect(actual2).equal(actual1, `getting from the same container`);
        });

        it(`cacheCallback interface multiple root containers`, function () {
            const container0 = DI.createContainer();
            const container1 = DI.createContainer();
            const actual11 = container0.get(ICachedCallback);
            const actual12 = container0.get(ICachedCallback);

            expect(callbackCount).equal(1);
            expect(actual11).equal(actual12);

            const actual21 = container1.get(ICachedCallback);
            const actual22 = container1.get(ICachedCallback);

            expect(callbackCount).equal(2);
            expect(actual21).equal(actual22);
        });

        it(`ContextDecorator alias to transient registration returns a new instance each time`, function () {
            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x =>
                x.aliasTo(ITransient)
            );

            const actual1 = container.get(IAlias);
            expect(actual1).instanceOf(Transient, `actual1`);

            const actual2 = container.get(IAlias);
            expect(actual2).instanceOf(Transient, `actual2`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(container.get).to.have.been.first.called.with(IAlias);
            expect(container.get).to.have.been.second.called.with(ITransient);
            expect(container.get).to.have.been.third.called.with(IAlias);
            expect(container.get).to.have.been.nth(4).called.with(ITransient);
        });

        it(`ContextDecorator alias to singleton registration returns the same instance each time`, function () {
            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x =>
                x.aliasTo(ISingleton)
            );

            const actual1 = container.get(IAlias);
            expect(actual1).instanceOf(Singleton, `actual1`);

            const actual2 = container.get(IAlias);
            expect(actual2).instanceOf(Singleton, `actual2`);

            expect(actual1).equal(actual2, `actual1`);

            expect(container.get).to.have.been.first.called.with(IAlias);
            expect(container.get).to.have.been.second.called.with(ISingleton);
            expect(container.get).to.have.been.third.called.with(IAlias);
            expect(container.get).to.have.been.nth(4).called.with(ISingleton);
        });

        it(`ContextDecorator alias to instance registration returns the same instance each time`, function () {
            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x =>
                x.aliasTo(IInstance)
            );

            const actual1 = container.get(IAlias);
            expect(actual1).instanceOf(Instance, `actual1`);

            const actual2 = container.get(IAlias);
            expect(actual2).instanceOf(Instance, `actual2`);

            expect(actual1).equal(instance, `actual1`);
            expect(actual2).equal(instance, `actual2`);

            expect(container.get).to.have.been.first.called.with(IAlias);
            expect(container.get).to.have.been.second.called.with(IInstance);
            expect(container.get).to.have.been.third.called.with(IAlias);
            expect(container.get).to.have.been.nth(4).called.with(IInstance);
        });

        // TODO: make test work
        it(`ContextDecorator alias to callback registration is invoked each time`, function () {
            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x =>
                x.aliasTo(ICallback)
            );

            const actual1 = container.get(IAlias);
            expect(actual1).instanceOf(Callback, `actual1`);

            const actual2 = container.get(IAlias);
            expect(actual2).instanceOf(Callback, `actual2`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(callback).to.have.been.first.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );
            expect(callback).to.have.been.second.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );

            expect(container.get).to.have.been.first.called.with(IAlias);
            expect(container.get).to.have.been.second.called.with(ICallback);
            expect(container.get).to.have.been.third.called.with(IAlias);
            expect(container.get).to.have.been.nth(4).called.with(ICallback);
        });

        it(`string alias to transient registration returns a new instance each time`, function () {
            container.register(Registration.aliasTo(ITransient, "alias"));

            const actual1 = container.get("alias");
            expect(actual1).instanceOf(Transient, `actual1`);

            const actual2 = container.get("alias");
            expect(actual2).instanceOf(Transient, `actual2`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(container.get).to.have.been.first.called.with("alias");
            expect(container.get).to.have.been.second.called.with(ITransient);
            expect(container.get).to.have.been.third.called.with("alias");
            expect(container.get).to.have.been.nth(4).called.with(ITransient);
        });

        it(`string alias to singleton registration returns the same instance each time`, function () {
            container.register(Registration.aliasTo(ISingleton, "alias"));

            const actual1 = container.get("alias");
            expect(actual1).instanceOf(Singleton, `actual1`);

            const actual2 = container.get("alias");
            expect(actual2).instanceOf(Singleton, `actual2`);

            expect(actual1).equal(actual2, `actual1`);

            expect(container.get).to.have.been.first.called.with("alias");
            expect(container.get).to.have.been.second.called.with(ISingleton);
            expect(container.get).to.have.been.third.called.with("alias");
            expect(container.get).to.have.been.nth(4).called.with(ISingleton);
        });

        it(`string alias to instance registration returns the same instance each time`, function () {
            container.register(Registration.aliasTo(IInstance, "alias"));

            const actual1 = container.get("alias");
            expect(actual1).instanceOf(Instance, `actual1`);

            const actual2 = container.get("alias");
            expect(actual2).instanceOf(Instance, `actual2`);

            expect(actual1).equal(instance, `actual1`);
            expect(actual2).equal(instance, `actual2`);

            expect(container.get).to.have.been.first.called.with("alias");
            expect(container.get).to.have.been.second.called.with(IInstance);
            expect(container.get).to.have.been.third.called.with("alias");
            expect(container.get).to.have.been.nth(4).called.with(IInstance);
        });

        it(`string alias to callback registration is invoked each time`, function () {
            container.register(Registration.aliasTo(ICallback, "alias"));

            const actual1 = container.get("alias");
            expect(actual1).instanceOf(Callback, `actual1`);

            const actual2 = container.get("alias");
            expect(actual2).instanceOf(Callback, `actual2`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(callback).to.have.been.first.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );
            expect(callback).to.have.been.second.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );

            expect(container.get).to.have.been.first.called.with("alias");
            expect(container.get).to.have.been.second.called.with(ICallback);
            expect(container.get).to.have.been.third.called.with("alias");
            expect(container.get).to.have.been.nth(4).called.with(ICallback);
        });
    });

    describe("transient parent", function () {
        interface ITransientParent {
            dep: any;
        }
        let ITransientParent: ContextDecorator<ITransientParent>;

        function register(cls: any) {
            ITransientParent = DI.createContext<ITransientParent>(
                "ITransientParent",
                x => x.transient(cls)
            );
        }

        it(`transient child registration returns a new instance each time`, function () {
            @inject(ITransient)
            class TransientParent implements ITransientParent {
                public constructor(public dep: ITransient) {}
            }
            register(TransientParent);

            const actual1 = container.get(ITransientParent);
            expect(actual1).instanceOf(TransientParent, `actual1`);
            expect(actual1.dep).instanceOf(Transient, `actual1.dep`);

            const actual2 = container.get(ITransientParent);
            expect(actual2).instanceOf(TransientParent, `actual2`);
            expect(actual2.dep).instanceOf(Transient, `actual2.dep`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(actual1.dep).not.equal(actual2.dep, `actual1.dep`);

            expect(container.get).to.have.been.first.called.with(ITransientParent);
            expect(container.get).to.have.been.second.called.with(ITransient);
            expect(container.get).to.have.been.third.called.with(ITransientParent);
            expect(container.get).to.have.been.nth(4).called.with(ITransient);
        });

        it(`singleton child registration returns the same instance each time`, function () {
            @inject(ISingleton)
            class TransientParent implements ITransientParent {
                public constructor(public dep: ISingleton) {}
            }
            register(TransientParent);

            const actual1 = container.get(ITransientParent);
            expect(actual1).instanceOf(TransientParent, `actual1`);
            expect(actual1.dep).instanceOf(Singleton, `actual1.dep`);

            const actual2 = container.get(ITransientParent);
            expect(actual2).instanceOf(TransientParent, `actual2`);
            expect(actual2.dep).instanceOf(Singleton, `actual2.dep`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);

            expect(container.get).to.have.been.first.called.with(ITransientParent);
            expect(container.get).to.have.been.second.called.with(ISingleton);
            expect(container.get).to.have.been.third.called.with(ITransientParent);
            expect(container.get).to.have.been.nth(4).called.with(ISingleton);
        });

        it(`instance child registration returns the same instance each time`, function () {
            @inject(IInstance)
            class TransientParent implements ITransientParent {
                public constructor(public dep: IInstance) {}
            }
            register(TransientParent);

            const actual1 = container.get(ITransientParent);
            expect(actual1).instanceOf(TransientParent, `actual1`);
            expect(actual1.dep).instanceOf(Instance, `actual1.dep`);

            const actual2 = container.get(ITransientParent);
            expect(actual2).instanceOf(TransientParent, `actual2`);
            expect(actual2.dep).instanceOf(Instance, `actual2.dep`);

            expect(actual1).not.equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);

            expect(container.get).to.have.been.first.called.with(ITransientParent);
            expect(container.get).to.have.been.second.called.with(IInstance);
            expect(container.get).to.have.been.third.called.with(ITransientParent);
            expect(container.get).to.have.been.nth(4).called.with(IInstance);
        });

        it(`callback child registration is invoked each time`, function () {
            @inject(ICallback)
            class TransientParent implements ITransientParent {
                public constructor(public dep: ICallback) {}
            }
            register(TransientParent);

            const actual1 = container.get(ITransientParent);
            expect(actual1).instanceOf(TransientParent, `actual1`);
            expect(actual1.dep).instanceOf(Callback, `actual1.dep`);

            const actual2 = container.get(ITransientParent);
            expect(actual2).instanceOf(TransientParent, `actual2`);
            expect(actual2.dep).instanceOf(Callback, `actual2.dep`);

            expect(actual1).not.equal(actual2, `actual1`);
            expect(actual1.dep).not.equal(actual2.dep, `actual1.dep`);

            expect(callback).to.have.been.first.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );
            expect(callback).to.have.been.second.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );

            expect(container.get).to.have.been.first.called.with(ITransientParent);
            expect(container.get).to.have.been.second.called.with(ICallback);
            expect(container.get).to.have.been.third.called.with(ITransientParent);
            expect(container.get).to.have.been.nth(4).called.with(ICallback);
        });
    });

    describe("singleton parent", function () {
        interface ISingletonParent {
            dep: any;
        }
        let ISingletonParent: ContextDecorator<ISingletonParent>;

        function register(cls: any) {
            ISingletonParent = DI.createContext<ISingletonParent>(
                "ISingletonParent",
                x => x.singleton(cls)
            );
        }

        it(`transient child registration is reused by the singleton parent`, function () {
            @inject(ITransient)
            class SingletonParent implements ISingletonParent {
                public constructor(public dep: ITransient) {}
            }
            register(SingletonParent);

            const actual1 = container.get(ISingletonParent);
            expect(actual1).instanceOf(SingletonParent, `actual1`);
            expect(actual1.dep).instanceOf(Transient, `actual1.dep`);

            const actual2 = container.get(ISingletonParent);
            expect(actual2).instanceOf(SingletonParent, `actual2`);
            expect(actual2.dep).instanceOf(Transient, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);

            expect(container.get).to.have.been.first.called.with(ISingletonParent);
            expect(container.get).to.have.been.second.called.with(ITransient);
            expect(container.get).to.have.been.third.called.with(ISingletonParent);
        });

        it(`singleton registration is reused by the singleton parent`, function () {
            @inject(ISingleton)
            class SingletonParent implements ISingletonParent {
                public constructor(public dep: ISingleton) {}
            }
            register(SingletonParent);

            const actual1 = container.get(ISingletonParent);
            expect(actual1).instanceOf(SingletonParent, `actual1`);
            expect(actual1.dep).instanceOf(Singleton, `actual1.dep`);

            const actual2 = container.get(ISingletonParent);
            expect(actual2).instanceOf(SingletonParent, `actual2`);
            expect(actual2.dep).instanceOf(Singleton, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);

            expect(container.get).to.have.been.first.called.with(ISingletonParent);
            expect(container.get).to.have.been.second.called.with(ISingleton);
            expect(container.get).to.have.been.third.called.with(ISingletonParent);
        });

        it(`instance registration is reused by the singleton parent`, function () {
            @inject(IInstance)
            class SingletonParent implements ISingletonParent {
                public constructor(public dep: IInstance) {}
            }
            register(SingletonParent);

            const actual1 = container.get(ISingletonParent);
            expect(actual1).instanceOf(SingletonParent, `actual1`);
            expect(actual1.dep).instanceOf(Instance, `actual1.dep`);

            const actual2 = container.get(ISingletonParent);
            expect(actual2).instanceOf(SingletonParent, `actual2`);
            expect(actual2.dep).instanceOf(Instance, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);

            expect(container.get).to.have.been.first.called.with(ISingletonParent);
            expect(container.get).to.have.been.second.called.with(IInstance);
            expect(container.get).to.have.been.third.called.with(ISingletonParent);
        });

        it(`callback registration is reused by the singleton parent`, function () {
            @inject(ICallback)
            class SingletonParent implements ISingletonParent {
                public constructor(public dep: ICallback) {}
            }
            register(SingletonParent);

            const actual1 = container.get(ISingletonParent);
            expect(actual1).instanceOf(SingletonParent, `actual1`);
            expect(actual1.dep).instanceOf(Callback, `actual1.dep`);

            const actual2 = container.get(ISingletonParent);
            expect(actual2).instanceOf(SingletonParent, `actual2`);
            expect(actual2.dep).instanceOf(Callback, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);
            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);

            expect(callback).to.have.been.first.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );

            expect(container.get).to.have.been.first.called.with(ISingletonParent);
            expect(container.get).to.have.been.second.called.with(ICallback);
            expect(container.get).to.have.been.third.called.with(ISingletonParent);
        });
    });

    describe("instance parent", function () {
        interface IInstanceParent {
            dep: any;
        }
        let IInstanceParent: ContextDecorator<IInstanceParent>;
        let instanceParent: IInstanceParent;

        function register(cls: any) {
            instanceParent = container.get(cls);
            IInstanceParent = DI.createContext<IInstanceParent>("IInstanceParent", x =>
                x.instance(instanceParent)
            );
        }

        it(`transient registration is reused by the instance parent`, function () {
            @inject(ITransient)
            class InstanceParent implements IInstanceParent {
                public constructor(public dep: ITransient) {}
            }
            register(InstanceParent);

            const actual1 = container.get(IInstanceParent);
            expect(actual1).instanceOf(InstanceParent, `actual1`);
            expect(actual1.dep).instanceOf(Transient, `actual1.dep`);

            const actual2 = container.get(IInstanceParent);
            expect(actual2).instanceOf(InstanceParent, `actual2`);
            expect(actual2.dep).instanceOf(Transient, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);
        });

        it(`singleton registration is reused by the instance parent`, function () {
            @inject(ISingleton)
            class InstanceParent implements IInstanceParent {
                public constructor(public dep: ISingleton) {}
            }
            register(InstanceParent);

            const actual1 = container.get(IInstanceParent);
            expect(actual1).instanceOf(InstanceParent, `actual1`);
            expect(actual1.dep).instanceOf(Singleton, `actual1.dep`);

            const actual2 = container.get(IInstanceParent);
            expect(actual2).instanceOf(InstanceParent, `actual2`);
            expect(actual2.dep).instanceOf(Singleton, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);
        });

        it(`instance registration is reused by the instance parent`, function () {
            @inject(IInstance)
            class InstanceParent implements IInstanceParent {
                public constructor(public dep: IInstance) {}
            }
            register(InstanceParent);

            const actual1 = container.get(IInstanceParent);
            expect(actual1).instanceOf(InstanceParent, `actual1`);
            expect(actual1.dep).instanceOf(Instance, `actual1.dep`);

            const actual2 = container.get(IInstanceParent);
            expect(actual2).instanceOf(InstanceParent, `actual2`);
            expect(actual2.dep).instanceOf(Instance, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);

            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);
        });

        it(`callback registration is reused by the instance parent`, function () {
            @inject(ICallback)
            class InstanceParent implements IInstanceParent {
                public constructor(public dep: ICallback) {}
            }
            register(InstanceParent);

            const actual1 = container.get(IInstanceParent);
            expect(actual1).instanceOf(InstanceParent, `actual1`);
            expect(actual1.dep).instanceOf(Callback, `actual1.dep`);

            const actual2 = container.get(IInstanceParent);
            expect(actual2).instanceOf(InstanceParent, `actual2`);
            expect(actual2.dep).instanceOf(Callback, `actual2.dep`);

            expect(actual1).equal(actual2, `actual1`);
            expect(actual1.dep).equal(actual2.dep, `actual1.dep`);

            expect(callback).to.have.been.first.called.with(
                container,
                container,
                container.getResolver(ICallback)
            );
        });
    });
});
