import { expect } from "chai";
import { useEffect, useState } from "./hooks.js";
import { Observable } from "./observation/observable.js";
import { Updates } from "./observation/update-queue.js";

describe("The useState hook", () => {
    it("can get and set the value", () => {
        const [get, set] = useState(1);

        expect(get()).equal(1);

        set(2);

        expect(get()).equal(2);
    });

    it("can have its value observed", async () => {
        const [get, set] = useState(1);
        let wasCalled = false;

        Observable.binding(get, {
            handleChange() {
                wasCalled = true;
            }
        }).observe({});

        set(2);

        await Updates.next();

        expect(wasCalled).to.be.true;
    });

    it("can be deeply observed", async () => {
        const [get] = useState({
            a: {
                b: 1,
                c: 2
            }
        }, true);

        let callCount = 0;
        const subscriber = {
            handleChange(binding, observer) {
                callCount++;
            }
        };

        Observable.binding(() => get().a.b, subscriber).observe({});
        Observable.binding(() => get().a.c, subscriber).observe({});

        get().a.b = 2;
        get().a.c = 3;

        await Updates.next();

        expect(callCount).equals(2);
    });
});

describe("The useEffect hook", () => {
    it("responds to changes in state", () => {
        const [get, set] = useState(0);
        const values: number[] = [];

        useEffect(() => {
            values.push(get());
        });

        set(get() + 1);
        set(get() + 1);
        set(get() + 1);
        set(get() + 1);
        set(get() + 1);

        expect(values).members([0, 1, 2, 3, 4, 5]);
    });

    it("can be disposed", () => {
        const [get, set] = useState(0);
        const values: number[] = [];

        const observable = useEffect(() => {
            values.push(get());
        });

        observable.dispose();

        set(get() + 1);
        set(get() + 1);
        set(get() + 1);
        set(get() + 1);
        set(get() + 1);

        expect(values).members([0]);
    });
});
