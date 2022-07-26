import { Observable } from "@microsoft/fast-element";
import { _random, adjectives, nouns } from "../../../utils/index.js";
export class Pupil {
    private _greetMessage: string;
    private _exit: boolean = false;

    constructor(firstName: string, lastName: string) {
        const first = firstName[0].toUpperCase() + firstName.slice(1);
        const last = lastName[0].toUpperCase() + lastName.slice(1);

        this._greetMessage = `Welcome to FAST, ${first} ${last} !!`;
    }

    get greetMessage() {
        Observable.track(this, "greetMessage");
        return this._greetMessage;
    }

    set greetMessage(value: string) {
        this._greetMessage = value;
        Observable.notify(this, "greetMessage");
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

(window as any).runFunction = () => {
    const pupil = new Pupil(
        adjectives[_random(adjectives.length)],
        nouns[_random(nouns.length)]
    );

    const notifier = Observable.getNotifier(pupil);
    const handler = {
        handleChange(source: any, propertyName: string) {
            source._exit = true;
        },
    };

    notifier.subscribe(handler, "greetMessage");

    pupil.greetMessage = "Goodbye, see you next time!";
    notifier.unsubscribe(handler, "greetMessage");
};
