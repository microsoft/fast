import { ViewTemplateConverter } from "@microsoft/fast-html";
import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { json } from "../../../src/components/plugins/json/index.js";

const converter = new ViewTemplateConverter(json);

// ─── Basic (slot) ─────────────────────────────────────────────────────────────

class ConverterBasicElement extends FASTElement {}
ConverterBasicElement.define({
    name: "converter-basic",
    template: converter.create({ nodes: [{ type: "element", tagName: "slot" }] }),
});

// ─── Content binding ──────────────────────────────────────────────────────────

export class ConverterBindingElement extends FASTElement {
    @attr text: string = "";
}
ConverterBindingElement.define({
    name: "converter-binding",
    template: converter.create({
        nodes: [{ type: "binding", expression: "text" }],
    }),
});

// ─── Unescaped HTML ───────────────────────────────────────────────────────────

export class ConverterUnescapedElement extends FASTElement {
    @attr html: string = "";
}
ConverterUnescapedElement.define({
    name: "converter-unescaped",
    template: converter.create({
        nodes: [{ type: "unescaped-html", expression: "html" }],
    }),
});

// ─── Attribute reflect ────────────────────────────────────────────────────────

export class ConverterAttrReflectElement extends FASTElement {
    @attr label: string = "";
    @attr count: string = "";
}
ConverterAttrReflectElement.define({
    name: "converter-attr-reflect",
    template: converter.create({
        nodes: [
            {
                type: "element",
                tagName: "span",
                attributes: {
                    "data-label": { type: "bound", expression: "label" },
                    class: { type: "static", value: "item" },
                },
                children: [
                    { type: "binding", expression: "label" },
                    { type: "text", value: " (" },
                    { type: "binding", expression: "count" },
                    { type: "text", value: ")" },
                ],
            },
        ],
    }),
});

// ─── Events ───────────────────────────────────────────────────────────────────

export class ConverterEventElement extends FASTElement {
    @attr foo: string = "";

    public handleNoArgsClick = (): void => {
        console.log("no args");
    };

    public handleEventArgClick = (e: MouseEvent): void => {
        console.log(e.type);
    };

    public handleAttributeArgClick = (foo: string): void => {
        console.log(foo);
    };

    public handleModifyAttributeClick = (): void => {
        this.foo = "modified-by-click";
    };
}
ConverterEventElement.define({
    name: "converter-event",
    template: converter.create({
        nodes: [
            {
                type: "element",
                tagName: "button",
                attributes: {
                    click: { type: "event", handler: "handleNoArgsClick" },
                },
                children: [{ type: "text", value: "no-args" }],
            },
            {
                type: "element",
                tagName: "button",
                attributes: {
                    click: {
                        type: "event",
                        handler: "handleEventArgClick",
                        argument: "e",
                    },
                },
                children: [{ type: "text", value: "event-arg" }],
            },
            {
                type: "element",
                tagName: "button",
                attributes: {
                    click: {
                        type: "event",
                        handler: "handleAttributeArgClick",
                        argument: "foo",
                    },
                },
                children: [{ type: "text", value: "attr-arg" }],
            },
            {
                type: "element",
                tagName: "button",
                attributes: {
                    click: {
                        type: "event",
                        handler: "handleModifyAttributeClick",
                    },
                },
                children: [{ type: "text", value: "modify-attr" }],
            },
        ],
    }),
});

// ─── When: boolean ────────────────────────────────────────────────────────────

class ConverterWhenBooleanElement extends FASTElement {
    @attr({ mode: "boolean" }) show: boolean = false;
}
ConverterWhenBooleanElement.define({
    name: "converter-when-boolean",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "show",
                children: [{ type: "text", value: "Hello world" }],
            },
        ],
    }),
});

// ─── When: negation ───────────────────────────────────────────────────────────

class ConverterWhenNotElement extends FASTElement {
    @attr({ mode: "boolean" }) hide: boolean = false;
}
ConverterWhenNotElement.define({
    name: "converter-when-not",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "!hide",
                children: [{ type: "text", value: "Hello world" }],
            },
        ],
    }),
});

// ─── When: equals (==) ────────────────────────────────────────────────────────

class ConverterWhenEqualsElement extends FASTElement {
    @attr({ attribute: "var-a" }) varA: number = 0;
}
ConverterWhenEqualsElement.define({
    name: "converter-when-equals",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "varA == 3",
                children: [{ type: "text", value: "Equals 3" }],
            },
        ],
    }),
});

// ─── When: not equals (!=) ────────────────────────────────────────────────────

class ConverterWhenNotEqualsElement extends FASTElement {
    @attr({ attribute: "var-a" }) varA: number = 0;
}
ConverterWhenNotEqualsElement.define({
    name: "converter-when-not-equals",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "varA != 3",
                children: [{ type: "text", value: "Not equals 3" }],
            },
        ],
    }),
});

// ─── When: greater than or equal (>=) ────────────────────────────────────────

class ConverterWhenGeElement extends FASTElement {
    @attr({ attribute: "var-a" }) varA: number = 0;
}
ConverterWhenGeElement.define({
    name: "converter-when-ge",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "varA >= 2",
                children: [{ type: "text", value: "Two and Over" }],
            },
        ],
    }),
});

// ─── When: greater than (>) ───────────────────────────────────────────────────

class ConverterWhenGtElement extends FASTElement {
    @attr({ attribute: "var-a" }) varA: number = 0;
}
ConverterWhenGtElement.define({
    name: "converter-when-gt",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "varA > 2",
                children: [{ type: "text", value: "Over two" }],
            },
        ],
    }),
});

// ─── When: less than or equal (<=) ───────────────────────────────────────────

class ConverterWhenLeElement extends FASTElement {
    @attr({ attribute: "var-a" }) varA: number = 0;
}
ConverterWhenLeElement.define({
    name: "converter-when-le",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "varA <= 2",
                children: [{ type: "text", value: "Two and Under" }],
            },
        ],
    }),
});

// ─── When: less than (<) ──────────────────────────────────────────────────────

class ConverterWhenLtElement extends FASTElement {
    @attr({ attribute: "var-a" }) varA: number = 0;
}
ConverterWhenLtElement.define({
    name: "converter-when-lt",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "varA < 2",
                children: [{ type: "text", value: "Under two" }],
            },
        ],
    }),
});

// ─── When: logical OR (||) ────────────────────────────────────────────────────

class ConverterWhenOrElement extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" }) thisVar: boolean = false;
    @attr({ attribute: "that-var", mode: "boolean" }) thatVar: boolean = false;
}
ConverterWhenOrElement.define({
    name: "converter-when-or",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "thisVar || thatVar",
                children: [{ type: "text", value: "This or That" }],
            },
        ],
    }),
});

// ─── When: logical AND (&&) ───────────────────────────────────────────────────

class ConverterWhenAndElement extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" }) thisVar: boolean = false;
    @attr({ attribute: "that-var", mode: "boolean" }) thatVar: boolean = false;
}
ConverterWhenAndElement.define({
    name: "converter-when-and",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "thisVar && thatVar",
                children: [{ type: "text", value: "This and That" }],
            },
        ],
    }),
});

// ─── When: event inside when block ────────────────────────────────────────────

export class ConverterWhenEventElement extends FASTElement {
    @attr({ mode: "boolean" }) show: boolean = false;

    @observable clickCount: number = 0;

    public handleClick = (): void => {
        this.clickCount++;
    };
}
ConverterWhenEventElement.define({
    name: "converter-when-event",
    template: converter.create({
        nodes: [
            {
                type: "when",
                expression: "show",
                children: [
                    {
                        type: "element",
                        tagName: "button",
                        attributes: {
                            click: { type: "event", handler: "handleClick" },
                        },
                        children: [{ type: "text", value: "Click me" }],
                    },
                ],
            },
        ],
    }),
});

// ─── Repeat ───────────────────────────────────────────────────────────────────

export class ConverterRepeatElement extends FASTElement {
    @attr({ attribute: "item-parent" }) itemParent: string = "";

    @observable list: string[] = ["Foo", "Bar"];
}
ConverterRepeatElement.define({
    name: "converter-repeat",
    template: converter.create({
        nodes: [
            {
                type: "element",
                tagName: "ul",
                children: [
                    {
                        type: "repeat",
                        item: "item",
                        list: "list",
                        children: [
                            {
                                type: "element",
                                tagName: "li",
                                children: [
                                    { type: "binding", expression: "item" },
                                    { type: "text", value: " - " },
                                    {
                                        type: "binding",
                                        expression: "$c.parent.itemParent",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    }),
});

// ─── Repeat with event via $c.parent ──────────────────────────────────────────

export class ConverterRepeatEventElement extends FASTElement {
    @observable list: string[] = ["A"];
    @observable clickCount: number = 0;

    public handleClick = (): void => {
        this.clickCount++;
    };
}
ConverterRepeatEventElement.define({
    name: "converter-repeat-event",
    template: converter.create({
        nodes: [
            {
                type: "element",
                tagName: "ul",
                children: [
                    {
                        type: "repeat",
                        item: "item",
                        list: "list",
                        children: [
                            {
                                type: "element",
                                tagName: "button",
                                attributes: {
                                    click: {
                                        type: "event",
                                        handler: "$c.parent.handleClick",
                                    },
                                },
                                children: [
                                    { type: "binding", expression: "item" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    }),
});

// ─── Dot syntax ───────────────────────────────────────────────────────────────

export class ConverterDotSyntaxElement extends FASTElement {
    @observable user: { name: string; address: { city: string } } = {
        name: "Alice",
        address: { city: "Seattle" },
    };
}
ConverterDotSyntaxElement.define({
    name: "converter-dot-syntax",
    template: converter.create({
        nodes: [
            { type: "binding", expression: "user.name" },
            { type: "text", value: " from " },
            { type: "binding", expression: "user.address.city" },
        ],
    }),
});

// ─── Ref ──────────────────────────────────────────────────────────────────────

export class ConverterRefElement extends FASTElement {
    heading: Element | null = null;
}
ConverterRefElement.define({
    name: "converter-ref",
    template: converter.create({
        nodes: [
            {
                type: "element",
                tagName: "h1",
                attributes: { "f-ref": { type: "ref", property: "heading" } },
                children: [{ type: "text", value: "Hello" }],
            },
        ],
    }),
});

// ─── Slotted: all nodes ───────────────────────────────────────────────────────

export class ConverterSlottedElement extends FASTElement {
    @observable slottedNodes: Node[] = [];
}
ConverterSlottedElement.define({
    name: "converter-slotted",
    template: converter.create({
        nodes: [
            {
                type: "element",
                tagName: "slot",
                attributes: {
                    "f-slotted": { type: "slotted", property: "slottedNodes" },
                },
            },
        ],
    }),
});

// ─── Slotted: elements() filter ───────────────────────────────────────────────

export class ConverterSlottedFilteredElement extends FASTElement {
    @observable filteredNodes: Node[] = [];
}
ConverterSlottedFilteredElement.define({
    name: "converter-slotted-filtered",
    template: converter.create({
        nodes: [
            {
                type: "element",
                tagName: "slot",
                attributes: {
                    "f-slotted": {
                        type: "slotted",
                        property: "filteredNodes",
                        filter: { type: "elements" },
                    },
                },
            },
        ],
    }),
});
