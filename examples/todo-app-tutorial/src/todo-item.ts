import { observable } from "@microsoft/fast-element";

export class TodoItem {
    @observable description: string;
    @observable done: boolean = false;

    constructor(description: string) {
        this.description = description;
    }

    public toggleDone() {
        this.done = !this.done;
    }
}
