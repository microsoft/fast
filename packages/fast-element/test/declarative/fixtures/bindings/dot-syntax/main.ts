import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    public object: any = {
        a: {
            b2: {
                c: "FOO",
            },
        },
        b: "bar",
        c: [
            {
                name: "Item 1",
                status: "active",
            },
            {
                name: "Item 2",
                status: "active",
            },
            {
                status: "active",
            },
        ],
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
TestElement.define({
    name: "test-element",
});

TemplateElement.options({
    "test-element": {
        observerMap: "all",
    },
})
    .config({
        hydrationComplete() {
            (window as any).hydrationCompleted = true;
        },
    })
    .define({
        name: "f-template",
    });
