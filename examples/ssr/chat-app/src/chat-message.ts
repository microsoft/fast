import { attr, FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement } from "@microsoft/fast-html";

export class ChatMessage extends RenderableFASTElement(FASTElement) {
    @attr
    public kind?: string;
}

ChatMessage.defineAsync({
    name: "chat-message",
    templateOptions: "defer-and-hydrate",
});
