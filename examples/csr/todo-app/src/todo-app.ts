import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { Observable, observable } from "@microsoft/fast-element/observable.js";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";
import { type Todo, TodoList, type TodoListFilter } from "./todo-list.js";

export class TodoApp extends FASTElement {
    @TodoList todos!: TodoList;

    @observable items: readonly Todo[] = [];
    @observable activeFilter: TodoListFilter = "all";
    @observable activeCount: number = 0;
    @observable completedCount: number = 0;

    private readonly todoSubscriber = {
        handleChange: () => this.syncTodos(),
    };

    connectedCallback(): void {
        super.connectedCallback();
        this.subscribeToTodos();
        this.syncTodos();
    }

    disconnectedCallback(): void {
        this.unsubscribeFromTodos();
        super.disconnectedCallback();
    }

    setFilter(filter: TodoListFilter): void {
        this.todos.setFilter(filter);
        this.syncTodos();
    }

    toggle(todo: Todo): void {
        this.todos.toggle(todo);
        this.syncTodos();
    }

    removeTodo(todo: Todo): void {
        this.todos.remove(todo);
        this.syncTodos();
    }

    private subscribeToTodos(): void {
        const notifier = Observable.getNotifier(this.todos);
        notifier.subscribe(this.todoSubscriber, "filtered");
        notifier.subscribe(this.todoSubscriber, "activeFilter");
        notifier.subscribe(this.todoSubscriber, "activeCount");
        notifier.subscribe(this.todoSubscriber, "completedCount");
    }

    private unsubscribeFromTodos(): void {
        const notifier = Observable.getNotifier(this.todos);
        notifier.unsubscribe(this.todoSubscriber, "filtered");
        notifier.unsubscribe(this.todoSubscriber, "activeFilter");
        notifier.unsubscribe(this.todoSubscriber, "activeCount");
        notifier.unsubscribe(this.todoSubscriber, "completedCount");
    }

    private syncTodos(): void {
        this.items = this.todos.filtered;
        this.activeFilter = this.todos.activeFilter;
        this.activeCount = this.todos.activeCount;
        this.completedCount = this.todos.completedCount;
    }
}

// By using this API instead of the @customElement
// decorator, we are able to assemble the component
// with its name, template, and styles, but without
// immediately defining it with the platform. We do
// this so that we can control the startup timing of
// the app. See the main.ts file for further
// explanation.
export const app = await TodoApp.compose({
    name: "todo-app",
    template,
    styles,
});
