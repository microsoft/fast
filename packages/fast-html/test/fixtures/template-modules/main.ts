import { attr, FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TmSimpleA extends FASTElement {
    @attr
    text: string = "";
}

class TmSimpleB extends FASTElement {
    @attr
    value: string = "";
}

class TmWithPartial extends FASTElement {
    @attr
    title: string = "";

    @attr
    description: string = "";
}

class TmSiblingA extends FASTElement {
    @attr
    title: string = "";

    @attr
    note: string = "";
}

class TmSiblingB extends FASTElement {
    @attr
    title: string = "";

    @attr
    note: string = "";
}

RenderableFASTElement(TmSimpleA).defineAsync({
    name: "tm-simple-a",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(TmSimpleB).defineAsync({
    name: "tm-simple-b",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(TmWithPartial).defineAsync({
    name: "tm-with-partial",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(TmSiblingA).defineAsync({
    name: "tm-sibling-a",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(TmSiblingB).defineAsync({
    name: "tm-sibling-b",
    templateOptions: "defer-and-hydrate",
});

(window as any).definedElements = {};

TemplateElement.config({
    elementDidDefine(name: string) {
        (window as any).definedElements[name] = true;
    },
}).define({
    name: "f-template",
});
