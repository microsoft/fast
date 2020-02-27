import { Controller } from "./controller";

export function createFastElement(BaseType: typeof HTMLElement) {
    return class FastElement extends BaseType {
        public $controller!: Controller;

        public constructor() {
            super();
            Controller.forCustomElement(this);
        }

        public connectedCallback() {
            this.$controller.onConnectedCallback();
        }

        public disconnectedCallback() {
            this.$controller.onDisconnectedCallback();
        }

        public attributeChangedCallback(
            name: string,
            oldValue: string,
            newValue: string
        ) {
            this.$controller.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };
}

export const FastElement = createFastElement(HTMLElement);
