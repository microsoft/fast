import { expect } from "chai";
import { enableArrayObservation } from "./array-observer";
import { SubscriberSet, PropertyChangeNotifier } from "./notifier";
import { Observable, observable } from "./observable";

describe("The Observable facade", () => {
    class Model {
        @observable child = new ChildModel();
        @observable child2 = new ChildModel();
    }

    class ChildModel {
        @observable value = "value";
    }

    class DerivedModel extends Model {
        @observable derivedChild = new ChildModel();
    }

    it("can set an array observer factory", () => {
        const fakeObserver = new SubscriberSet([]);
        Observable.setArrayObserverFactory((array: any[]) => fakeObserver);
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

    it("can notify a change for an object", () => {
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

        Observable.notify(instance, "child");

        expect(wasNotified).to.be.true;
    });

    it("can define a property on an object", () => {
        const obj = {} as any;
        expect("value" in obj).to.be.false;

        Observable.defineProperty(obj, "value");
        expect("value" in obj).to.be.true;
    });

    it("can list all accessors for an object", () => {
        const accessors = Observable.getAccessors(new Model());

        expect(accessors.length).to.equal(2);
        expect(accessors[0].name).to.equal("child");
        expect(accessors[1].name).to.equal("child2");
    });

    it("can list accessors for an object, including the prototype chain", () => {
        const accessors = Observable.getAccessors(new DerivedModel());

        expect(accessors.length).to.equal(3);
        expect(accessors[0].name).to.equal("child");
        expect(accessors[1].name).to.equal("child2");
        expect(accessors[2].name).to.equal("derivedChild");
    });

    it("can create a binding observer", () => {
        const binding = (x: Model) => x.child.value;
        const observer = Observable.binding(binding);

        expect(observer).to.be.instanceOf(SubscriberSet);
    });
});

describe("The BindingObserver", () => {});
