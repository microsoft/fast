import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";

export class TestElement extends FASTElement {
    @observable
    list: Array<string> = ["Foo", "Bar"];

    @attr
    item_parent: string = "Bat";
}
TestElement.define({
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
TestElementInnerWhen.define({
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

TestElementIntervalUpdates.define({
    name: "test-element-interval-updates",
    templateOptions: "defer-and-hydrate",
});

export class TestElementNoItemRepeatBinding extends FASTElement {
    @observable
    list: Array<string> = [];
}
TestElementNoItemRepeatBinding.define({
    name: "test-element-no-item-repeat-binding",
    templateOptions: "defer-and-hydrate",
});

export class TestElementEmptyArray extends FASTElement {
    @observable
    list: Array<string> = [];
}
TestElementEmptyArray.define({
    name: "test-element-empty-array",
    templateOptions: "defer-and-hydrate",
});

export class TestElementEvent extends FASTElement {
    @observable
    list: Array<string> = ["A"];

    @observable
    clickCount: number = 0;

    public handleClick = (): void => {
        this.clickCount++;
    };
}
TestElementEvent.define({
    name: "test-element-event",
    templateOptions: "defer-and-hydrate",
});

export class TestElementWithObserverMap extends FASTElement {
    list: Array<string> = ["Foo", "Bar"];

    @attr
    item_parent: string = "Bat";
}
TestElementWithObserverMap.define({
    name: "test-element-with-observer-map",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "test-element-interval-updates": {
        observerMap: "all",
    },
    "test-element-with-observer-map": {
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
