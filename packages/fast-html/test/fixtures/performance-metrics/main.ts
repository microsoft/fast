import { attr, FASTElement, observable, volatile } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

let hydrationMarks: WeakMap<HTMLElement, string>;
let markId = 0;
let markSequence = 0;

class FastCard extends RenderableFASTElement(FASTElement) {
    @attr({ attribute: "defer-delay" })
    deferDelay!: number;

    @volatile
    get displayDelay(): string {
        return `${(this.deferDelay ?? 0).toString()}ms`;
    }

    @observable
    componentType: string = "default";

    @observable
    willHydrate: string = "";

    @observable
    didHydrate: string = "";

    @observable
    hydrationDuration: string = "";

    // Set inside prepare(), not as a field initializer, because prepare()
    // runs during super() before field initializers execute.
    private uniqueId!: string;

    async prepare() {
        this.uniqueId = Math.random().toString(16).slice(2);
        const markName = `element-prepare-start:${this.localName}:${this.uniqueId}`;
        performance.mark(markName);

        // Read from the DOM attribute directly because prepare() runs during
        // super() before boundObservables are applied, so this.deferDelay is
        // still undefined at this point.
        const delay = Number(this.getAttribute("defer-delay")) || 0;

        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        performance.measure(`element-prepared:${this.localName}:${this.uniqueId}`, {
            start: markName,
            detail: { delay },
        });
    }
}

FastCard.defineAsync({
    name: "fast-card",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationStarted(): void {
        hydrationMarks = new WeakMap<HTMLElement, string>();
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

    elementWillHydrate(source: HTMLElement): void {
        const markName = `hydration:${source.localName}:${markId++}`;
        hydrationMarks.set(source, markName);
        const mark = performance.mark(markName);

        if (source instanceof FastCard) {
            source.willHydrate = `${mark.startTime.toPrecision(4)}ms`;
        }
    },

    elementDidHydrate(source: HTMLElement): void {
        const markName = hydrationMarks.get(source);

        if (markName) {
            const measure = performance.measure(
                `hydration:${source.localName}`,
                markName
            );
            hydrationMarks.delete(source);

            if (source instanceof FastCard) {
                source.didHydrate = `${(measure.startTime + measure.duration).toPrecision(
                    4
                )}ms`;
                source.hydrationDuration = `${measure.duration.toPrecision(4)}ms`;
            }
        }
    },

    hydrationComplete(): void {
        performance.measure("hydration:complete", "hydration:started");
    },
}).define({ name: "f-template" });

(window as any).getHydrationComplete = () =>
    performance.getEntriesByName("hydration:complete", "measure").length > 0;
