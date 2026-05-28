import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class CodeDisplay extends FASTElement {
    @observable
    greeting: string = "Hello";
}
RenderableFASTElement(CodeDisplay).defineAsync({
    name: "code-display",
    templateOptions: "defer-and-hydrate",
});

(window as any).__hydrationErrors = [];
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
    (window as any).__hydrationErrors.push(
        args.map(a => (typeof a === "string" ? a : String(a))).join(" "),
    );
    originalConsoleError.apply(console, args);
};

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
