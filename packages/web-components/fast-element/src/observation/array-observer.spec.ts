import { expect } from "chai";
import { Observable } from "./observable";
import { enableArrayObservation } from "./array-observer";
import { SubscriberSet } from "./notifier";

describe("The ArrayObserver", () => {
    it("can be retrieved through Observable.getNotifier()", () => {
        enableArrayObservation();
        const array = [];
        const notifier = Observable.getNotifier(array);
        expect(notifier).to.be.instanceOf(SubscriberSet);
    });

    it("is the same instance for multiple calls to Observable.getNotifier() on the same array", () => {
        enableArrayObservation();
        const array = [];
        const notifier = Observable.getNotifier(array);
        const notifier2 = Observable.getNotifier(array);
        expect(notifier).to.equal(notifier2);
    });

    it("is different for different arrays", () => {
        enableArrayObservation();
        const notifier = Observable.getNotifier([]);
        const notifier2 = Observable.getNotifier([]);
        expect(notifier).to.not.equal(notifier2);
    });

    it("doesn't affect for/in loops on arrays when enabled", () => {
        enableArrayObservation();

        const array = [1, 2, 3];
        const keys: string[] = [];

        for (const key in array) {
            keys.push(key);
        }

        expect(keys).eql(["0", "1", "2"]);
    });

    it("doesn't affect for/in loops on arrays when the array is observed", () => {
        enableArrayObservation();

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
