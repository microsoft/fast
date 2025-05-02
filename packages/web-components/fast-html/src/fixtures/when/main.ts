import { TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestElement.define({
    name: "test-element",
});

class TestElementNot extends FASTElement {
    @attr({ mode: "boolean" })
    hide: boolean = false;
}
TestElementNot.define({
    name: "test-element-not",
});

class TestElementEquals extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementEquals.define({
    name: "test-element-equals",
});

class TestElementNotEquals extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementNotEquals.define({
    name: "test-element-not-equals",
});

class TestElementGe extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGe.define({
    name: "test-element-ge",
});

class TestElementGt extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementGt.define({
    name: "test-element-gt",
});

class TestElementLe extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLe.define({
    name: "test-element-le",
});

class TestElementLt extends FASTElement {
    @attr({ attribute: "var-a" })
    varA: number = 0;
}
TestElementLt.define({
    name: "test-element-lt",
});

class TestElementOr extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementOr.define({
    name: "test-element-or",
});

class TestElementAnd extends FASTElement {
    @attr({ attribute: "this-var", mode: "boolean" })
    thisVar: boolean = false;

    @attr({ attribute: "that-var", mode: "boolean" })
    thatVar: boolean = false;
}
TestElementAnd.define({
    name: "test-element-and",
    shadowOptions: null,
});

TemplateElement.options({
    "test-element": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-not": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-equals": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-not-equals": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-ge": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-gt": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-le": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-lt": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-or": {
        shadowOptions: {
            mode: "closed",
        },
    },
    "test-element-and": {
        shadowOptions: {
            mode: "closed",
        },
    },
}).define({
    name: "f-template",
});
