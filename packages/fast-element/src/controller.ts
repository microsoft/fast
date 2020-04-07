import { FastElementDefinition, FastElement } from "./fast-element";
import { Container, Registry, Resolver, InterfaceSymbol } from "./di";
import { ElementView } from "./view";
import { PropertyChangeNotifier } from "./observation/notifier";
import { Observable } from "./observation/observable";

const defaultEventOptions: CustomEventInit = {
    bubbles: true,
    composed: true,
};

export class Controller extends PropertyChangeNotifier implements Container {
    public view: ElementView | null = null;
    public isConnected: boolean = false;
    private resolvers = new Map<any, Resolver>();
    private boundObservables: Record<string, any> | null = null;

    public constructor(
        public readonly element: HTMLElement,
        public readonly definition: FastElementDefinition
    ) {
        super();

        const template = definition.template;
        const styles = definition.styles;
        const shadowRoot =
            definition.shadowOptions === void 0
                ? void 0
                : element.attachShadow(definition.shadowOptions);

        if (template !== void 0) {
            const view = (this.view = template.create(this.element));

            if (shadowRoot === void 0) {
                view.appendTo(element);
            } else {
                view.appendTo(shadowRoot);
            }
        }

        if (styles !== void 0 && shadowRoot !== void 0) {
            styles.applyTo(shadowRoot);
        }

        definition.dependencies.forEach(x => x.register(this));

        // Capture any observable values that were set by the binding engine before
        // the browser upgraded the element. Then delete the property since it will
        // shadow the getter/setter that is required to make the observable function.
        // Later, in the connect callback, we'll re-apply the values.
        const observedProps = Observable.getObservedProperties(element);

        if (observedProps.length > 0) {
            const boundObservables = (this.boundObservables = Object.create(null));

            for (let i = 0, ii = observedProps.length; i < ii; ++i) {
                const propertyName = observedProps[i];
                const value = (element as any)[propertyName];

                if (value !== void 0) {
                    delete (element as any)[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }

    public onConnectedCallback() {
        if (this.isConnected) {
            return;
        }

        const element = this.element;
        const boundObservables = this.boundObservables;

        // If we have any observables that were bound, re-apply their values.
        if (boundObservables !== null) {
            const propertyNames = Object.keys(boundObservables);

            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                (element as any)[propertyName] = boundObservables[propertyName];
            }

            this.boundObservables = null;
        }

        if (this.view !== null) {
            this.view.bind(element);
        }

        this.isConnected = true;
    }

    public onDisconnectedCallback() {
        if (this.isConnected === false) {
            return;
        }

        this.isConnected = false;

        if (this.view !== null) {
            this.view.unbind();
        }
    }

    public onAttributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const attrDef = this.definition.attributeLookup[name];

        if (attrDef !== void 0) {
            attrDef.onAttributeChangedCallback(this.element, newValue);
        }
    }

    public emit(type: string, detail?: any, options?: Omit<CustomEventInit, "detail">) {
        if (this.isConnected) {
            return this.element.dispatchEvent(
                new CustomEvent(type, { detail, ...defaultEventOptions, ...options })
            );
        }

        return false;
    }

    public register(registry: Registry) {
        registry.register(this);
    }

    public get<T>(key: InterfaceSymbol<T>): T;
    public get<T = any>(key: any): T | null {
        const resolver = this.resolvers.get(key);

        if (resolver === void 0) {
            return null;
        }

        return resolver(this) as T;
    }

    public registerResolver(key: any, resolver: Resolver) {
        this.resolvers.set(key, resolver);
    }

    public static forCustomElement(element: HTMLElement) {
        const controller: Controller = (element as any).$controller;

        if (controller !== void 0) {
            return controller;
        }

        const definition = FastElement.getDefinition(element.constructor as any);

        if (definition === void 0) {
            throw new Error("Missing fast element definition.");
        }

        return ((element as any).$controller = new Controller(element, definition));
    }
}
