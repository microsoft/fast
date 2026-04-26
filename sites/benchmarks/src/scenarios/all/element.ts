import { FASTElement, nullableNumberConverter } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { html } from "@microsoft/fast-element/html.js";
import {
    BenchElement as AttrReflectBenchElement,
    template as attrReflectTemplate,
} from "../attr-reflect/element.js";
import {
    BenchElement as BasicBenchElement,
    template as basicTemplate,
} from "../basic/element.js";
import {
    BenchElement as BindEventBenchElement,
    template as bindEventTemplate,
} from "../bind-event/element.js";
import { BenchElement as DotSyntaxElement } from "../dot-syntax/element.js";
import {
    BenchElement as RefSlottedBenchElement,
    template as refSlottedTemplate,
} from "../ref-slotted/element.js";
import {
    BenchElement as RepeatBenchElement,
    template as repeatTemplate,
} from "../repeat/element.js";
import {
    BenchElement as WhenBenchElement,
    template as whenTemplate,
} from "../when/element.js";

AttrReflectBenchElement.define({
    name: "attr-reflect-bench-element",
    template: attrReflectTemplate,
});

BasicBenchElement.define({
    name: "basic-bench-element",
    template: basicTemplate,
});

BindEventBenchElement.define({
    name: "bind-event-bench-element",
    template: bindEventTemplate,
});

RefSlottedBenchElement.define({
    name: "ref-slotted-bench-element",
    template: refSlottedTemplate,
});

RepeatBenchElement.define({
    name: "repeat-bench-element",
    template: repeatTemplate,
});

WhenBenchElement.define({
    name: "when-bench-element",
    template: whenTemplate,
});

DotSyntaxElement.define({
    name: "dot-syntax-bench-element",
});

export class BenchElement extends FASTElement {
    @attr({ converter: nullableNumberConverter })
    count?: number;
}

export const template = html<BenchElement>`
    <attr-reflect-bench-element label="label-${x => x.count}" count="${x => x.count}" active></attr-reflect-bench-element>
    <basic-bench-element></basic-bench-element>
    <bind-event-bench-element></bind-event-bench-element>
    <ref-slotted-bench-element><span>slotted content</span></ref-slotted-bench-element>
    <repeat-bench-element></repeat-bench-element>
    <when-bench-element></when-bench-element>
    <dot-syntax-bench-element></dot-syntax-bench-element>
`;
