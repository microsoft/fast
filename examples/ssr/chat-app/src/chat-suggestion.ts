import { attr, FASTElement } from "@microsoft/fast-element";

export class ChatSuggestion extends FASTElement {
    @attr
    public text?: string;

    public emitSuggestion(): void {
        this.$emit("use-suggestion", this.text ?? "");
    }
}

ChatSuggestion.define({
    name: "chat-suggestion",
    templateOptions: "defer-and-hydrate",
});
