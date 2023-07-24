import { expect } from "chai";
import { Observable } from "./observable.js";
import { ArrayObserver, lengthOf, Splice } from "./arrays.js";
import { SubscriberSet } from "./notifier.js";
import { Updates } from "./update-queue.js";

describe("The ArrayObserver", () => {
    it("can be retrieved through Observable.getNotifier()", () => {
        ArrayObserver.enable();
        const array = [];
        const notifier = Observable.getNotifier(array);
        expect(notifier).to.be.instanceOf(SubscriberSet);
    });

    it("is the same instance for multiple calls to Observable.getNotifier() on the same array", () => {
        ArrayObserver.enable();
        const array = [];
        const notifier = Observable.getNotifier(array);
        const notifier2 = Observable.getNotifier(array);
        expect(notifier).to.equal(notifier2);
    });

    it("is different for different arrays", () => {
        ArrayObserver.enable();
        const notifier = Observable.getNotifier([]);
        const notifier2 = Observable.getNotifier([]);
        expect(notifier).to.not.equal(notifier2);
    });

    it("doesn't affect for/in loops on arrays when enabled", () => {
        ArrayObserver.enable();

        const array = [1, 2, 3];
        const keys: string[] = [];

        for (const key in array) {
            keys.push(key);
        }

        expect(keys).eql(["0", "1", "2"]);
    });

    it("doesn't affect for/in loops on arrays when the array is observed", () => {
        ArrayObserver.enable();

        const array = [1, 2, 3];
        const keys: string[] = [];
        const notifier = Observable.getNotifier(array);

        for (const key in array) {
            keys.push(key);
        }

        expect(notifier).to.be.instanceOf(SubscriberSet);
        expect(keys).eql(["0", "1", "2"])
    });

    it("observes pops", async () => {
        ArrayObserver.enable();
        const array = ["foo", "bar", "hello", "world"];

        array.pop();
        expect(array).members(["foo", "bar", "hello"]);

        Array.prototype.pop.call(array);
        expect(array).members(["foo", "bar"]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.pop();
        expect(array).members(["foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members(["bar"]);
        expect(changeArgs![0].index).equal(1);

        Array.prototype.pop.call(array);
        expect(array).members([]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members(["foo"]);
        expect(changeArgs![0].index).equal(0);
    });

    it("observes pushes", async () => {
        ArrayObserver.enable();
        const array: string[] = [];

        array.push("foo");
        expect(array).members(["foo"]);

        Array.prototype.push.call(array, "bar");
        expect(array).members(["foo", "bar"]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.push("hello");
        expect(array).members(["foo", "bar", "hello"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(2);

        Array.prototype.push.call(array, "world");
        expect(array).members(["foo", "bar", "hello", "world"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(3);
    });

    it("observes reverses", async () => {
        ArrayObserver.enable();
        const array = [1, 2, 3, 4];
        array.reverse();

        expect(array).members([4, 3, 2, 1]);

        Array.prototype.reverse.call(array);
        expect(array).members([1, 2, 3, 4]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.reverse();
        expect(array).members([4, 3, 2, 1]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);
        expect(changeArgs![0].reset).equal(true);

        Array.prototype.reverse.call(array);
        expect(array).members([1, 2, 3, 4]);
        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);
        expect(changeArgs![0].reset).equal(true);
    });

    it("observes shifts", async () => {
        ArrayObserver.enable();
        const array = ["foo", "bar", "hello", "world"];

        array.shift();
        expect(array).members(["bar", "hello", "world"]);

        Array.prototype.shift.call(array);
        expect(array).members(["hello", "world"]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.shift();
        expect(array).members(["world"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members(["hello"]);
        expect(changeArgs![0].index).equal(0);

        Array.prototype.shift.call(array);
        expect(array).members([]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members(["world"]);
        expect(changeArgs![0].index).equal(0);
    });

    it("observes sorts", async () => {
        ArrayObserver.enable();
        let array = [1, 2, 3, 4];

        array.sort((a, b) => b - a);
        expect(array).members([4, 3, 2, 1]);

        Array.prototype.sort.call(array, (a, b) => a - b);
        expect(array).members([1, 2, 3, 4]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.sort((a, b) => b - a);
        expect(array).members([4, 3, 2, 1]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);
        expect(changeArgs![0].reset).equal(true);

        Array.prototype.sort.call(array, (a, b) => a - b);
        expect(array).members([1, 2, 3, 4]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);
        expect(changeArgs![0].reset).equal(true);
    });

    it("observes splices", async () => {
        ArrayObserver.enable();
        let array: any[] = [1, 2, 3, 4];

        array.splice(1, 1, 'hello');
        expect(array).members([1, "hello", 3, 4])

        Array.prototype.splice.call(array, 2, 1, "world");
        expect(array).members([1, "hello", "world", 4]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.splice(1, 1, "foo");
        expect(array).members([1, "foo", "world", 4]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members(["hello"]);
        expect(changeArgs![0].index).equal(1);

        Array.prototype.splice.call(array, 2, 1, 'bar');
        expect(array).members([1, "foo", "bar", 4]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members(["world"]);
        expect(changeArgs![0].index).equal(2);
    });

    it("observes unshifts", async () => {
        ArrayObserver.enable();
        let array: string[] = [];

        array.unshift("foo");
        expect(array).members(["foo"])

        Array.prototype.unshift.call(array, "bar");
        expect(array).members(["bar", "foo"]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.unshift("hello");
        expect(array).members(["hello", "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);

        Array.prototype.unshift.call(array, 'world');
        expect(array).members(["world", "hello", "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);
    });

    it("observes back to back array modification operations", async () => {
        ArrayObserver.enable();
        let array: string[] = [];

        array.unshift("foo");
        expect(array).members(["foo"])

        Array.prototype.unshift.call(array, "bar");
        expect(array).members(["bar", "foo"]);

        const observer = Observable.getNotifier<ArrayObserver>(array);
        let changeArgs: Splice[] | null = null;

        observer.subscribe({
            handleChange(array, args) {
                changeArgs = args;
            }
        });

        array.unshift("hello");
        expect(array).members(["hello", "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);

        Array.prototype.shift.call(array);
        expect(array).members([ "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(0);
        expect(changeArgs![0].removed).members(['hello']);
        expect(changeArgs![0].index).equal(0);

        array.unshift("hello", "world");
        expect(array).members(["hello", "world", "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(2);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);

        Array.prototype.unshift.call(array, "hi", "there");
        expect(array).members([ "hi", "there","hello", "world", "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(2);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(0);

        Array.prototype.splice.call(array, 2, 2, "bye", "foo");
        expect(array).members([ "hi", "there", "bye", "foo", "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(2);
        expect(changeArgs![0].removed).members(["hello", "world"]);
        expect(changeArgs![0].index).equal(2);

        Array.prototype.splice.call(array, 1, 0, "hello");
        expect(array).members([ "hi", "there", "hello", "bye", "foo", "bar", "foo"]);

        await Updates.next();

        expect(changeArgs).length(1);
        expect(changeArgs![0].addedCount).equal(1);
        expect(changeArgs![0].removed).members([]);
        expect(changeArgs![0].index).equal(1);

    });
    it("should not deliver splices for changes prior to subscription", async () => {
        ArrayObserver.enable();
        const array = [1,2,3,4,5];
        const observer = Observable.getNotifier(array);
        let wasCalled = false;

        array.push(6);
        observer.subscribe({
            handleChange() {
                wasCalled = true;
            }
        });

        await Updates.next();

        expect(wasCalled).to.be.false;
    })

    it("should not deliver splices for .splice() when .splice() does not change the items in the array", async () => {
        ArrayObserver.enable();
        const array = [1,2,3,4,5];
        const observer = Observable.getNotifier(array);
        let splices;

        observer.subscribe({
            handleChange(source, args) {
                splices = args
            }
        });

        array.splice(0, array.length, ...array);

        await Updates.next();

        expect(splices.length).to.equal(0);
    })
});

describe("The array length observer", () => {
    class Model {
        items: any[];
    }

    it("returns zero length if the array is undefined", async () => {
        const instance = new Model();
        const observer = Observable.binding<Model>(x => lengthOf(x.items));

        const value = observer.observe(instance)

        expect(value).to.equal(0);

        observer.dispose();
    });

    it("returns zero length if the array is null", async () => {
        const instance = new Model();
        instance.items = null as any;
        const observer = Observable.binding<Model>(x => lengthOf(x.items));

        const value = observer.observe(instance)

        expect(value).to.equal(0);

        observer.dispose();
    });

    it("returns length of an array", async () => {
        const instance = new Model();
        instance.items = [1,2,3,4,5];
        const observer = Observable.binding<Model>(x => lengthOf(x.items));

        const value = observer.observe(instance)

        expect(value).to.equal(5);

        observer.dispose();
    });

    it("notifies when the array length changes", async () => {
        const instance = new Model();
        instance.items = [1,2,3,4,5];

        let changed = false;
        const observer = Observable.binding<Model>(x => lengthOf(x.items), {
            handleChange() {
                changed = true;
            }
        });

        const value = observer.observe(instance)

        expect(value).to.equal(5);

        instance.items.push(6);

        await Updates.next();

        expect(changed).to.be.true;
        expect(observer.observe(instance)).to.equal(6);

        observer.dispose();
    });

    it("does not notify on changes that don't change the length", async () => {
        const instance = new Model();
        instance.items = [1,2,3,4,5];

        let changed = false;
        const observer = Observable.binding<Model>(x => lengthOf(x.items), {
            handleChange() {
                changed = true;
            }
        });

        const value = observer.observe(instance);

        expect(value).to.equal(5);

        instance.items.splice(2, 1, 6);

        await Updates.next();

        expect(changed).to.be.false;
        expect(observer.observe(instance)).to.equal(5);

        observer.dispose();
    });
});
