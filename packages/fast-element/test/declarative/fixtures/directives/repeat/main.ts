import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { deepMerge } from "@microsoft/fast-element/declarative-utilities.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

export class TestElement extends FASTElement {
    @observable
    list: Array<string> = ["Foo", "Bar"];

    @attr
    item_parent: string = "Bat";
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
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
    template: declarativeTemplate(),
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

TestElementIntervalUpdates.define(
    {
        name: "test-element-interval-updates",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

export class TestElementNoItemRepeatBinding extends FASTElement {
    @observable
    list: Array<string> = [];
}
TestElementNoItemRepeatBinding.define({
    name: "test-element-no-item-repeat-binding",
    template: declarativeTemplate(),
});

export class TestElementEmptyArray extends FASTElement {
    @observable
    list: Array<string> = [];
}
TestElementEmptyArray.define({
    name: "test-element-empty-array",
    template: declarativeTemplate(),
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
    template: declarativeTemplate(),
});

export class TestElementWithObserverMap extends FASTElement {
    list: Array<string> = ["Foo", "Bar"];

    @attr
    item_parent: string = "Bat";
}
TestElementWithObserverMap.define(
    {
        name: "test-element-with-observer-map",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
