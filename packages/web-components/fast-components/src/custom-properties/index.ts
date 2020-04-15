import { Behavior, FastElement } from "@microsoft/fast-element";
export interface CustomPropertyDefinition {
    /**
     * The custom property name
     */
    name: string;

    /**
     * The value of the custom property or a function that resolves the value
     */
    value: string | ((...args: any[]) => string);
}

export interface CustomPropertyTarget {
    registerCustomPropertyBehavior(behavior: CustomPropertyDefinition): void;
    unregisterCustomPropertyBehavior(behavior: CustomPropertyDefinition): void;
}

export class CustomPropertyBehavior implements Behavior, CustomPropertyDefinition {
    constructor(
        /**
         * The name of the custom property
         */
        public readonly name: string,

        /**
         * The value of the custom property or a function that resolves the value
         */
        public readonly value: string | ((...arg: any[]) => string),

        /**
         * A function to retrieve the element that should host the custom property
         */
        private host: (source: typeof FastElement) => CustomPropertyTarget | null
    ) {}

    public bind(source: typeof FastElement) {
        const target = this.host(source);

        if (target) {
            target.registerCustomPropertyBehavior(this);
        }
    }

    public unbind(source: typeof FastElement) {
        const target = this.host(source);

        if (target) {
            target.unregisterCustomPropertyBehavior(this);
        }
    }
}

export * from "./custom-property-manager";
