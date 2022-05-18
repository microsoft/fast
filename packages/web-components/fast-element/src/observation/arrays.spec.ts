import { expect } from "chai";
import { Observable } from "./observable";
import { ArrayObserver, length } from "./arrays";
import { SubscriberSet } from "./notifier";
import { Updates } from "./update-queue";

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
});

describe("The array length observer", () => {
    class Model {
        items: any[];
    }

    it("returns zero length if the array is undefined", async () => {
        const instance = new Model();
        const observer = Observable.binding<Model>(x => length(x.items));

        const value = observer.observe(instance)

        expect(value).to.equal(0);

        observer.disconnect();
    });

    it("returns zero length if the array is null", async () => {
        const instance = new Model();
        instance.items = null as any;
        const observer = Observable.binding<Model>(x => length(x.items));

        const value = observer.observe(instance)

        expect(value).to.equal(0);

        observer.disconnect();
    });

    it("returns length of an array", async () => {
        const instance = new Model();
        instance.items = [1,2,3,4,5];
        const observer = Observable.binding<Model>(x => length(x.items));

        const value = observer.observe(instance)

        expect(value).to.equal(5);

        observer.disconnect();
    });

    it("notifies when the array length changes", async () => {
        const instance = new Model();
        instance.items = [1,2,3,4,5];

        let changed = false;
        const observer = Observable.binding<Model>(x => length(x.items), {
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

        observer.disconnect();
    });

    it("does not notify on changes that don't change the length", async () => {
        const instance = new Model();
        instance.items = [1,2,3,4,5];

        let changed = false;
        const observer = Observable.binding<Model>(x => length(x.items), {
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

        observer.disconnect();
    });
});
