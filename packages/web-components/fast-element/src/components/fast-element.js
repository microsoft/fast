import { Controller } from "./controller";
import { FASTElementDefinition } from "./fast-definitions";
/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement(BaseType) {
    return class extends BaseType {
        constructor() {
            /* eslint-disable-next-line */
            super();
            Controller.forCustomElement(this);
        }
        $emit(type, detail, options) {
            return this.$fastController.emit(type, detail, options);
        }
        connectedCallback() {
            this.$fastController.onConnectedCallback();
        }
        disconnectedCallback() {
            this.$fastController.onDisconnectedCallback();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };
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
    from(BaseType) {
        return createFASTElement(BaseType);
    },
    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define(type, nameOrDef) {
        return new FASTElementDefinition(type, nameOrDef).define().type;
    },
});
/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 * @public
 */
export function customElement(nameOrDef) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type) {
        new FASTElementDefinition(type, nameOrDef).define();
    };
}
