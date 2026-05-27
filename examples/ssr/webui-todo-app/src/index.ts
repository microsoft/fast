// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * WebUI todo-app entry point — bootstraps v3 declarative hydration.
 *
 * The server pre-renders HTML with declarative shadow DOM via
 * `webui serve --plugin=fast`. This script:
 *   1. Registers custom elements (todo-app, todo-item) using
 *      `declarativeTemplate()` plus the `observerMap()` registry feature.
 *   2. Calls `enableHydration` to drive client-side hydration of the
 *      pre-rendered shadow DOM.
 */

performance.mark("todo-hydration-started");

import "@microsoft/fast-examples-design-system/tokens.css";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

// Side-effect imports — register custom elements
import "./todo-app/todo-app.js";
import "./todo-item/todo-item.js";

enableHydration({
    hydrationComplete() {
        performance.measure("todo-hydration-completed", "todo-hydration-started");
        console.log("Hydration complete!");
        (window as unknown as { __todoHydrated?: boolean }).__todoHydrated = true;
    },
});
