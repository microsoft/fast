import { Controller } from "./controller";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions";

/**
 * Represents a custom element based on the FASTElement infrastructure.
 * @public
 */
export interface FASTElement {
    /**
     * The underlying controller that handles the lifecycle and rendering of
     * this FASTElement.
     */
    readonly $fastController: Controller;

    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if the element is connected.
     */
    $emit(
        type: string,
        detail?: any,
        options?: Omit<CustomEventInit, "detail">
    ): boolean | void;

    /**
     * The connected callback for this FASTElement.
     * @remarks
     * This method is invoked by the platform whenever this FASTElement
     * becomes connected to the document.
     */
    connectedCallback(): void;

    /**
     * The disconnected callback for this FASTElement.
     * @remarks
     * This method is invoked by the platform whenever this FASTElement
     * becomes disconnected from the document.
     */
    disconnectedCallback(): void;

    /**
     * The attribute changed callback for this FASTElement.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     * @remarks
     * This method is invoked by the platform whenever an observed
     * attribute of FASTElement has a value change.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;

    /**
     * Custom addEventlistener that logs the events being added to the element
     * @param type - event type
     * @param callback - callback function attached to the listener
     * @param options - event listener options
     */
    addEventListener(
        type: string | string[],
        callback: EventListenerOrEventListenerObject,
        options?: EventListenerOptions
    );

    /**
     * Custom removeEventListener that also removes the event listener from tracked event listeners
     * @param type - event type
     * @param callback - callback function attached to the listener
     */
    removeEventListener(
        type: string | string[],
        callback: EventListenerOrEventListenerObject
    );

    /**
     * Custom method for binding multiple events to an element that are tracked
     * @param target - node that has the event listener being bound to it
     * @param type - event type
     * @param callback - callback function for the event listener
     * @param options - event listener options
     */
    bindEvents(
        target: EventTarget,
        type: string | string[],
        callback: EventListenerOrEventListenerObject,
        options?: EventListenerOptions
    ): void;

    /**
     * Custom metho for removing attached events tracked by this element
     * @param target - node that the event listener is attached to
     * @param type - the event type
     * @param callback - optional method attached, otherwise it will look it up
     */
    unbindEvents(
        target: EventTarget,
        type?: string | string[],
        callback?: EventListenerOrEventListenerObject
    ): void;
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement<T extends typeof HTMLElement>(
    BaseType: T
): { new (): InstanceType<T> & FASTElement } {
    return class extends (BaseType as any) implements FASTElement {
        public readonly $fastController!: Controller;

        private eventListeners: {
            target: EventTarget;
            type: string;
            callback: EventListenerOrEventListenerObject;
        }[] = [];

        public constructor() {
            /* eslint-disable-next-line */
            super();
            Controller.forCustomElement(this as any);
        }

        public $emit(
            type: string,
            detail?: any,
            options?: Omit<CustomEventInit, "detail">
        ): boolean | void {
            return this.$fastController.emit(type, detail, options);
        }

        public connectedCallback(): void {
            this.$fastController.onConnectedCallback();
        }

        public disconnectedCallback(): void {
            this.$fastController.onDisconnectedCallback();
            this.unbindEvents();
        }

        public attributeChangedCallback(
            name: string,
            oldValue: string,
            newValue: string
        ): void {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }

        public addEventListener(
            type: string | string[],
            callback: EventListenerOrEventListenerObject,
            options?: any
        ): void {
            if (Array.isArray(type)) {
                type.forEach((event: string) =>
                    this.addEventListener(event, callback, options)
                );
                return;
            }
            super.addEventListener(type, callback, options);
            this.eventListeners.push({ target: this as EventTarget, type, callback });
        }

        public removeEventListener(
            type: string | string[],
            callback: EventListenerOrEventListenerObject
        ): void {
            if (Array.isArray(type)) {
                type.forEach((event: string) =>
                    this.removeEventListener(event, callback)
                );
                return;
            }
            super.removeEventListener(type, callback);
            this.eventListeners = this.eventListeners.filter(
                (el: any) =>
                    el.type !== type || el.callback != callback || el.target === this
            );
        }

        /**
         * Adds event listener to element and tracks it for this element
         * @param target - node that the listener is bound to
         * @param type - event type
         * @param callback - callback function called on event
         * @param options - event listener options
         * @returns void
         * @public
         */
        public bindEvents(
            target: EventTarget = this as EventTarget,
            type: string | string[],
            callback: EventListenerOrEventListenerObject,
            options?: EventListenerOptions
        ): void {
            if (Array.isArray(type)) {
                type.forEach((event: string) =>
                    this.bindEvents(target, event, callback, options)
                );
                return;
            }
            target.addEventListener(type, callback, options);
            if (target !== (this as any)) {
                this.eventListeners.push({ target, type, callback });
            }
        }

        /**
         * Removes an event listener from an element and removes the tracking
         * @param target - node that has the listener bound to it
         * @param type - event type
         * @param callback - callback function for the event
         * @returns void
         * @public
         */
        public unbindEvents(
            target?: EventTarget,
            type?: string | string[],
            callback?: EventListenerOrEventListenerObject
        ): void {
            if (Array.isArray(type)) {
                type.forEach((type: string) => this.unbindEvents(target, type, callback));
                return;
            }

            this.eventListeners = this.eventListeners.reduce(
                (listeners: any[], el: any) => {
                    if (
                        (!el || el.target === target) &&
                        (!type || el.type === type) &&
                        (!callback || el.callback == callback)
                    ) {
                        el.target.removeEventListener(el.type, el.callback);
                    } else {
                        listeners.push(el);
                    }
                    return listeners;
                },
                []
            );
        }
    } as any;
}

/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
export const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    /**
     * Creates a new FASTElement base class inherited from the
     * provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from<TBase extends typeof HTMLElement>(BaseType: TBase) {
        return createFASTElement(BaseType);
    },

    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define<TType extends Function>(
        type: TType,
        nameOrDef?: string | PartialFASTElementDefinition
    ): TType {
        return new FASTElementDefinition(type, nameOrDef).define().type;
    },
});

/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 * @public
 */
export function customElement(nameOrDef: string | PartialFASTElementDefinition) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type: Function) {
        new FASTElementDefinition(type, nameOrDef).define();
    };
}
