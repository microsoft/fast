import { html } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/binding/two-way.js";
import type { TodoForm } from "./todo-form.js";

export const template = html<TodoForm>`
    <form @submit=${(x, c) => x.handleSubmit(c.event)}>
        <input
            type="text"
            placeholder="What needs to be done?"
            aria-label="New todo description"
            :value=${twoWay(x => x.description, "input")}
        />
        <button type="submit" ?disabled=${x => x.description.trim() === ""}>
            Add
        </button>
    </form>
`;
