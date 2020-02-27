/**
 * Implemented by objects that are interested in change notifications.
 */
export interface Subscriber {
    handleChange(source: any, args: any): void;
}

/**
 * Efficiently keeps track of subscribers interested in change notifications.
 *
 * @remarks
 * This collection is optimized for the most common scenario of 1 - 3 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the collection ever exceeds three subscribers, it will spill over into an array.
 */
export class SubscriberCollection {
    private sub1: Subscriber | undefined = void 0;
    private sub2: Subscriber | undefined = void 0;
    private sub3: Subscriber | undefined = void 0;
    private spillover: Subscriber[] | undefined = void 0;

    public hasSubscribers() {
        return (
            this.sub1 !== void 0 ||
            this.sub2 !== void 0 ||
            this.sub3 !== void 0 ||
            (this.spillover !== void 0 && this.spillover!.length > 0)
        );
    }

    public hasSubscriber(subscriber: Subscriber) {
        if (this.sub1 === subscriber) return true;
        if (this.sub2 === subscriber) return true;
        if (this.sub3 === subscriber) return true;
        return this.spillover !== void 0 && this.spillover.indexOf(subscriber) !== -1;
    }

    public addSubscriber(subscriber: Subscriber) {
        if (this.hasSubscriber(subscriber)) {
            return;
        }

        if (this.sub1 === void 0) {
            this.sub1 = subscriber;
            return;
        }

        if (this.sub2 === void 0) {
            this.sub2 = subscriber;
            return;
        }

        if (this.sub3 === void 0) {
            this.sub3 = subscriber;
            return;
        }

        if (this.spillover === void 0) {
            this.spillover = [];
        }

        this.spillover.push(subscriber);
    }

    public removeSubscriber(subscriber: Subscriber) {
        if (this.sub1 === subscriber) {
            this.sub1 = void 0;
            return;
        }

        if (this.sub2 === subscriber) {
            this.sub2 = void 0;
            return;
        }

        if (this.sub3 === subscriber) {
            this.sub3 = void 0;
            return;
        }

        if (this.spillover !== void 0) {
            const index = this.spillover.indexOf(subscriber);

            if (index !== -1) {
                this.spillover.splice(index, 1);
            }
        }
    }

    public notifySubscribers(source: any, args: any) {
        const sub1 = this.sub1;
        const sub2 = this.sub2;
        const sub3 = this.sub3;
        const spillover = this.spillover;

        if (sub1 !== void 0) {
            sub1.handleChange(source, args);
        }

        if (sub2 !== void 0) {
            sub2.handleChange(source, args);
        }

        if (sub3 !== void 0) {
            sub3.handleChange(source, args);
        }

        if (spillover !== void 0) {
            for (let i = 0, ii = spillover.length; i < ii; ++i) {
                spillover[i].handleChange(source, args);
            }
        }
    }
}
