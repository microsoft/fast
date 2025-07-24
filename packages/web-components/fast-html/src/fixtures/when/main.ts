import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementNot extends FASTElement {
    @attr({ mode: "boolean" })
    hide: boolean = false;
}
RenderableFASTElement(TestElementNot).defineAsync({
    name: "test-element-not",
    templateOptions: "defer-and-hydrate",
});

class TestElementEquals extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
RenderableFASTElement(TestElementEquals).defineAsync({
    name: "test-element-equals",
    templateOptions: "defer-and-hydrate",
});

class TestElementNotEquals extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
RenderableFASTElement(TestElementNotEquals).defineAsync({
    name: "test-element-not-equals",
    templateOptions: "defer-and-hydrate",
});

class TestElementGe extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
RenderableFASTElement(TestElementGe).defineAsync({
    name: "test-element-ge",
    templateOptions: "defer-and-hydrate",
});

class TestElementGt extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
RenderableFASTElement(TestElementGt).defineAsync({
    name: "test-element-gt",
    templateOptions: "defer-and-hydrate",
});

class TestElementLe extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
RenderableFASTElement(TestElementLe).defineAsync({
    name: "test-element-le",
    templateOptions: "defer-and-hydrate",
});

class TestElementLt extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
RenderableFASTElement(TestElementLt).defineAsync({
    name: "test-element-lt",
    templateOptions: "defer-and-hydrate",
});

class TestElementOr extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
RenderableFASTElement(TestElementOr).defineAsync({
    name: "test-element-or",
    templateOptions: "defer-and-hydrate",
});

class TestElementAnd extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
RenderableFASTElement(TestElementAnd).defineAsync({
    name: "test-element-and",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
