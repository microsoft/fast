import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";
import { volatile } from "@microsoft/fast-element/observable.js";

let markSequence = 0;

class FastCard extends FASTElement {
    @attr({ attribute: "defer-delay" })
    deferDelay!: number;

    @volatile
    get displayDelay(): string {
        return `${(this.deferDelay ?? 0).toString()}ms`;
    }
}

FastCard.define({
    name: "fast-card",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationStarted(): void {
        performance.mark("hydration:started", { detail: { sequence: markSequence++ } });
    },

    templateWillUpdate(name: string) {
        performance.mark(`template-update:${name}:start`, {
            detail: { sequence: markSequence++ },
        });
    },

    templateDidUpdate(name) {
        performance.measure(`template-update:${name}`, `template-update:${name}:start`);
    },

    elementDidDefine(name) {
        performance.mark(`element-define:${name}`, {
            detail: { sequence: markSequence++ },
        });
    },

    elementDidRegister(name) {
        performance.mark(`element-register:${name}`, {
            detail: { sequence: markSequence++ },
        });
    },

    hydrationComplete(): void {
        performance.measure("hydration:complete", "hydration:started");
        (window as any).hydrationCompleted = true;
    },
}).define({ name: "f-template" });
