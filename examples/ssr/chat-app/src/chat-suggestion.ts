import { attr, FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement } from "@microsoft/fast-html";

export class ChatSuggestion extends RenderableFASTElement(FASTElement) {
    @attr
    public text?: string;

    public emitSuggestion(): void {
        this.$emit("use-suggestion", this.text ?? "");
    }
}
