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
import { DI, inject, Registration, singleton } from "./di";
import chai, { expect } from "chai";
import spies from "chai-spies";
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
        });
        it("children", function () {
            const root = DI.createContainer();
            const child1 = root.createChild();
            const child2 = root.createChild();
            const foo1 = child1.get(fooSelfRegister);
            const foo2 = child2.get(fooSelfRegister);
            expect(foo1).not.equal(foo2);
        });
    });
});
describe("DI.getDependencies", function () {
    it("string param", function () {
        let Foo = class Foo {
            constructor(test) {
                this.test = test;
            }
        };
        Foo = __decorate([singleton, __param(0, inject(String))], Foo);
        const actual = DI.getDependencies(Foo);
        expect(actual).to.eql([String]);
    });
    it("class param", function () {
        class Bar {}
        let Foo = class Foo {
            constructor(test) {
                this.test = test;
            }
        };
        Foo = __decorate([singleton, __param(0, inject(Bar))], Foo);
        const actual = DI.getDependencies(Foo);
        expect(actual).to.eql([Bar]);
    });
});
describe("DI.createInterface() -> container.get()", function () {
    let container;
    class Transient {}
    let ITransient;
    class Singleton {}
    let ISingleton;
    class Instance {}
    let IInstance;
    let instance;
    class Callback {}
    let ICallback;
    class CachedCallback {}
    let ICachedCallback;
    const cachedCallback = "cachedCallBack";
    let callbackCount = 0;
    function callbackToCache() {
        ++callbackCount;
        return new CachedCallback();
    }
    let callback;
    // eslint-disable-next-line mocha/no-hooks
    beforeEach(function () {
        callbackCount = 0;
        container = DI.createContainer();
        ITransient = DI.createInterface("ITransient", x => x.transient(Transient));
        ISingleton = DI.createInterface("ISingleton", x => x.singleton(Singleton));
        instance = new Instance();
        IInstance = DI.createInterface("IInstance", x => x.instance(instance));
        callback = chai.spy(() => new Callback());
        ICallback = DI.createInterface("ICallback", x => x.callback(callback));
        ICachedCallback = DI.createInterface("ICachedCallback", x =>
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
        it(`InterfaceSymbol alias to transient registration returns a new instance each time`, function () {
            const IAlias = DI.createInterface("IAlias", x => x.aliasTo(ITransient));
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
        it(`InterfaceSymbol alias to singleton registration returns the same instance each time`, function () {
            const IAlias = DI.createInterface("IAlias", x => x.aliasTo(ISingleton));
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
        it(`InterfaceSymbol alias to instance registration returns the same instance each time`, function () {
            const IAlias = DI.createInterface("IAlias", x => x.aliasTo(IInstance));
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
        it(`InterfaceSymbol alias to callback registration is invoked each time`, function () {
            const IAlias = DI.createInterface("IAlias", x => x.aliasTo(ICallback));
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
        let ITransientParent;
        function register(cls) {
            ITransientParent = DI.createInterface("ITransientParent", x =>
                x.transient(cls)
            );
        }
        it(`transient child registration returns a new instance each time`, function () {
            let TransientParent = class TransientParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            TransientParent = __decorate([inject(ITransient)], TransientParent);
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
            let TransientParent = class TransientParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            TransientParent = __decorate([inject(ISingleton)], TransientParent);
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
            let TransientParent = class TransientParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            TransientParent = __decorate([inject(IInstance)], TransientParent);
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
            let TransientParent = class TransientParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            TransientParent = __decorate([inject(ICallback)], TransientParent);
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
        let ISingletonParent;
        function register(cls) {
            ISingletonParent = DI.createInterface("ISingletonParent", x =>
                x.singleton(cls)
            );
        }
        it(`transient child registration is reused by the singleton parent`, function () {
            let SingletonParent = class SingletonParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            SingletonParent = __decorate([inject(ITransient)], SingletonParent);
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
            let SingletonParent = class SingletonParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            SingletonParent = __decorate([inject(ISingleton)], SingletonParent);
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
            let SingletonParent = class SingletonParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            SingletonParent = __decorate([inject(IInstance)], SingletonParent);
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
            let SingletonParent = class SingletonParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            SingletonParent = __decorate([inject(ICallback)], SingletonParent);
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
        let IInstanceParent;
        let instanceParent;
        function register(cls) {
            instanceParent = container.get(cls);
            IInstanceParent = DI.createInterface("IInstanceParent", x =>
                x.instance(instanceParent)
            );
        }
        it(`transient registration is reused by the instance parent`, function () {
            let InstanceParent = class InstanceParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            InstanceParent = __decorate([inject(ITransient)], InstanceParent);
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
            let InstanceParent = class InstanceParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            InstanceParent = __decorate([inject(ISingleton)], InstanceParent);
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
            let InstanceParent = class InstanceParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            InstanceParent = __decorate([inject(IInstance)], InstanceParent);
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
            let InstanceParent = class InstanceParent {
                constructor(dep) {
                    this.dep = dep;
                }
            };
            InstanceParent = __decorate([inject(ICallback)], InstanceParent);
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
