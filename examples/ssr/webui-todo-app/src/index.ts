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
import { enableHydration, markers_v2 } from "@microsoft/fast-element/hydration.js";
import type { TodoApp } from "./todo-app/todo-app.js";

let resolveHydrationReady!: () => void;
const hydrationReady = new Promise<void>(resolve => {
    resolveHydrationReady = resolve;
});

// The webui `--plugin=fast` server still emits FAST Element 2.x indexed
// hydration markers, so the client must opt into the markers_v2 reader for
// interoperability with that backend.
const hydration = enableHydration({ markers: markers_v2 });
void hydration.whenHydrated().then(() => {
    performance.measure("todo-hydration-completed", "todo-hydration-started");
    console.log("Hydration complete!");
    resolveHydrationReady();
});

const [{ todoAppDefinition }, { todoItemDefinition }] = await Promise.all([
    import("./todo-app/todo-app.js"),
    import("./todo-item/todo-item.js"),
]);

await Promise.all([todoAppDefinition, todoItemDefinition, hydrationReady]);
document
    .querySelectorAll<TodoApp>("todo-app")
    .forEach(element => element.syncFormControls());
(window as unknown as { __todoHydrated?: boolean }).__todoHydrated = true;
