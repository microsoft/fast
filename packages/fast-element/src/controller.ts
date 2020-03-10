import { FastElementDefinition, FastElement } from "./fast-element";
import { Container, Registry, Resolver, InterfaceSymbol } from "./di";
import { ElementView } from "./view";
import { PropertyChangeNotifier } from "./observation/notifier";

const defaultEventOptions: CustomEventInit = {
    bubbles: true,
    composed: true,
};

export class Controller extends PropertyChangeNotifier implements Container {
    public view: ElementView | null = null;
    public isConnected: boolean = false;
    private resolvers = new Map<any, Resolver>();

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
    }

    public onConnectedCallback() {
        if (this.isConnected) {
            return;
        }

        if (this.view !== null) {
            this.view.bind(this.element);
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
        (this.element as any)[this.definition.attributeLookup[name].property] = newValue;
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
