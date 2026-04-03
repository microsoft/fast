import { Observable, observable } from "../observation/observable.js";

class ChildModel {
    value!: string;
}
observable(ChildModel.prototype, "value");
ChildModel.prototype.value = "value";

class Model {
    childChangedCalled = false;
    trigger!: number;
    value!: number;
    child!: ChildModel;
    child2!: ChildModel;

    childChanged() {
        this.childChangedCalled = true;
    }

    incrementTrigger() {
        this.trigger++;
    }

    decrementTrigger() {
        this.trigger--;
    }

    get ifConditional() {
        Observable.trackVolatile();

        if (this.trigger < 1) {
            return 42;
        }

        return this.value;
    }
}
observable(Model.prototype, "child");
Model.prototype.child = new ChildModel();
observable(Model.prototype, "child2");
Model.prototype.child2 = new ChildModel();
observable(Model.prototype, "trigger");
Model.prototype.trigger = 0;
observable(Model.prototype, "value");
Model.prototype.value = 10;
Object.defineProperty(Model.prototype, "ternaryConditional", {
    get() {
        Observable.trackVolatile();
        return this.trigger < 1 ? 42 : this.value;
    },
});
Object.defineProperty(Model.prototype, "andCondition", {
    get() {
        Observable.trackVolatile();
        return this.trigger && this.value;
    },
});

class DerivedModel extends Model {
    child2ChangedCalled = false;

    child2Changed() {
        this.child2ChangedCalled = true;
    }

    derivedChild!: ChildModel;
}
observable(DerivedModel.prototype, "derivedChild");
DerivedModel.prototype.derivedChild = new ChildModel();

export { ChildModel, DerivedModel, Model };
