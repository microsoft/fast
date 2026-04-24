import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestElementMultiple extends FASTElement {
    @attr()
    planet: string = "";
}
TestElementMultiple.define({
    name: "test-element-multiple",
});

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
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementEquals.define({
    name: "test-element-equals",
});

class TestElementNotEquals extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementNotEquals.define({
    name: "test-element-not-equals",
});

class TestElementGe extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementGe.define({
    name: "test-element-ge",
});

class TestElementGt extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementGt.define({
    name: "test-element-gt",
});

class TestElementLe extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementLe.define({
    name: "test-element-le",
});

class TestElementLt extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementLt.define({
    name: "test-element-lt",
});

class TestElementOr extends FASTElement {
    @attr({ attribute: "thisvar", mode: "boolean" })
    thisvar: boolean = false;

    @attr({ attribute: "thatvar", mode: "boolean" })
    thatvar: boolean = false;
}
TestElementOr.define({
    name: "test-element-or",
});

class TestElementAnd extends FASTElement {
    @attr({ attribute: "thisvar", mode: "boolean" })
    thisvar: boolean = false;

    @attr({ attribute: "thatvar", mode: "boolean" })
    thatvar: boolean = false;
}
TestElementAnd.define({
    name: "test-element-and",
});

export class TestElementWhenFalseRepeat extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;

    @observable
    list: Array<string> = ["Alpha", "Beta", "Gamma"];
}
TestElementWhenFalseRepeat.define({
    name: "test-element-when-false-repeat",
});

export class TestElementEvent extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;

    @observable
    clickCount: number = 0;

    public handleClick = (): void => {
        this.clickCount++;
    };
}
TestElementEvent.define({
    name: "test-element-event",
});

export class NestedWhenElement extends FASTElement {
    strings = {
        errorMessage: "Error occurred",
        continueButtonText: "Continue",
        retryButtonText: "Retry",
    };

    @observable
    error: boolean = false;

    @observable
    showProgress: boolean = true;

    @observable
    enableContinue: boolean = false;

    @observable
    clickCount: number = 0;

    public handleClick = (): void => {
        this.clickCount++;
    };
}
NestedWhenElement.define({
    name: "nested-when",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
