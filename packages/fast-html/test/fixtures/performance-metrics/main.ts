import { attr, FASTElement, observable, volatile } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

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

    async prepare() {
        await new Promise(resolve => setTimeout(resolve, this.deferDelay));
    }
}

FastCard.defineAsync({
    name: "fast-card",
    templateOptions: "defer-and-hydrate",
});

let hydrationMarks: WeakMap<HTMLElement, string>;
let markId = 0;

TemplateElement.config({
    templateWillUpdate(name: string) {
        if (!hydrationMarks) {
            hydrationMarks = new WeakMap<HTMLElement, string>();
            performance.mark("hydration:started");
        }
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
