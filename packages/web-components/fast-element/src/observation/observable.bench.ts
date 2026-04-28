import { attr, FASTElement, Observable } from "../index.js";
import { _random, adjectives, nouns } from "../__test__/utilities.js";

export class TestObservable extends FASTElement {
    private _greetMessage: string = "";
    private _name: string = "";
    private _exit: boolean = false;

    @attr
    firstName: string;

    @attr
    lastName: string;

    connectedCallback(): void {
        super.connectedCallback();

        const first = this.firstName[0].toUpperCase() + this.firstName.slice(1);
        const last = this.lastName[0].toUpperCase() + this.lastName.slice(1);

        this.name = `${first} ${last}`;
        this.greetMessage = `Welcome to FAST, ${this.name} !!`;
    }

    get greetMessage() {
        Observable.track(this, "greetMessage");
        return this._greetMessage;
    }

    set greetMessage(value: string) {
        this._greetMessage = value;
        Observable.notify(this, "greetMessage");
    }

    get name() {
        Observable.track(this, "name");
        return this._name;
    }

    set name(value: string) {
        this._name = value;
        Observable.notify(this, "name");
    }

    get exit() {
        Observable.track(this, "exit");
        return this._exit;
    }

    set exit(value: boolean) {
        this._exit = value;
        Observable.notify(this, "exit");
    }
}

TestObservable.define({
    name: "test-observable",
});

const itemRenderer = (): HTMLElement => {
    const testObservable: TestObservable = document.createElement(
        "test-observable"
    ) as TestObservable;
    testObservable.setAttribute("firstname", adjectives[_random(adjectives.length)]);
    testObservable.setAttribute("lastname", nouns[_random(nouns.length)]);

    const notifier = Observable.getNotifier(testObservable);
    const handler = {
        handleChange(source: any, propertyName: any) {
            if (propertyName === "greetMessage") source._exit = true;
        },
    };
    notifier.subscribe(handler, "greetMessage");

    testObservable.greetMessage = `Goodbye ${testObservable.name}, see you next time!`;
    notifier.unsubscribe(handler, "greetMessage");

    return testObservable;
};

export default itemRenderer;
export { tests } from "@tensile-perf/web-components";
