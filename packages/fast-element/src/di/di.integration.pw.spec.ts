import { expect, test } from "@playwright/test";
import { DI, inject, Registration, singleton } from "./di.js";

test.describe("DI.singleton", () => {
    test.describe("registerInRequester", () => {
        test("root", async () => {
            class Foo {}
            const fooSelfRegister = DI.singleton(Foo, { scoped: true });

            const root = DI.createContainer();
            const foo1 = root.get(fooSelfRegister);
            const foo2 = root.get(fooSelfRegister);

            expect(foo1 === foo2).toBe(true);
            expect(foo1 instanceof Foo).toBe(true);
        });

        test("children", async () => {
            class Foo {}
            const fooSelfRegister = DI.singleton(Foo, { scoped: true });

            const root = DI.createContainer();
            const child1 = root.createChild();
            const child2 = root.createChild();
            const foo1 = child1.get(fooSelfRegister);
            const foo2 = child2.get(fooSelfRegister);

            expect(foo1 !== foo2).toBe(true);
            expect(foo1 instanceof Foo).toBe(true);
            expect(foo2 instanceof Foo).toBe(true);
        });
    });
});

test.describe("DI.getDependencies", () => {
    test("string param", async () => {
        class Foo {
            public constructor(public readonly test: string) {}
        }
        inject(String)(Foo, undefined, 0);
        singleton(Foo);

        expect(DI.getDependencies(Foo)).toEqual([String]);
    });

    test("class param", async () => {
        class Bar {}
        class Foo {
            public constructor(public readonly test: Bar) {}
        }
        inject(Bar)(Foo, undefined, 0);
        singleton(Foo);

        const actual = DI.getDependencies(Foo);

        expect(actual.length).toBe(1);
        expect(actual[0] === Bar).toBe(true);
    });
});

test.describe("DI.createContext() -> container.get()", () => {
    test.describe("leaf", () => {
        test("transient registration returns a new instance each time", async () => {
            interface ITransient {}
            class Transient implements ITransient {}

            const ITransient = DI.createContext<ITransient>("ITransient", x =>
                x.transient(Transient)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ITransient);
            const actual2 = container.get(ITransient);

            expect(actual1 instanceof Transient).toBe(true);
            expect(actual2 instanceof Transient).toBe(true);
            expect(actual1 !== actual2).toBe(true);
        });

        test("singleton registration returns the same instance each time", async () => {
            interface ISingleton {}
            class Singleton implements ISingleton {}

            const ISingleton = DI.createContext<ISingleton>("ISingleton", x =>
                x.singleton(Singleton)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ISingleton);
            const actual2 = container.get(ISingleton);

            expect(actual1 instanceof Singleton).toBe(true);
            expect(actual2 instanceof Singleton).toBe(true);
            expect(actual1 === actual2).toBe(true);
        });

        test("instance registration returns the same instance each time", async () => {
            interface IInstance {}
            class Instance implements IInstance {}

            const instance = new Instance();
            const IInstance = DI.createContext<IInstance>("IInstance", x =>
                x.instance(instance)
            );

            const container = DI.createContainer();
            const actual1 = container.get(IInstance);
            const actual2 = container.get(IInstance);

            expect(actual1 instanceof Instance).toBe(true);
            expect(actual2 instanceof Instance).toBe(true);
            expect(actual1 === instance).toBe(true);
            expect(actual2 === instance).toBe(true);
        });

        test("callback registration is invoked each time", async () => {
            interface ICallback {}
            class Callback implements ICallback {}

            let callCount = 0;
            const callback = () => {
                callCount++;
                return new Callback();
            };

            const ICallback = DI.createContext<ICallback>("ICallback", x =>
                x.callback(callback)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ICallback);
            const actual2 = container.get(ICallback);

            expect(actual1 instanceof Callback).toBe(true);
            expect(actual2 instanceof Callback).toBe(true);
            expect(actual1 !== actual2).toBe(true);
            expect(callCount).toBe(2);
        });

        test("cachedCallback registration is invoked once", async () => {
            interface ICachedCallback {}
            class CachedCallback implements ICachedCallback {}

            let callbackCount = 0;
            function callbackToCache() {
                ++callbackCount;
                return new CachedCallback();
            }

            const cachedCallback = "cachedCallBack";
            const container = DI.createContainer();
            container.register(
                Registration.cachedCallback(cachedCallback, callbackToCache)
            );

            const child = container.createChild();
            child.register(Registration.cachedCallback(cachedCallback, callbackToCache));
            const actual1 = container.get(cachedCallback);

            expect(callbackCount).toBe(1);

            const actual2 = container.get(cachedCallback);
            const actual3 = child.get(cachedCallback);

            expect(actual2 === actual1).toBe(true);
            expect(actual3 !== actual1).toBe(true);
        });

        test("cacheCallback multiple root containers", async () => {
            interface ICachedCallback {}
            class CachedCallback implements ICachedCallback {}

            let callbackCount = 0;
            function callbackToCache() {
                ++callbackCount;
                return new CachedCallback();
            }

            const cachedCallback = "cachedCallBack";
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
            const count1 = callbackCount;
            const same1 = actual11 === actual12;

            const actual21 = container1.get(cachedCallback);
            const actual22 = container1.get(cachedCallback);
            const count2 = callbackCount;
            const same2 = actual21 === actual22;

            expect(count1).toBe(1);
            expect(same1).toBe(true);
            expect(count2).toBe(2);
            expect(same2).toBe(true);
        });

        test("cacheCallback shared registration", async () => {
            interface ICachedCallback {}
            class CachedCallback implements ICachedCallback {}

            let callbackCount = 0;
            function callbackToCache() {
                ++callbackCount;
                return new CachedCallback();
            }

            const cachedCallback = "cachedCallBack";
            const reg = Registration.cachedCallback(cachedCallback, callbackToCache);
            const container0 = DI.createContainer();
            const container1 = DI.createContainer();
            container0.register(reg);
            container1.register(reg);

            const actual11 = container0.get(cachedCallback);
            const actual12 = container0.get(cachedCallback);
            const count1 = callbackCount;
            const same1 = actual11 === actual12;

            const actual21 = container1.get(cachedCallback);
            const actual22 = container1.get(cachedCallback);
            const count2 = callbackCount;
            const same2 = actual21 === actual22;
            const cross = actual11 === actual21;

            expect(count1).toBe(1);
            expect(same1).toBe(true);
            expect(count2).toBe(1);
            expect(same2).toBe(true);
            expect(cross).toBe(true);
        });

        test("cachedCallback registration on interface is invoked once", async () => {
            interface ICachedCallback {}
            class CachedCallback implements ICachedCallback {}

            let callbackCount = 0;
            function callbackToCache() {
                ++callbackCount;
                return new CachedCallback();
            }

            const ICachedCallback = DI.createContext<ICachedCallback>(
                "ICachedCallback",
                x => x.cachedCallback(callbackToCache)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ICachedCallback);
            const actual2 = container.get(ICachedCallback);

            expect(callbackCount).toBe(1);
            expect(actual2 === actual1).toBe(true);
        });

        test("cacheCallback interface multiple root containers", async () => {
            interface ICachedCallback {}
            class CachedCallback implements ICachedCallback {}

            let callbackCount = 0;
            function callbackToCache() {
                ++callbackCount;
                return new CachedCallback();
            }

            const ICachedCallback = DI.createContext<ICachedCallback>(
                "ICachedCallback",
                x => x.cachedCallback(callbackToCache)
            );

            const container0 = DI.createContainer();
            const container1 = DI.createContainer();
            const actual11 = container0.get(ICachedCallback);
            const actual12 = container0.get(ICachedCallback);
            const count1 = callbackCount;
            const same1 = actual11 === actual12;

            const actual21 = container1.get(ICachedCallback);
            const actual22 = container1.get(ICachedCallback);
            const count2 = callbackCount;
            const same2 = actual21 === actual22;

            expect(count1).toBe(1);
            expect(same1).toBe(true);
            expect(count2).toBe(2);
            expect(same2).toBe(true);
        });

        test("ContextDecorator alias to transient registration returns a new instance each time", async () => {
            interface ITransient {}
            class Transient implements ITransient {}

            const ITransient = DI.createContext<ITransient>("ITransient", x =>
                x.transient(Transient)
            );

            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x => x.aliasTo(ITransient));

            const container = DI.createContainer();
            const actual1 = container.get(IAlias);
            const actual2 = container.get(IAlias);

            expect(actual1 instanceof Transient).toBe(true);
            expect(actual2 instanceof Transient).toBe(true);
            expect(actual1 !== actual2).toBe(true);
        });

        test("ContextDecorator alias to singleton registration returns the same instance each time", async () => {
            interface ISingleton {}
            class Singleton implements ISingleton {}

            const ISingleton = DI.createContext<ISingleton>("ISingleton", x =>
                x.singleton(Singleton)
            );

            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x => x.aliasTo(ISingleton));

            const container = DI.createContainer();
            const actual1 = container.get(IAlias);
            const actual2 = container.get(IAlias);

            expect(actual1 instanceof Singleton).toBe(true);
            expect(actual2 instanceof Singleton).toBe(true);
            expect(actual1 === actual2).toBe(true);
        });

        test("ContextDecorator alias to instance registration returns the same instance each time", async () => {
            interface IInstance {}
            class Instance implements IInstance {}

            const instance = new Instance();
            const IInstance = DI.createContext<IInstance>("IInstance", x =>
                x.instance(instance)
            );

            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x => x.aliasTo(IInstance));

            const container = DI.createContainer();
            const actual1 = container.get(IAlias);
            const actual2 = container.get(IAlias);

            expect(actual1 instanceof Instance).toBe(true);
            expect(actual2 instanceof Instance).toBe(true);
            expect(actual1 === instance).toBe(true);
            expect(actual2 === instance).toBe(true);
        });

        test("ContextDecorator alias to callback registration is invoked each time", async () => {
            interface ICallback {}
            class Callback implements ICallback {}

            let callCount = 0;
            const callback = () => {
                callCount++;
                return new Callback();
            };

            const ICallback = DI.createContext<ICallback>("ICallback", x =>
                x.callback(callback)
            );

            interface IAlias {}
            const IAlias = DI.createContext<IAlias>("IAlias", x => x.aliasTo(ICallback));

            const container = DI.createContainer();
            const actual1 = container.get(IAlias);
            const actual2 = container.get(IAlias);

            expect(actual1 instanceof Callback).toBe(true);
            expect(actual2 instanceof Callback).toBe(true);
            expect(actual1 !== actual2).toBe(true);
            expect(callCount).toBe(2);
        });

        test("string alias to transient registration returns a new instance each time", async () => {
            interface ITransient {}
            class Transient implements ITransient {}

            const ITransient = DI.createContext<ITransient>("ITransient", x =>
                x.transient(Transient)
            );

            const container = DI.createContainer();
            container.register(Registration.aliasTo(ITransient, "alias"));

            const actual1 = container.get("alias");
            const actual2 = container.get("alias");

            expect(actual1 instanceof Transient).toBe(true);
            expect(actual2 instanceof Transient).toBe(true);
            expect(actual1 !== actual2).toBe(true);
        });

        test("string alias to singleton registration returns the same instance each time", async () => {
            interface ISingleton {}
            class Singleton implements ISingleton {}

            const ISingleton = DI.createContext<ISingleton>("ISingleton", x =>
                x.singleton(Singleton)
            );

            const container = DI.createContainer();
            container.register(Registration.aliasTo(ISingleton, "alias"));

            const actual1 = container.get("alias");
            const actual2 = container.get("alias");

            expect(actual1 instanceof Singleton).toBe(true);
            expect(actual2 instanceof Singleton).toBe(true);
            expect(actual1 === actual2).toBe(true);
        });

        test("string alias to instance registration returns the same instance each time", async () => {
            interface IInstance {}
            class Instance implements IInstance {}

            const instance = new Instance();
            const IInstance = DI.createContext<IInstance>("IInstance", x =>
                x.instance(instance)
            );

            const container = DI.createContainer();
            container.register(Registration.aliasTo(IInstance, "alias"));

            const actual1 = container.get("alias");
            const actual2 = container.get("alias");

            expect(actual1 instanceof Instance).toBe(true);
            expect(actual2 instanceof Instance).toBe(true);
            expect(actual1 === instance).toBe(true);
            expect(actual2 === instance).toBe(true);
        });

        test("string alias to callback registration is invoked each time", async () => {
            interface ICallback {}
            class Callback implements ICallback {}

            let callCount = 0;
            const callback = () => {
                callCount++;
                return new Callback();
            };

            const ICallback = DI.createContext<ICallback>("ICallback", x =>
                x.callback(callback)
            );

            const container = DI.createContainer();
            container.register(Registration.aliasTo(ICallback, "alias"));

            const actual1 = container.get("alias");
            const actual2 = container.get("alias");

            expect(actual1 instanceof Callback).toBe(true);
            expect(actual2 instanceof Callback).toBe(true);
            expect(actual1 !== actual2).toBe(true);
            expect(callCount).toBe(2);
        });
    });

    test.describe("transient parent", () => {
        test("transient child registration returns a new instance each time", async () => {
            interface ITransient {}
            class Transient implements ITransient {}

            const ITransient = DI.createContext<ITransient>("ITransient", x =>
                x.transient(Transient)
            );

            interface ITransientParent {
                dep: any;
            }

            class TransientParent implements ITransientParent {
                public constructor(public dep: ITransient) {}
            }
            inject(ITransient)(TransientParent, undefined, 0);

            const ITransientParent = DI.createContext<ITransientParent>(
                "ITransientParent",
                x => x.transient(TransientParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ITransientParent);
            const actual2 = container.get(ITransientParent);

            expect(actual1 instanceof TransientParent).toBe(true);
            expect(actual1.dep instanceof Transient).toBe(true);
            expect(actual2 instanceof TransientParent).toBe(true);
            expect(actual2.dep instanceof Transient).toBe(true);
            expect(actual1 !== actual2).toBe(true);
            expect(actual1.dep !== actual2.dep).toBe(true);
        });

        test("singleton child registration returns the same instance each time", async () => {
            interface ISingleton {}
            class Singleton implements ISingleton {}

            const ISingleton = DI.createContext<ISingleton>("ISingleton", x =>
                x.singleton(Singleton)
            );

            interface ITransientParent {
                dep: any;
            }

            class TransientParent implements ITransientParent {
                public constructor(public dep: ISingleton) {}
            }
            inject(ISingleton)(TransientParent, undefined, 0);

            const ITransientParent = DI.createContext<ITransientParent>(
                "ITransientParent",
                x => x.transient(TransientParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ITransientParent);
            const actual2 = container.get(ITransientParent);

            expect(actual1 instanceof TransientParent).toBe(true);
            expect(actual1.dep instanceof Singleton).toBe(true);
            expect(actual2 instanceof TransientParent).toBe(true);
            expect(actual2.dep instanceof Singleton).toBe(true);
            expect(actual1 !== actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("instance child registration returns the same instance each time", async () => {
            interface IInstance {}
            class Instance implements IInstance {}

            const instance = new Instance();
            const IInstance = DI.createContext<IInstance>("IInstance", x =>
                x.instance(instance)
            );

            interface ITransientParent {
                dep: any;
            }

            class TransientParent implements ITransientParent {
                public constructor(public dep: IInstance) {}
            }
            inject(IInstance)(TransientParent, undefined, 0);

            const ITransientParent = DI.createContext<ITransientParent>(
                "ITransientParent",
                x => x.transient(TransientParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ITransientParent);
            const actual2 = container.get(ITransientParent);

            expect(actual1 instanceof TransientParent).toBe(true);
            expect(actual1.dep instanceof Instance).toBe(true);
            expect(actual2 instanceof TransientParent).toBe(true);
            expect(actual2.dep instanceof Instance).toBe(true);
            expect(actual1 !== actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("callback child registration is invoked each time", async () => {
            interface ICallback {}
            class Callback implements ICallback {}

            let callCount = 0;
            const callback = () => {
                callCount++;
                return new Callback();
            };

            const ICallback = DI.createContext<ICallback>("ICallback", x =>
                x.callback(callback)
            );

            interface ITransientParent {
                dep: any;
            }

            class TransientParent implements ITransientParent {
                public constructor(public dep: ICallback) {}
            }
            inject(ICallback)(TransientParent, undefined, 0);

            const ITransientParent = DI.createContext<ITransientParent>(
                "ITransientParent",
                x => x.transient(TransientParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ITransientParent);
            const actual2 = container.get(ITransientParent);

            expect(actual1 instanceof TransientParent).toBe(true);
            expect(actual1.dep instanceof Callback).toBe(true);
            expect(actual2 instanceof TransientParent).toBe(true);
            expect(actual2.dep instanceof Callback).toBe(true);
            expect(actual1 !== actual2).toBe(true);
            expect(actual1.dep !== actual2.dep).toBe(true);
            expect(callCount).toBe(2);
        });
    });

    test.describe("singleton parent", () => {
        test("transient child registration is reused by the singleton parent", async () => {
            interface ITransient {}
            class Transient implements ITransient {}

            const ITransient = DI.createContext<ITransient>("ITransient", x =>
                x.transient(Transient)
            );

            interface ISingletonParent {
                dep: any;
            }

            class SingletonParent implements ISingletonParent {
                public constructor(public dep: ITransient) {}
            }
            inject(ITransient)(SingletonParent, undefined, 0);

            const ISingletonParent = DI.createContext<ISingletonParent>(
                "ISingletonParent",
                x => x.singleton(SingletonParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ISingletonParent);
            const actual2 = container.get(ISingletonParent);

            expect(actual1 instanceof SingletonParent).toBe(true);
            expect(actual1.dep instanceof Transient).toBe(true);
            expect(actual2 instanceof SingletonParent).toBe(true);
            expect(actual2.dep instanceof Transient).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("singleton registration is reused by the singleton parent", async () => {
            interface ISingleton {}
            class Singleton implements ISingleton {}

            const ISingleton = DI.createContext<ISingleton>("ISingleton", x =>
                x.singleton(Singleton)
            );

            interface ISingletonParent {
                dep: any;
            }

            class SingletonParent implements ISingletonParent {
                public constructor(public dep: ISingleton) {}
            }
            inject(ISingleton)(SingletonParent, undefined, 0);

            const ISingletonParent = DI.createContext<ISingletonParent>(
                "ISingletonParent",
                x => x.singleton(SingletonParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ISingletonParent);
            const actual2 = container.get(ISingletonParent);

            expect(actual1 instanceof SingletonParent).toBe(true);
            expect(actual1.dep instanceof Singleton).toBe(true);
            expect(actual2 instanceof SingletonParent).toBe(true);
            expect(actual2.dep instanceof Singleton).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("instance registration is reused by the singleton parent", async () => {
            interface IInstance {}
            class Instance implements IInstance {}

            const instance = new Instance();
            const IInstance = DI.createContext<IInstance>("IInstance", x =>
                x.instance(instance)
            );

            interface ISingletonParent {
                dep: any;
            }

            class SingletonParent implements ISingletonParent {
                public constructor(public dep: IInstance) {}
            }
            inject(IInstance)(SingletonParent, undefined, 0);

            const ISingletonParent = DI.createContext<ISingletonParent>(
                "ISingletonParent",
                x => x.singleton(SingletonParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ISingletonParent);
            const actual2 = container.get(ISingletonParent);

            expect(actual1 instanceof SingletonParent).toBe(true);
            expect(actual1.dep instanceof Instance).toBe(true);
            expect(actual2 instanceof SingletonParent).toBe(true);
            expect(actual2.dep instanceof Instance).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("callback registration is reused by the singleton parent", async () => {
            interface ICallback {}
            class Callback implements ICallback {}

            let callCount = 0;
            const callback = () => {
                callCount++;
                return new Callback();
            };

            const ICallback = DI.createContext<ICallback>("ICallback", x =>
                x.callback(callback)
            );

            interface ISingletonParent {
                dep: any;
            }

            class SingletonParent implements ISingletonParent {
                public constructor(public dep: ICallback) {}
            }
            inject(ICallback)(SingletonParent, undefined, 0);

            const ISingletonParent = DI.createContext<ISingletonParent>(
                "ISingletonParent",
                x => x.singleton(SingletonParent)
            );

            const container = DI.createContainer();
            const actual1 = container.get(ISingletonParent);
            const actual2 = container.get(ISingletonParent);

            expect(actual1 instanceof SingletonParent).toBe(true);
            expect(actual1.dep instanceof Callback).toBe(true);
            expect(actual2 instanceof SingletonParent).toBe(true);
            expect(actual2.dep instanceof Callback).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
            expect(callCount).toBe(1);
        });
    });

    test.describe("instance parent", () => {
        test("transient registration is reused by the instance parent", async () => {
            interface ITransient {}
            class Transient implements ITransient {}

            const ITransient = DI.createContext<ITransient>("ITransient", x =>
                x.transient(Transient)
            );

            interface IInstanceParent {
                dep: any;
            }

            class InstanceParent implements IInstanceParent {
                public constructor(public dep: ITransient) {}
            }
            inject(ITransient)(InstanceParent, undefined, 0);

            const container = DI.createContainer();
            const instanceParent = container.get(InstanceParent);
            const IInstanceParent = DI.createContext<IInstanceParent>(
                "IInstanceParent",
                x => x.instance(instanceParent)
            );

            const actual1 = container.get(IInstanceParent);
            const actual2 = container.get(IInstanceParent);

            expect(actual1 instanceof InstanceParent).toBe(true);
            expect(actual1.dep instanceof Transient).toBe(true);
            expect(actual2 instanceof InstanceParent).toBe(true);
            expect(actual2.dep instanceof Transient).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("singleton registration is reused by the instance parent", async () => {
            interface ISingleton {}
            class Singleton implements ISingleton {}

            const ISingleton = DI.createContext<ISingleton>("ISingleton", x =>
                x.singleton(Singleton)
            );

            interface IInstanceParent {
                dep: any;
            }

            class InstanceParent implements IInstanceParent {
                public constructor(public dep: ISingleton) {}
            }
            inject(ISingleton)(InstanceParent, undefined, 0);

            const container = DI.createContainer();
            const instanceParent = container.get(InstanceParent);
            const IInstanceParent = DI.createContext<IInstanceParent>(
                "IInstanceParent",
                x => x.instance(instanceParent)
            );

            const actual1 = container.get(IInstanceParent);
            const actual2 = container.get(IInstanceParent);

            expect(actual1 instanceof InstanceParent).toBe(true);
            expect(actual1.dep instanceof Singleton).toBe(true);
            expect(actual2 instanceof InstanceParent).toBe(true);
            expect(actual2.dep instanceof Singleton).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("instance registration is reused by the instance parent", async () => {
            interface IInstance {}
            class Instance implements IInstance {}

            const instance = new Instance();
            const IInstance = DI.createContext<IInstance>("IInstance", x =>
                x.instance(instance)
            );

            interface IInstanceParent {
                dep: any;
            }

            class InstanceParent implements IInstanceParent {
                public constructor(public dep: IInstance) {}
            }
            inject(IInstance)(InstanceParent, undefined, 0);

            const container = DI.createContainer();
            const instanceParent = container.get(InstanceParent);
            const IInstanceParent = DI.createContext<IInstanceParent>(
                "IInstanceParent",
                x => x.instance(instanceParent)
            );

            const actual1 = container.get(IInstanceParent);
            const actual2 = container.get(IInstanceParent);

            expect(actual1 instanceof InstanceParent).toBe(true);
            expect(actual1.dep instanceof Instance).toBe(true);
            expect(actual2 instanceof InstanceParent).toBe(true);
            expect(actual2.dep instanceof Instance).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
        });

        test("callback registration is reused by the instance parent", async () => {
            interface ICallback {}
            class Callback implements ICallback {}

            let callCount = 0;
            const callback = () => {
                callCount++;
                return new Callback();
            };

            const ICallback = DI.createContext<ICallback>("ICallback", x =>
                x.callback(callback)
            );

            interface IInstanceParent {
                dep: any;
            }

            class InstanceParent implements IInstanceParent {
                public constructor(public dep: ICallback) {}
            }
            inject(ICallback)(InstanceParent, undefined, 0);

            const container = DI.createContainer();
            const instanceParent = container.get(InstanceParent);
            const IInstanceParent = DI.createContext<IInstanceParent>(
                "IInstanceParent",
                x => x.instance(instanceParent)
            );

            const actual1 = container.get(IInstanceParent);
            const actual2 = container.get(IInstanceParent);

            expect(actual1 instanceof InstanceParent).toBe(true);
            expect(actual1.dep instanceof Callback).toBe(true);
            expect(actual2 instanceof InstanceParent).toBe(true);
            expect(actual2.dep instanceof Callback).toBe(true);
            expect(actual1 === actual2).toBe(true);
            expect(actual1.dep === actual2.dep).toBe(true);
            expect(callCount).toBe(1);
        });
    });
});
