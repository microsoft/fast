import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    public object: any = {
        b: "bar",
        a: {
            b2: {
                c: "FOO",
            },
        },
    };

    public handleBClick = () => {
        this.object.b = "Hello";
    };

    public handleAB1Click = () => {
        if (this.object.a) {
            this.object.a.b1 = "World";
        } else {
            this.object.a = {
                b1: "World",
            };
        }
    };

    public handleAB2CClick = () => {
        this.object.a.b2.c = "Pluto";
    };
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

TemplateElement.options({
    "test-element": {
        observerMap: "all",
    },
}).define({
    name: "f-template",
});
