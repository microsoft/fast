import { Observable } from "@microsoft/fast-element";

export class ObservableMap<T = any, K = any> extends Map<T, K> {
    private notifier = Observable.getNotifier(this);

    set(key: T, value: K): this {
        const prev = super.get(key);
        super.set(key, value);

        if (prev !== value) {
            this.notifier.notify(key);
        }

        return this;
    }

    get(key: T): K | undefined {
        Observable.track(this, key as any);
        return super.get(key);
    }

    delete(key: T): boolean {
        const deleted = super.delete(key);

        if (deleted) {
            this.notifier.notify(key);
        }

        return deleted;
    }
}
