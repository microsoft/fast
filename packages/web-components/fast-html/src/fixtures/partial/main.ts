import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    public items = [
        {
            text: "Hello",
        },
        {
            text: "Earth",
            items: [
                {
                    text: "Pluto",
                    items: [
                        {
                            text: "Mars",
                        },
                    ],
                },
            ],
        },
    ];
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

TemplateElement.templateShadowOptions({
    "test-element": {
        mode: "closed",
    },
}).define({
    name: "f-template",
});
