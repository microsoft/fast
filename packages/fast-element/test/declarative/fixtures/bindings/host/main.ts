import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";

// Test 1: Element with single host event binding and content attribute binding
class HostEventElement extends FASTElement {
    @attr
    greeting: string = "Hello";

    public clickCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`host-event clicked: ${this.clickCount}`);
    };
}
HostEventElement.define({
    name: "host-event-element",
    template: declarativeTemplate(),
});

// Test 2: Element with multiple host bindings (event + boolean)
class HostMultiElement extends FASTElement {
    @attr
    text: string = "World";

    @observable
    isDisabled: boolean = true;

    public clickCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`host-multi clicked: ${this.clickCount}`);
    };
}
HostMultiElement.define({
    name: "host-multi-element",
    template: declarativeTemplate(),
});

// Test 3: Element with static attribute and multiple content bindings
class HostStaticElement extends FASTElement {
    @attr
    first: string = "first";

    @attr
    second: string = "second";

    public clickCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`host-static clicked: ${this.clickCount}`);
    };
}
HostStaticElement.define({
    name: "host-static-element",
    template: declarativeTemplate(),
});

// Test 4: Element with multiple host events
class HostEventsElement extends FASTElement {
    @attr
    text: string = "content text";

    public clickCount = 0;
    public mouseEnterCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`host-events clicked: ${this.clickCount}`);
    };

    public handleMouseEnter = (): void => {
        this.mouseEnterCount++;
        console.log(`host-events mouseenter: ${this.mouseEnterCount}`);
    };
}
HostEventsElement.define({
    name: "host-events-element",
    template: declarativeTemplate(),
});

// Test 5: Element with host event and multiple content attribute bindings
// KEY TEST: Verifies content binding indexes are 0,1 not offset by host bindings
class HostMultiContentElement extends FASTElement {
    @attr
    first: string = "a";

    @attr
    second: string = "b";

    public clickCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`host-multi-content clicked: ${this.clickCount}`);
    };
}
HostMultiContentElement.define({
    name: "host-multi-content-element",
    template: declarativeTemplate(),
});

// Test 6: Element with host event and content text binding
class HostTextBindingElement extends FASTElement {
    @attr
    text: string = "text content";

    public clickCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`host-text-binding clicked: ${this.clickCount}`);
    };
}
HostTextBindingElement.define({
    name: "host-text-binding-element",
    template: declarativeTemplate(),
});

// Test 7: Element with host property binding
class HostPropertyElement extends FASTElement {
    @attr
    text: string = "property test";

    @observable
    hostTitle: string = "tooltip text";

    public clickCount = 0;
}
HostPropertyElement.define({
    name: "host-property-element",
    template: declarativeTemplate(),
});

// Test 8: Element with all host binding types (event + boolean + property + attribute)
class HostAllTypesElement extends FASTElement {
    @attr
    text: string = "all types";

    @observable
    isDisabled: boolean = true;

    @observable
    hostTitle: string = "all types tooltip";

    @attr({ attribute: "attr" })
    hostAttr: string = "value";

    public clickCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`host-all-types clicked: ${this.clickCount}`);
    };
}
HostAllTypesElement.define({
    name: "host-all-types-element",
    template: declarativeTemplate(),
});

// Base class for permutation tests - all have same properties/behavior
class HostPermutationBase extends FASTElement {
    @attr
    text: string = "";

    @observable
    isDisabled: boolean = true;

    @observable
    hostTitle: string = "permutation tooltip";

    @attr({ attribute: "attr" })
    hostAttr: string = "value";

    public clickCount = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log(`${this.tagName.toLowerCase()} clicked: ${this.clickCount}`);
    };
}

// Test 9: Permutation - attribute first
class HostPermAttrFirst extends HostPermutationBase {
    @attr
    override text: string = "perm attr first";
}
HostPermAttrFirst.define({
    name: "host-perm-attr-first",
    template: declarativeTemplate(),
});

// Test 10: Permutation - boolean first
class HostPermBoolFirst extends HostPermutationBase {
    @attr
    override text: string = "perm bool first";
}
HostPermBoolFirst.define({
    name: "host-perm-bool-first",
    template: declarativeTemplate(),
});

// Test 11: Permutation - property first
class HostPermPropFirst extends HostPermutationBase {
    @attr
    override text: string = "perm prop first";
}
HostPermPropFirst.define({
    name: "host-perm-prop-first",
    template: declarativeTemplate(),
});

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
