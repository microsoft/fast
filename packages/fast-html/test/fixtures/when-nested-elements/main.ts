import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

const RenderableElement = RenderableFASTElement(FASTElement);

// Mock data source - simulating fetched data, matching the pre-rendered state.
const mockDataSource = {
    getData() {
        return { show: true, text: "Hello", items: [{ text: "Hello" }] };
    },
};

/**
 * Renders a `defer-and-hydrate` child inside a conditional content binding. The
 * condition is true at render time, so the pre-rendered DOM contains the child.
 */
export class WhenParent extends RenderableElement {
    @observable
    public show: boolean = false;

    @observable
    public text: string = "";

    async prepare() {
        const data = mockDataSource.getData();

        this.show = data.show;
        this.text = data.text;
    }
}

/**
 * The control: the same child rendered through a repeat binding instead. Swapping
 * the surrounding directive is the only difference between this and WhenParent.
 */
export class RepeatParent extends RenderableElement {
    @observable
    public items: Array<{ text: string }> = [];

    async prepare() {
        this.items = mockDataSource.getData().items;
    }
}

/**
 * The condition was true when the page was rendered, so the pre-rendered DOM
 * contains the child, but the value backing the condition has not resolved by the
 * time the element hydrates - as happens when the condition depends on data that
 * arrives after hydration. The pre-rendered content must be reconciled away rather
 * than left behind, and must not be duplicated once the value does resolve.
 */
export class WhenStaleParent extends RenderableElement {
    @observable
    public show: boolean = false;

    @observable
    public text: string = "Hello";
}

/**
 * The control for {@link WhenStaleParent}: a repeat binding reconciles the same
 * pre-rendered/hydration mismatch correctly.
 */
export class RepeatStaleParent extends RenderableElement {
    @observable
    public items: Array<{ text: string }> = [];
}

export class DeferredChild extends RenderableElement {
    @attr
    public text: string = "";
}

RenderableFASTElement(WhenParent).defineAsync({
    name: "when-parent",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(RepeatParent).defineAsync({
    name: "repeat-parent",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(WhenStaleParent).defineAsync({
    name: "when-stale-parent",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(RepeatStaleParent).defineAsync({
    name: "repeat-stale-parent",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(DeferredChild).defineAsync({
    name: "deferred-child",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "when-parent": {
        observerMap: "all",
    },
    "repeat-parent": {
        observerMap: "all",
    },
    "when-stale-parent": {
        observerMap: "all",
    },
    "repeat-stale-parent": {
        observerMap: "all",
    },
    "deferred-child": {
        observerMap: "all",
    },
})
    .config({
        hydrationComplete() {
            (window as any).hydrationCompleted = true;
        },
    })
    .define({
        name: "f-template",
    });
