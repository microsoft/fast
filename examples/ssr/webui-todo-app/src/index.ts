// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * WebUI todo-app entry point — bootstraps FAST declarative hydration.
 *
 * The server pre-renders HTML with hydration markers via `webui serve --plugin=fast`.
 * This script:
 *   1. Registers custom elements (todo-app, todo-item) via define()
 *   2. Configures FAST declarative observation maps for reactive attribute tracking
 *   3. Defines <f-template>, triggering hydration of pre-rendered shadow DOM
 */

performance.mark("todo-hydration-started");

import "@microsoft/fast-examples-design-system/tokens.css";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

// Side-effect imports — register custom elements via define()
import "./todo-app/todo-app.js";
import "./todo-item/todo-item.js";

// Configure and start hydration
TemplateElement.options({
    "todo-app": { observerMap: "all" },
    "todo-item": { observerMap: "all" },
})
    .config({
        hydrationComplete() {
            performance.measure("todo-hydration-completed", "todo-hydration-started");
            console.log("Hydration complete!");
            (window as unknown as { __todoHydrated?: boolean }).__todoHydrated = true;
        },
    })
    .define({
        name: "f-template",
    });
