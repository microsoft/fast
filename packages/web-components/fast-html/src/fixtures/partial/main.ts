import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends RenderableFASTElement {
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
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
