import { FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

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
TestElement.define(
    {
        name: "test-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
