import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";
import { FASTElement, observable } from "@microsoft/fast-element";

export class TestElement extends FASTElement {
    @observable
    list: Array<string> = ["Foo", "Bar"];

    item_parent: string = "Bat";
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

export class TestElementInnerWhen extends FASTElement {
    @observable
    list: Array<any> = [
        {
            show: true,
            text: "Foo",
        },
        {
            show: false,
            text: "Bar",
        },
    ];
}
RenderableFASTElement(TestElementInnerWhen).defineAsync({
    name: "test-element-inner-when",
    templateOptions: "defer-and-hydrate",
});

export class TestElementIntervalUpdates extends FASTElement {
    someData = { list1: [{ icon: "repeat" }], list2: [{ icon: "repeat" }] };

    updateData() {
        deepMerge(this.someData, {
            list1: [{ icon: "repeat" }],
            list2: [{ icon: "repeat" }],
        });
    }
}

RenderableFASTElement(TestElementIntervalUpdates).defineAsync({
    name: "test-element-interval-updates",
    templateOptions: "defer-and-hydrate",
});

export class TestElementNoItemRepeatBinding extends FASTElement {
    @observable
    list: Array<string> = [];
}
RenderableFASTElement(TestElementNoItemRepeatBinding).defineAsync({
    name: "test-element-no-item-repeat-binding",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "test-element-interval-updates": {
        observerMap: "all",
    },
}).define({
    name: "f-template",
});
