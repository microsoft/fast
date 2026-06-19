import "@microsoft/fast-examples-design-system/tokens.css";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration();

void Promise.all([
    import("./chat-app.js"),
    import("./chat-card.js"),
    import("./chat-message.js"),
    import("./chat-suggestion.js"),
]);
