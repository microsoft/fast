import { DOM } from "@microsoft/fast-element";
export default new Benchmark(
    "queue-update",
    function (deferred: any): void {
        DOM.queueUpdate(() => deferred.resolve());
    },
    { defer: true }
);
