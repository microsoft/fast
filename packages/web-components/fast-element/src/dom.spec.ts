import { expect } from "chai";
import { DOM } from "./dom";

describe("The DOM", () => {
    it("can batch updates", async () => {
        let work1 = 0;
        let work2 = 0;
        const task1 = () => work1++;
        const task2 = () => work2++;

        DOM.queueUpdate(task1);
        expect(work1).to.equal(0);

        DOM.queueUpdate(task2);
        expect(work1).to.equal(0);
        expect(work2).to.equal(0);

        await DOM.nextUpdate();

        expect(work1).to.equal(1);
        expect(work2).to.equal(1);
    });
});
