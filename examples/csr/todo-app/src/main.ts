import "@microsoft/fast-examples-design-system/tokens.css";
import { TodoApp } from "./todo-app.js";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";
import { DefaultTodoList, TodoList } from "./todo-list.js";

// Before we allow the app to be defined, we want to
// make sure that our context data is configured. This
// small bit of bootstrapping logic ensures that a
// TodoList context will be available for all components
// in the document. This is set up prior to defining the
// app so that we can ensure that the context is available
// in time.
TodoList.provide(document, new DefaultTodoList());

// Define the todo-app custom element
TodoApp.define({
    name: "todo-app",
    template,
    styles,
});
