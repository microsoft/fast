import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { signalDone } from "../../harness.js";
import {
    AttrReflectElement,
    BasicElement,
    BindEventElement,
    DotSyntaxElement,
    RefSlottedElement,
    RepeatElement,
    WhenElement,
} from "../element.js";

RenderableFASTElement(BasicElement).defineAsync({
    name: "bench-basic",
    templateOptions: "defer-and-hydrate",
});
RenderableFASTElement(AttrReflectElement).defineAsync({
    name: "bench-attr-reflect",
    templateOptions: "defer-and-hydrate",
});
RenderableFASTElement(BindEventElement).defineAsync({
    name: "bench-bind-event",
    templateOptions: "defer-and-hydrate",
});
RenderableFASTElement(DotSyntaxElement).defineAsync({
    name: "bench-dot-syntax",
    templateOptions: "defer-and-hydrate",
});
RenderableFASTElement(RefSlottedElement).defineAsync({
    name: "bench-ref-slotted",
    templateOptions: "defer-and-hydrate",
});
RenderableFASTElement(RepeatElement).defineAsync({
    name: "bench-repeat",
    templateOptions: "defer-and-hydrate",
});
RenderableFASTElement(WhenElement).defineAsync({
    name: "bench-when",
    templateOptions: "defer-and-hydrate",
});

performance.mark("bench-start");

TemplateElement.config({
    hydrationComplete() {
        performance.mark("bench-end");
        signalDone();
    },
})
    .options({ "bench-dot-syntax": { observerMap: "all" } })
    .define({ name: "f-template" });
