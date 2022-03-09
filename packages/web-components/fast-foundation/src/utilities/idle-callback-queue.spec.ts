import { DOM } from "@microsoft/fast-element";
import { IdleCallbackQueue } from "./idle-callback-queue";
import { expect } from "chai";

describe("The idle callback queu", () => {
    it("has a default timeout of 1000", () => {
        const queue: IdleCallbackQueue = new IdleCallbackQueue();
        expect(queue.idleCallbackTimeout).to.equal(1000);
    });

    it("executes callback functions", async () => {
        const queue: IdleCallbackQueue = new IdleCallbackQueue();
        queue.idleCallbackTimeout = 0;
        const target: HTMLDivElement = document.createElement("div");

        queue.requestIdleCallback(target, () => { target.setAttribute("title", "test")});

        await DOM.nextUpdate();
        await DOM.nextUpdate();

        expect(target.title).to.equal("test");
    });

    it("cancels callback functions when cancelIdleCallback is called", async () => {
        const queue: IdleCallbackQueue = new IdleCallbackQueue();
        queue.idleCallbackTimeout = 0;
        const target: HTMLDivElement = document.createElement("div");

        queue.requestIdleCallback(target, () => { target.setAttribute("title", "test")});
        queue.cancelIdleCallback(target);

        await DOM.nextUpdate();
        await DOM.nextUpdate();

        expect(target.title).to.equal("");
    });
});
