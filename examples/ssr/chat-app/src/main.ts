import "@microsoft/fast-examples-design-system/tokens.css";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

// Side-effect imports — register the chat custom elements
import "./chat-app.js";
import "./chat-card.js";
import "./chat-message.js";
import "./chat-suggestion.js";

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
