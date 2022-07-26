import { Observable } from "@microsoft/fast-element";

export class Person {
    private _firstName: string;
    private _lastName: string;

    get firstName() {
        Observable.track(this, "firstName");
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
        Observable.notify(this, "firstName");
    }

    get lastName() {
        Observable.track(this, "lastName");
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
        Observable.notify(this, "lastName");
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

(window as any).test = () => {
    const person = new Person();
    const notifier = Observable.getNotifier(person);
    const handler = {
        handleChange(source: any, propertyName: string) {
            // respond to the change here
            // source will be the person instance
            // propertyName will be "firstName"
            source._firstName += "!!!!!!!!!!!!!!!";
            source._lastName += "xxxxxxxxx";
        },
    };

    notifier.subscribe(handler, "firstName");
    notifier.subscribe(handler, "lastName");

    person.firstName = "wendy";
    person.lastName = "hsu";

    notifier.unsubscribe(handler, "firstName");
    notifier.unsubscribe(handler, "lastName");
};
