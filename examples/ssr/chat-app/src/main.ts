import "@microsoft/fast-examples-design-system/tokens.css";
import { TemplateElement } from "@microsoft/fast-html";

// Side-effect imports — register the chat custom elements
import "./chat-app.js";
import "./chat-card.js";
import "./chat-message.js";
import "./chat-suggestion.js";

TemplateElement.options({
    "chat-app": { observerMap: "all" },
    "chat-card": { observerMap: "all" },
    "chat-message": { observerMap: "all" },
    "chat-suggestion": { observerMap: "all" },
}).define({
    name: "f-template",
});
