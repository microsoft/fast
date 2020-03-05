import { CustomElementDefinition, CustomElement } from "./custom-element";
import { Container, Registry, Resolver, InterfaceSymbol } from "./di";
import { ElementView } from "./view";
import { PropertyChangeNotifier } from "./observation/notifier";

export class Controller extends PropertyChangeNotifier implements Container {
    public view: ElementView | null = null;
    private resolvers = new Map<any, Resolver>();

    public constructor(
        public readonly element: HTMLElement,
        public readonly definition: CustomElementDefinition
    ) {
        super();

        const template = definition.template;
        const styles = definition.styles;
        const shadowRoot =
            definition.shadowOptions === void 0
                ? void 0
                : element.attachShadow(definition.shadowOptions);

        if (template !== void 0) {
            const view = (this.view = template.create());

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
        if (this.view !== null) {
            this.view.bind(this.element);
        }
    }

    public onDisconnectedCallback() {
        if (this.view !== null) {
            this.view.unbind();
        }
    }

    public onAttributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const bindable = this.definition.attributes[name];
        (this.element as any)[bindable.property] = newValue;
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

        const definition = CustomElement.getDefinition(element.constructor as any);

        if (definition === void 0) {
            throw new Error("Missing custom element definition.");
        }

        return ((element as any).$controller = new Controller(element, definition));
    }
}
