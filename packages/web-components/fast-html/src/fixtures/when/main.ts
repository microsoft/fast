import { TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

class TestElementNot extends FASTElement {
    @attr({ mode: "boolean" })
    hide: boolean = false;
}
TestElementNot.defineAsync({
    name: "test-element-not",
    templateOptions: "hydrate",
});

class TestElementEquals extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementEquals.defineAsync({
    name: "test-element-equals",
    templateOptions: "hydrate",
});

class TestElementNotEquals extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementNotEquals.defineAsync({
    name: "test-element-not-equals",
    templateOptions: "hydrate",
});

class TestElementGe extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGe.defineAsync({
    name: "test-element-ge",
    templateOptions: "hydrate",
});

class TestElementGt extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGt.defineAsync({
    name: "test-element-gt",
    templateOptions: "hydrate",
});

class TestElementLe extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLe.defineAsync({
    name: "test-element-le",
    templateOptions: "hydrate",
});

class TestElementLt extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLt.defineAsync({
    name: "test-element-lt",
    templateOptions: "hydrate",
});

class TestElementOr extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementOr.defineAsync({
    name: "test-element-or",
    templateOptions: "hydrate",
});

class TestElementAnd extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementAnd.defineAsync({
    name: "test-element-and",
    templateOptions: "hydrate",
});

TemplateElement.define({
    name: "f-template",
});
