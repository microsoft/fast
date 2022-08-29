import { expect } from "chai";
import { state } from "./state.js";
import { Observable } from "../observation/observable.js";
import { Updates } from "../observation/update-queue.js";

describe("The useState hook", () => {
    it("can get and set the value", () => {
        const sut = state(1);

        expect(sut()).equal(1);
        expect(sut.current).equal(1);

        sut.set(2);

        expect(sut()).equal(2);
        expect(sut.current).equal(2);

        sut.current = 3;

        expect(sut()).equal(3);
        expect(sut.current).equal(3);
    });

    it("can have its value observed", async () => {
        const sut = state(1);
        let wasCalled = false;

        Observable.binding(sut, {
            handleChange() {
                wasCalled = true;
            }
        }).observe({});

        sut.set(2);

        await Updates.next();

        expect(wasCalled).to.be.true;
    });

    it("can be deeply observed", async () => {
        const sut = state({
            a: {
                b: 1,
                c: 2
            }
        }, { deep: true });

        let callCount = 0;
        const subscriber = {
            handleChange(binding, observer) {
                callCount++;
            }
        };

        Observable.binding(() => sut().a.b, subscriber).observe({});
        Observable.binding(() => sut().a.c, subscriber).observe({});

        sut().a.b = 2;
        sut().a.c = 3;

        await Updates.next();

        expect(callCount).equals(2);
    });
});
