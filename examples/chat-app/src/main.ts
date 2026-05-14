import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { ChatApp, chatAppDefinition } from "./chat-app.js";
import { ChatCard, chatCardDefinition } from "./chat-card.js";
import { ChatMessage, chatMessageDefinition } from "./chat-message.js";
import { ChatSuggestion, chatSuggestionDefinition } from "./chat-suggestion.js";

enableHydration();

await FASTElement.define(ChatMessage, chatMessageDefinition);
await FASTElement.define(ChatCard, chatCardDefinition);
await FASTElement.define(ChatSuggestion, chatSuggestionDefinition);
await FASTElement.define(ChatApp, chatAppDefinition);
