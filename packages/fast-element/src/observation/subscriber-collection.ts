export interface ISubscriber {
    handleChange(source: any, args: any): void;
}

export class SubscriberCollection {
    private sub1: ISubscriber | undefined = void 0;
    private sub2: ISubscriber | undefined = void 0;
    private sub3: ISubscriber | undefined = void 0;
    private spillover: ISubscriber[] | undefined = void 0;

    public hasSubscriber(subscriber: ISubscriber) {
        if (this.sub1 === subscriber) return true;
        if (this.sub2 === subscriber) return true;
        if (this.sub3 === subscriber) return true;
        return this.spillover !== void 0 && this.spillover.indexOf(subscriber) !== -1;
    }

    public addSubscriber(subscriber: ISubscriber) {
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

    public removeSubscriber(subscriber: ISubscriber) {
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
