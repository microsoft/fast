import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement, observable } from "@microsoft/fast-element";

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
RenderableFASTElement(HostEventElement).defineAsync({
    name: "host-event-element",
    templateOptions: "defer-and-hydrate",
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
RenderableFASTElement(HostMultiElement).defineAsync({
    name: "host-multi-element",
    templateOptions: "defer-and-hydrate",
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
RenderableFASTElement(HostStaticElement).defineAsync({
    name: "host-static-element",
    templateOptions: "defer-and-hydrate",
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
RenderableFASTElement(HostEventsElement).defineAsync({
    name: "host-events-element",
    templateOptions: "defer-and-hydrate",
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
RenderableFASTElement(HostMultiContentElement).defineAsync({
    name: "host-multi-content-element",
    templateOptions: "defer-and-hydrate",
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
RenderableFASTElement(HostTextBindingElement).defineAsync({
    name: "host-text-binding-element",
    templateOptions: "defer-and-hydrate",
});

// Test 7: Element with host property binding
class HostPropertyElement extends FASTElement {
    @attr
    text: string = "property test";

    @observable
    hostTitle: string = "tooltip text";

    public clickCount = 0;
}
RenderableFASTElement(HostPropertyElement).defineAsync({
    name: "host-property-element",
    templateOptions: "defer-and-hydrate",
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
RenderableFASTElement(HostAllTypesElement).defineAsync({
    name: "host-all-types-element",
    templateOptions: "defer-and-hydrate",
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
RenderableFASTElement(HostPermAttrFirst).defineAsync({
    name: "host-perm-attr-first",
    templateOptions: "defer-and-hydrate",
});

// Test 10: Permutation - boolean first
class HostPermBoolFirst extends HostPermutationBase {
    @attr
    override text: string = "perm bool first";
}
RenderableFASTElement(HostPermBoolFirst).defineAsync({
    name: "host-perm-bool-first",
    templateOptions: "defer-and-hydrate",
});

// Test 11: Permutation - property first
class HostPermPropFirst extends HostPermutationBase {
    @attr
    override text: string = "perm prop first";
}
RenderableFASTElement(HostPermPropFirst).defineAsync({
    name: "host-perm-prop-first",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
