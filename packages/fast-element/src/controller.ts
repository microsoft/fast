import { CustomElementDefinition, CustomElement } from "./custom-element";
import { Constructable } from "./interfaces";
import { Container, Registry, Resolver, InterfaceSymbol } from "./di";
import { ElementView } from "./view";
import { ElementProjector, HostProjector, ShadowDOMProjector } from "./projectors";
import { PropertyChangeNotifier } from "./observation/notifier";

export class Controller extends PropertyChangeNotifier implements Container {
    public view: ElementView | null = null;
    private resolvers = new Map<any, Resolver>();

    public constructor(
        public readonly element: HTMLElement,
        public readonly definition: CustomElementDefinition,
        public readonly projector: ElementProjector
    ) {
        super();
        this.definition.dependencies.forEach(x => x.register(this));
    }

    public hydrateCustomElement() {
        this.view = this.definition.template.create(false);

        if (this.view !== null) {
            this.projector.project(this.view, this);
        }
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
        let controller: Controller = (element as any).$controller;

        if (controller !== void 0) {
            return controller;
        }

        const definition = CustomElement.getDefinition(
            element.constructor as Constructable
        );
        if (definition === void 0) {
            throw new Error("Missing custom element definition.");
        }

        const projector =
            definition.shadowOptions === null
                ? new HostProjector(element)
                : new ShadowDOMProjector(element, definition);

        (element as any).$controller = controller = new Controller(
            element,
            definition,
            projector
        );
        controller.hydrateCustomElement();

        return controller;
    }
}
