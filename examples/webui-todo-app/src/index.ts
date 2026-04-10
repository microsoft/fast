// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * WebUI todo-app entry point — bootstraps FAST-HTML hydration.
 *
 * The server pre-renders HTML with hydration markers via `webui serve --plugin=fast`.
 * This script:
 *   1. Registers custom elements (todo-app, todo-item) via defineAsync
 *   2. Configures FAST-HTML observation maps for reactive attribute tracking
 *   3. Defines <f-template>, triggering hydration of pre-rendered shadow DOM
 */

performance.mark("todo-hydration-started");

import { TemplateElement } from "@microsoft/fast-html";

// Side-effect imports — register custom elements via defineAsync
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
        },
    })
    .define({
        name: "f-template",
    });
