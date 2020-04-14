import { FastElement, FastElementDefinition } from "./fast-element";
import { Container, InterfaceSymbol, Registry, Resolver } from "./di";
import { ElementView } from "./view";
import { PropertyChangeNotifier } from "./observation/notifier";
import { Observable } from "./observation/observable";
import { Behavior } from "./directives/behavior";
import { ElementStyles, StyleTarget } from "./styles";

const defaultEventOptions: CustomEventInit = {
    bubbles: true,
    composed: true,
};

export class Controller extends PropertyChangeNotifier implements Container {
    public view: ElementView | null = null;
    public isConnected: boolean = false;
    private resolvers: Map<any, Resolver> = new Map<any, Resolver>();
    private boundObservables: Record<string, any> | null = null;
    private behaviors: Behavior[] | null = null;

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

        if (styles !== void 0) {
            this.addStyles(styles, shadowRoot);
        }

        definition.dependencies.forEach((x: Registry) => x.register(this));

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

    public addStyles(
        styles: ElementStyles,
        target: StyleTarget | null = this.element.shadowRoot
    ): void {
        if (target !== null) {
            styles.addStylesTo(target);
        }

        const sourceBehaviors = styles.behaviors;

        if (sourceBehaviors !== null) {
            this.addBehaviors(sourceBehaviors);
        }
    }

    public removeStyles(styles: ElementStyles): void {
        const target = this.element.shadowRoot;

        if (target !== null) {
            styles.removeStylesFrom(target);
        }

        const sourceBehaviors = styles.behaviors;

        if (sourceBehaviors !== null) {
            this.removeBehaviors(sourceBehaviors);
        }
    }

    public addBehaviors(behaviors: ReadonlyArray<Behavior>): void {
        const targetBehaviors = this.behaviors || (this.behaviors = []);
        const length = behaviors.length;

        for (let i = 0; i < length; ++i) {
            targetBehaviors.push(behaviors[i]);
        }

        if (this.isConnected) {
            const element = this.element;

            for (let i = 0; i < length; ++i) {
                behaviors[i].bind(element);
            }
        }
    }

    public removeBehaviors(behaviors: ReadonlyArray<Behavior>): void {
        const targetBehaviors = this.behaviors;

        if (targetBehaviors === null) {
            return;
        }

        const length = behaviors.length;

        for (let i = 0; i < length; ++i) {
            const index = targetBehaviors.indexOf(behaviors[i]);

            if (index !== -1) {
                targetBehaviors.splice(index, 1);
            }
        }

        if (this.isConnected) {
            const element = this.element;

            for (let i = 0; i < length; ++i) {
                behaviors[i].unbind(element);
            }
        }
    }

    public onConnectedCallback(): void {
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

        const view = this.view;

        if (view !== null) {
            view.bind(element);
        }

        const behaviors = this.behaviors;

        if (behaviors !== null) {
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(element);
            }
        }

        this.isConnected = true;
    }

    public onDisconnectedCallback(): void {
        if (this.isConnected === false) {
            return;
        }

        this.isConnected = false;

        const view = this.view;

        if (view !== null) {
            view.unbind();
        }

        const behaviors = this.behaviors;

        if (behaviors !== null) {
            const element = this.element;

            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].unbind(element);
            }
        }
    }

    public onAttributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ): void {
        const attrDef = this.definition.attributeLookup[name];

        if (attrDef !== void 0) {
            attrDef.onAttributeChangedCallback(this.element, newValue);
        }
    }

    public emit(
        type: string,
        detail?: any,
        options?: Omit<CustomEventInit, "detail">
    ): void | boolean {
        if (this.isConnected) {
            return this.element.dispatchEvent(
                new CustomEvent(type, { detail, ...defaultEventOptions, ...options })
            );
        }

        return false;
    }

    public register(registry: Registry): void {
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

    public registerResolver(key: any, resolver: Resolver): void {
        this.resolvers.set(key, resolver);
    }

    public static forCustomElement(element: HTMLElement): Controller {
        const controller: Controller = (element as any).$fastController;

        if (controller !== void 0) {
            return controller;
        }

        const definition = FastElement.getDefinition(element.constructor as any);

        if (definition === void 0) {
            throw new Error("Missing fast element definition.");
        }

        return ((element as any).$fastController = new Controller(element, definition));
    }
}
