import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class TestElementMultiple extends FASTElement {
    @attr()
    planet: string = "";
}
TestElementMultiple.defineAsync({
    name: "test-element-multiple",
    templateOptions: "defer-and-hydrate",
});

class TestElement extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementNot extends FASTElement {
    @attr({ mode: "boolean" })
    hide: boolean = false;
}
TestElementNot.defineAsync({
    name: "test-element-not",
    templateOptions: "defer-and-hydrate",
});

class TestElementEquals extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementEquals.defineAsync({
    name: "test-element-equals",
    templateOptions: "defer-and-hydrate",
});

class TestElementNotEquals extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementNotEquals.defineAsync({
    name: "test-element-not-equals",
    templateOptions: "defer-and-hydrate",
});

class TestElementGe extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementGe.defineAsync({
    name: "test-element-ge",
    templateOptions: "defer-and-hydrate",
});

class TestElementGt extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementGt.defineAsync({
    name: "test-element-gt",
    templateOptions: "defer-and-hydrate",
});

class TestElementLe extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementLe.defineAsync({
    name: "test-element-le",
    templateOptions: "defer-and-hydrate",
});

class TestElementLt extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementLt.defineAsync({
    name: "test-element-lt",
    templateOptions: "defer-and-hydrate",
});

class TestElementOr extends FASTElement {
    @attr({ attribute: "thisvar", mode: "boolean" })
    thisvar: boolean = false;

    @attr({ attribute: "thatvar", mode: "boolean" })
    thatvar: boolean = false;
}
TestElementOr.defineAsync({
    name: "test-element-or",
    templateOptions: "defer-and-hydrate",
});

class TestElementAnd extends FASTElement {
    @attr({ attribute: "thisvar", mode: "boolean" })
    thisvar: boolean = false;

    @attr({ attribute: "thatvar", mode: "boolean" })
    thatvar: boolean = false;
}
TestElementAnd.defineAsync({
    name: "test-element-and",
    templateOptions: "defer-and-hydrate",
});

export class TestElementWhenFalseRepeat extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;

    @observable
    list: Array<string> = ["Alpha", "Beta", "Gamma"];
}
TestElementWhenFalseRepeat.defineAsync({
    name: "test-element-when-false-repeat",
    templateOptions: "defer-and-hydrate",
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
TestElementEvent.defineAsync({
    name: "test-element-event",
    templateOptions: "defer-and-hydrate",
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
NestedWhenElement.defineAsync({
    name: "nested-when",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
