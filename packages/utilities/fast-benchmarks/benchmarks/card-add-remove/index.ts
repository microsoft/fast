import { Card, fastCard } from "@microsoft/fast-components";
import { DOM, Observable } from "@microsoft/fast-element";
import { DesignSystem } from "@microsoft/fast-foundation";

DesignSystem.getOrCreate().register(fastCard());

export default new Benchmark(
    "card-add-remove",
    function (deferred: any): void {
        const element = document.createElement("fast-card") as Card;
        Observable.getNotifier(element.$fastController).subscribe(
            {
                handleChange() {
                    DOM.queueUpdate(() => {
                        document.body.removeChild(element);
                        deferred.resolve();
                    });
                },
            },
            "isConnected"
        );

        document.body.appendChild(element);
    },
    { defer: true }
);
