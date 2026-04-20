import { attr, FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    @attr
    greeting: string = "Hello";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

const templatePromise = declarativeTemplate()({ name: "test-element" });

templatePromise.then(template => {
    (window as any).resolvedTemplate = template;
});
