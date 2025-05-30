import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

class TestElementNot extends RenderableFASTElement {
    @attr({ mode: "boolean" })
    hide: boolean = false;
}
TestElementNot.define({
    name: "test-element-not",
    shadowOptions: null,
});

class TestElementEquals extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementEquals.define({
    name: "test-element-equals",
    shadowOptions: null,
});

class TestElementNotEquals extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementNotEquals.define({
    name: "test-element-not-equals",
    shadowOptions: null,
});

class TestElementGe extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGe.define({
    name: "test-element-ge",
    shadowOptions: null,
});

class TestElementGt extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGt.define({
    name: "test-element-gt",
    shadowOptions: null,
});

class TestElementLe extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLe.define({
    name: "test-element-le",
    shadowOptions: null,
});

class TestElementLt extends RenderableFASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLt.define({
    name: "test-element-lt",
    shadowOptions: null,
});

class TestElementOr extends RenderableFASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementOr.define({
    name: "test-element-or",
    shadowOptions: null,
});

class TestElementAnd extends RenderableFASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementAnd.define({
    name: "test-element-and",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
