import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

class TestElementMultiple extends FASTElement {
    @attr()
    planet: string = "";
}
TestElementMultiple.define({
    name: "test-element-multiple",
    template: declarativeTemplate(),
});

class TestElement extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

class TestElementNot extends FASTElement {
    @attr({ mode: "boolean" })
    hide: boolean = false;
}
TestElementNot.define({
    name: "test-element-not",
    template: declarativeTemplate(),
});

class TestElementEquals extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementEquals.define({
    name: "test-element-equals",
    template: declarativeTemplate(),
});

class TestElementNotEquals extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementNotEquals.define({
    name: "test-element-not-equals",
    template: declarativeTemplate(),
});

class TestElementGe extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementGe.define({
    name: "test-element-ge",
    template: declarativeTemplate(),
});

class TestElementGt extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementGt.define({
    name: "test-element-gt",
    template: declarativeTemplate(),
});

class TestElementLe extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementLe.define({
    name: "test-element-le",
    template: declarativeTemplate(),
});

class TestElementLt extends FASTElement {
    @attr({ attribute: "vara" })
    vara: number = 0;
}
TestElementLt.define({
    name: "test-element-lt",
    template: declarativeTemplate(),
});

class TestElementOr extends FASTElement {
    @attr({ attribute: "thisvar", mode: "boolean" })
    thisvar: boolean = false;

    @attr({ attribute: "thatvar", mode: "boolean" })
    thatvar: boolean = false;
}
TestElementOr.define({
    name: "test-element-or",
    template: declarativeTemplate(),
});

class TestElementAnd extends FASTElement {
    @attr({ attribute: "thisvar", mode: "boolean" })
    thisvar: boolean = false;

    @attr({ attribute: "thatvar", mode: "boolean" })
    thatvar: boolean = false;
}
TestElementAnd.define({
    name: "test-element-and",
    template: declarativeTemplate(),
});

export class TestElementWhenFalseRepeat extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;

    @observable
    list: Array<string> = ["Alpha", "Beta", "Gamma"];
}
TestElementWhenFalseRepeat.define({
    name: "test-element-when-false-repeat",
    template: declarativeTemplate(),
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
    template: declarativeTemplate(),
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
    template: declarativeTemplate(),
});

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
