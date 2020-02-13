import { Controller } from "../controller";
import { FastElement } from "../fast-element";

export interface IPropertyChangeListener {
    onPropertyChanged(source: any, propertyName: string): void;
}

export interface INotifyPropertyChanged {
    notifyPropertyChanged(source: any, propertyName: string): void;
    addPropertyChangeListener(
        propertyName: string,
        listener: IPropertyChangeListener
    ): void;
    removePropertyChangeListener(
        propertyName: string,
        listener: IPropertyChangeListener
    ): void;
}

export class PropertyChangeNotifier implements INotifyPropertyChanged {
    private listeners: Record<string, IPropertyChangeListener[]> = {};

    public notifyPropertyChanged(source: any, propertyName: string) {
        const listeners = this.listeners[propertyName];

        if (listeners !== void 0) {
            listeners.forEach(x => x.onPropertyChanged(source, propertyName));
        }
    }

    public addPropertyChangeListener(
        propertyName: string,
        listener: IPropertyChangeListener
    ) {
        const listeners =
            this.listeners[propertyName] || (this.listeners[propertyName] = []);
        listeners.push(listener);
    }

    public removePropertyChangeListener(
        propertyName: string,
        listener: IPropertyChangeListener
    ) {
        const listeners = this.listeners[propertyName];

        if (listeners === void 0) {
            return;
        }

        const index = listeners.indexOf(listener);

        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }
}

export interface IGetterInspector {
    inspect(source: unknown, propertyName: string): void;
}

const notifierLookup = new WeakMap<any, PropertyChangeNotifier>();
let currentInspector: IGetterInspector | null = null;

export const Observable = {
    setInspector(watcher: IGetterInspector) {
        currentInspector = watcher;
    },

    clearInspector() {
        currentInspector = null;
    },

    createArrayObserver(array: any[]): INotifyPropertyChanged {
        throw new Error("Must call enableArrayObservation before observing arrays.");
    },

    getNotifier<T extends INotifyPropertyChanged = INotifyPropertyChanged>(
        source: any
    ): T {
        let found = source.$controller || notifierLookup.get(source);

        if (found === void 0) {
            if (source instanceof FastElement) {
                found = Controller.forCustomElement(source);
            } else if (Array.isArray(source)) {
                found = Observable.createArrayObserver(source);
                notifierLookup.set(source, found);
            } else {
                notifierLookup.set(source, (found = new PropertyChangeNotifier()));
            }
        }

        return found;
    },

    notifyPropertyAccessed(source: unknown, propertyName: string) {
        if (currentInspector != null) {
            currentInspector.inspect(source, propertyName);
        }
    },

    notifyPropertyChanged(source: unknown, propertyName: string) {
        Observable.getNotifier(source).notifyPropertyChanged(source, propertyName);
    },

    define(target: {}, propertyName: string) {
        const fieldName = `_${propertyName}`;
        const callbackName = `${propertyName}Changed`;
        const hasCallback = callbackName in target;

        Reflect.defineProperty(target, propertyName, {
            enumerable: true,
            get: function(this: any) {
                Observable.notifyPropertyAccessed(this, propertyName);
                return this[fieldName];
            },
            set: function(this: any, value) {
                const oldValue = this[fieldName];

                if (oldValue !== value) {
                    this[fieldName] = value;

                    if (hasCallback) {
                        this[callbackName]();
                    }

                    Observable.notifyPropertyChanged(this, propertyName);
                }
            },
        });
    },
};

export function observable($target: {}, $prop: string) {
    Observable.define($target, $prop);
}
