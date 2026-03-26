import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { runBenchmark } from "../../harness.js";
import {
    AttrReflectElement,
    BasicElement,
    BindEventElement,
    DotSyntaxElement,
    RefSlottedElement,
    RepeatElement,
    WhenElement,
} from "../element.js";

const elementNames = [
    "bench-basic",
    "bench-attr-reflect",
    "bench-bind-event",
    "bench-dot-syntax",
    "bench-ref-slotted",
    "bench-repeat",
    "bench-when",
];

RenderableFASTElement(BasicElement).defineAsync({ name: "bench-basic" });
RenderableFASTElement(AttrReflectElement).defineAsync({ name: "bench-attr-reflect" });
RenderableFASTElement(BindEventElement).defineAsync({ name: "bench-bind-event" });
RenderableFASTElement(DotSyntaxElement).defineAsync({ name: "bench-dot-syntax" });
RenderableFASTElement(RefSlottedElement).defineAsync({ name: "bench-ref-slotted" });
RenderableFASTElement(RepeatElement).defineAsync({ name: "bench-repeat" });
RenderableFASTElement(WhenElement).defineAsync({ name: "bench-when" });

let definedCount = 0;

TemplateElement.config({
    elementDidDefine() {
        if (++definedCount === elementNames.length) {
            let idx = 0;
            runBenchmark(() =>
                document.createElement(elementNames[idx++ % elementNames.length]),
            );
        }
    },
})
    .options({ "bench-dot-syntax": { observerMap: "all" } })
    .define({ name: "f-template" });
