import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

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
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
