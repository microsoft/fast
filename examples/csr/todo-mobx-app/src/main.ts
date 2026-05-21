import "@microsoft/fast-examples-design-system/tokens.css";
import { connectStoreToStorage, todoStore } from "./state/index.js";
import { app } from "./todo-app.js";
import "./todo-form.js";
import "./todo-list.js";
import "./todo-item.js";
import "./todo-stats.js";
import "./todo-filter.js";

// Wire MobX's autorun to localStorage so the store is hydrated on load and
// persisted on every observable change. The returned disposer is kept for the
// lifetime of the page.
connectStoreToStorage(todoStore, "fast-todo-mobx-app");

app.define();
