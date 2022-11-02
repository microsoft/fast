import {
    Compiler,
    ElementStyles,
    Updates,
    ViewBehaviorFactory,
} from "@microsoft/fast-element";
import { FASTSSRStyleStrategy } from "./styles/style-strategy.js";
import { SSRView } from "./view.js";

Compiler.setDefaultStrategy(
    (
        html: string | HTMLTemplateElement,
        factories: Record<string, ViewBehaviorFactory>
    ) => {
        if (typeof html !== "string") {
            throw new Error(
                "SSR compiler does not support HTMLTemplateElement templates"
            );
        }

        return new SSRView(html, factories) as any;
    }
);

ElementStyles.setDefaultStrategy(FASTSSRStyleStrategy);

// Set update mode to synchronous, so that mutations happen immediately.
// This is required due to the synchronous nature of rendering templates
// to a string.
Updates.setMode(false);
