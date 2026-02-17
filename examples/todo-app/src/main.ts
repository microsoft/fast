import { DesignToken } from "@microsoft/fast-foundation";
import { DefaultTodoList, TodoList } from "./todo-list.js";
import { app } from "./todo-app.js";

// Before we allow the app to be defined, we want to
// make sure that our context data is configured. This
// small bit of bootstrapping logic ensures that a
// TodoList context will be available for all components
// in the document. This is set up prior to defining the
// app so that we can ensure that the context is available
// in time.
TodoList.provide(document, new DefaultTodoList());

// Emit CSS for DesignToken default values
DesignToken.registerDefaultStyleTarget();

// Define the todo-app custom element
app.define();
