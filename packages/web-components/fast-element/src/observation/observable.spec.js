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
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { expect } from "chai";
import { DOM } from "../dom";
import { enableArrayObservation } from "./array-observer";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier";
import { defaultExecutionContext, Observable, observable, volatile } from "./observable";
describe("The Observable", () => {
    class Model {
        constructor() {
            this.child = new ChildModel();
            this.child2 = new ChildModel();
            this.trigger = 0;
            this.value = 10;
            this.childChangedCalled = false;
        }
        childChanged() {
            this.childChangedCalled = true;
        }
        incrementTrigger() {
            this.trigger++;
        }
        decrementTrigger() {
            this.trigger--;
        }
        get ternaryConditional() {
            return this.trigger < 1 ? 42 : this.value;
        }
        get ifConditional() {
            Observable.trackVolatile();
            if (this.trigger < 1) {
                return 42;
            }
            return this.value;
        }
        get andCondition() {
            return this.trigger && this.value;
        }
    }
    __decorate([observable], Model.prototype, "child", void 0);
    __decorate([observable], Model.prototype, "child2", void 0);
    __decorate([observable], Model.prototype, "trigger", void 0);
    __decorate([observable], Model.prototype, "value", void 0);
    __decorate([volatile], Model.prototype, "ternaryConditional", null);
    __decorate([volatile], Model.prototype, "andCondition", null);
    class ChildModel {
        constructor() {
            this.value = "value";
        }
    }
    __decorate([observable], ChildModel.prototype, "value", void 0);
    class DerivedModel extends Model {
        constructor() {
            super(...arguments);
            this.derivedChild = new ChildModel();
            this.child2ChangedCalled = false;
        }
        child2Changed() {
            this.child2ChangedCalled = true;
        }
    }
    __decorate([observable], DerivedModel.prototype, "derivedChild", void 0);
    context("facade", () => {
        it("can set an array observer factory", () => {
            const fakeObserver = new SubscriberSet([]);
            Observable.setArrayObserverFactory(array => fakeObserver);
            const array = [];
            const observer = Observable.getNotifier(array);
            expect(observer).to.equal(fakeObserver);
        });
        it("can get a notifier for an object", () => {
            const instance = new Model();
            const notifier = Observable.getNotifier(instance);
            expect(notifier).to.instanceOf(PropertyChangeNotifier);
        });
        it("gets the same notifier for the same object", () => {
            const instance = new Model();
            const notifier = Observable.getNotifier(instance);
            const notifier2 = Observable.getNotifier(instance);
            expect(notifier).to.equal(notifier2);
        });
        it("can get a notifier for an array", () => {
            enableArrayObservation();
            const array = [];
            const notifier = Observable.getNotifier(array);
            expect(notifier).to.be.instanceOf(SubscriberSet);
        });
        it("gets the same notifier for the same array", () => {
            enableArrayObservation();
            const array = [];
            const notifier = Observable.getNotifier(array);
            const notifier2 = Observable.getNotifier(array);
            expect(notifier).to.equal(notifier2);
        });
        it("can notify a change on an object", () => {
            const instance = new Model();
            const notifier = Observable.getNotifier(instance);
            let wasNotified = false;
            notifier.subscribe(
                {
                    handleChange() {
                        wasNotified = true;
                    },
                },
                "child"
            );
            expect(wasNotified).to.be.false;
            Observable.notify(instance, "child");
            expect(wasNotified).to.be.true;
        });
        it("can define a property on an object", () => {
            const obj = {};
            expect("value" in obj).to.be.false;
            Observable.defineProperty(obj, "value");
            expect("value" in obj).to.be.true;
        });
        it("can list all accessors for an object", () => {
            const accessors = Observable.getAccessors(new Model());
            expect(accessors.length).to.equal(4);
            expect(accessors[0].name).to.equal("child");
            expect(accessors[1].name).to.equal("child2");
        });
        it("can list accessors for an object, including the prototype chain", () => {
            const accessors = Observable.getAccessors(new DerivedModel());
            expect(accessors.length).to.equal(5);
            expect(accessors[0].name).to.equal("child");
            expect(accessors[1].name).to.equal("child2");
            expect(accessors[4].name).to.equal("derivedChild");
        });
        it("can create a binding observer", () => {
            const binding = x => x.child;
            const observer = Observable.binding(binding);
            expect(observer).to.be.instanceOf(SubscriberSet);
        });
    });
    context("BindingObserver", () => {
        it("notifies on changes in a simple binding", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.child;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child);
                expect(wasNotified).to.be.false;
                model.child = new ChildModel();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child);
            }));
        it("notifies on changes in a sub-property binding", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.child.value;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value);
                expect(wasNotified).to.be.false;
                model.child.value = "something completely different";
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value);
            }));
        it("notifies on changes in a sub-property binding after disconnecting before notification has been processed", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.child.value;
                let called = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        called = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value);
                expect(called).to.be.false;
                model.child.value = "something completely different";
                observer.disconnect();
                yield DOM.nextUpdate();
                expect(called).to.be.false;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value);
                model.child.value = "another completely different thing";
                yield DOM.nextUpdate();
                expect(called).to.be.true;
            }));
        it("notifies on changes in a multi-property binding", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.child.value + x.child2.value;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value + model.child2.value);
                // change child.value
                expect(wasNotified).to.be.false;
                model.child.value = "something completely different";
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value + model.child2.value);
                // change child2.value
                wasNotified = false;
                model.child2.value = "another thing";
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value + model.child2.value);
                // change child
                wasNotified = false;
                model.child = new ChildModel();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value + model.child2.value);
                // change child 2
                wasNotified = false;
                model.child2 = new ChildModel();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.child.value + model.child2.value);
            }));
        it("notifies on changes in a ternary expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => (x.trigger < 1 ? 42 : x.value);
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.incrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("notifies on changes in a computed ternary expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.ternaryConditional;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.incrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("notifies on changes in an if expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => {
                    if (x.trigger < 1) {
                        return 42;
                    }
                    return x.value;
                };
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.incrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("notifies on changes in a computed if expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.ifConditional;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.incrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("notifies on changes in an && expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.trigger && x.value;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.incrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("notifies on changes in a computed && expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.trigger && x.value;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.incrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("notifies on changes in an || expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => x.trigger || x.value;
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                model.incrementTrigger();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.decrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("notifies on changes in a switch/case expression", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const binding = x => {
                    switch (x.trigger) {
                        case 0:
                            return 42;
                        default:
                            return x.value;
                    }
                };
                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });
                const model = new Model();
                let value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                expect(wasNotified).to.be.false;
                model.incrementTrigger();
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
                wasNotified = false;
                model.value = 20;
                yield DOM.nextUpdate();
                expect(wasNotified).to.be.true;
                value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(binding(model));
            }));
        it("does not notify if disconnected", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                let wasCalled = false;
                const binding = x => x.value;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasCalled = true;
                    },
                });
                const model = new Model();
                const value = observer.observe(model, defaultExecutionContext);
                expect(value).to.equal(model.value);
                expect(wasCalled).to.equal(false);
                model.value++;
                observer.disconnect();
                yield DOM.nextUpdate();
                expect(wasCalled).to.equal(false);
            }));
        it("allows inspection of subscription records of used observables after observation", () => {
            const observed = [{}, {}, {}].map((x, i) => {
                Observable.defineProperty(x, "value");
                x.value = i;
                return x;
            });
            function binding() {
                return observed[0].value + observed[1].value + observed[2].value;
            }
            const bindingObserver = Observable.binding(binding);
            bindingObserver.observe({}, defaultExecutionContext);
            let i = 0;
            for (const record of bindingObserver.records()) {
                expect(record.propertySource).to.equal(observed[i]);
                i++;
            }
        });
    });
    context("DefaultObservableAccessor", () => {
        it("calls its own change callback", () => {
            const model = new Model();
            model.child = new ChildModel();
            expect(model.childChangedCalled).to.be.true;
        });
        it("calls a derived change callback", () => {
            const model = new DerivedModel();
            model.child2 = new ChildModel();
            expect(model.child2ChangedCalled).to.be.true;
        });
    });
});
