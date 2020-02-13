import { CustomElementDefinition, CustomElement } from "./custom-element";
import { Constructable } from "./interfaces";
import { IContainer, IRegistry, Resolver, InterfaceSymbol } from "./di";
import { IElementView } from "./view";
import { IElementProjector, HostProjector, ShadowDOMProjector } from "./projectors";
import {
    INotifyPropertyChanged,
    IPropertyChangeListener,
    PropertyChangeNotifier,
} from "./observation/observable";

const controllerLookup: WeakMap<HTMLElement, Controller> = new WeakMap();

export class Controller implements IContainer, INotifyPropertyChanged {
    public view: IElementView | null = null;
    private propertyChangeNotifier = new PropertyChangeNotifier();
    private resolvers = new Map<any, Resolver>();

    public constructor(
        public readonly element: HTMLElement,
        public readonly definition: CustomElementDefinition,
        public readonly projector: IElementProjector
    ) {
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

    public register(registry: IRegistry) {
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

    public notifyPropertyChanged(source: any, propertyName: string) {
        this.propertyChangeNotifier.notifyPropertyChanged(source, propertyName);
    }

    public addPropertyChangeListener(
        propertyName: string,
        listener: IPropertyChangeListener
    ) {
        this.propertyChangeNotifier.addPropertyChangeListener(propertyName, listener);
    }

    public removePropertyChangeListener(
        propertyName: string,
        listener: IPropertyChangeListener
    ) {
        this.propertyChangeNotifier.removePropertyChangeListener(propertyName, listener);
    }

    public static forCustomElement(element: HTMLElement) {
        if (controllerLookup.has(element)) {
            return (controllerLookup.get(element) as unknown) as Controller;
        }

        const definition = CustomElement.getDefinition(
            element.constructor as Constructable
        );
        if (definition === void 0) {
            throw new Error(`Missing definition for custom element.`);
        }

        const projector =
            definition.shadowOptions === null
                ? new HostProjector(element)
                : new ShadowDOMProjector(element, definition);

        const controller = new Controller(element, definition, projector);

        (element as any).$controller = controller;
        controllerLookup.set(element, controller);
        controller.hydrateCustomElement();

        return controller;
    }
}
