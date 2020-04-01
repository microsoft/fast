import { FastElement, Observable, observable } from "@microsoft/fast-element";
import { DesignSystemResolverEntry } from "../styles/recipes";
import { neutralforegroundrest } from "../styles/recipes";
import { composedParent } from "../utilities";
import { DesignSystemProvider } from "./design-system-provider";

/* tslint:disable */
export interface ConsumerArgs {
    recipes: DesignSystemResolverEntry[];
}

export interface DesignSystemConsumer {
    recipes: DesignSystemResolverEntry[];
    provider: DesignSystemProvider | null;
}

export function designSystemConsumer<T extends { new (...args: any[]) }>(constructor: T);
export function designSystemConsumer<T extends { new (...args: any[]) }>(
    args: ConsumerArgs
);
export function designSystemConsumer<T extends { new (...args: any[]) }>(
    argsOrConstructor: any
) {
    function decorator(constructor: T, options: ConsumerArgs) {
        class Consumer extends constructor implements DesignSystemConsumer {
            public readonly recipes = options.recipes;

            @observable
            public provider: DesignSystemProvider | null = null;

            /**
             * Find the parent DesignSystem provider.
             */
            public findProvider(): DesignSystemProvider | null {
                let parent = composedParent(this as any);

                while (parent !== null) {
                    if ((parent as any).isDesignSystemProvider) {
                        return parent as any;
                    } else {
                        parent = composedParent(parent);
                    }
                }

                return null;
            }

            public connectedCallback(): void {
                super.connectedCallback();

                const provider = this.findProvider();

                if (!!provider) {
                    this.provider = provider;
                    this.provider.suscribe(this);
                }
            }
        }

        return Consumer;
    }

    if (typeof argsOrConstructor === "function") {
        return decorator(argsOrConstructor, { recipes: [] });
    } else {
        return (constructor: T) => {
            return decorator(constructor, argsOrConstructor);
        };
    }
}
