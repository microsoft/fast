import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementNot extends RenderableFASTElement {
    @attr({ mode: "boolean" })
    hide: boolean = false;
}
TestElementNot.defineAsync({
    name: "test-element-not",
    templateOptions: "defer-and-hydrate",
});

class TestElementEquals extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementEquals.defineAsync({
    name: "test-element-equals",
    templateOptions: "defer-and-hydrate",
});

class TestElementNotEquals extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementNotEquals.defineAsync({
    name: "test-element-not-equals",
    templateOptions: "defer-and-hydrate",
});

class TestElementGe extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGe.defineAsync({
    name: "test-element-ge",
    templateOptions: "defer-and-hydrate",
});

class TestElementGt extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGt.defineAsync({
    name: "test-element-gt",
    templateOptions: "defer-and-hydrate",
});

class TestElementLe extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLe.defineAsync({
    name: "test-element-le",
    templateOptions: "defer-and-hydrate",
});

class TestElementLt extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLt.defineAsync({
    name: "test-element-lt",
    templateOptions: "defer-and-hydrate",
});

class TestElementOr extends RenderableFASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementOr.defineAsync({
    name: "test-element-or",
    templateOptions: "defer-and-hydrate",
});

class TestElementAnd extends RenderableFASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementAnd.defineAsync({
    name: "test-element-and",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
