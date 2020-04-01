import { observable } from "@microsoft/fast-element";
import { DesignSystemResolverEntry } from "../styles/recipes";
import { composedParent } from "../utilities";
import { DesignSystemProvider } from "./design-system-provider";

export interface ConsumerArgs {
    recipes: DesignSystemResolverEntry[];
}

export interface DesignSystemConsumer {
    recipes: DesignSystemResolverEntry[];
    provider: DesignSystemProvider | null;
}

export function designSystemConsumer<T extends { new (...args: any[]) }>(
    constructor: T
): T;
export function designSystemConsumer<T extends { new (...args: any[]) }>(
    args: ConsumerArgs
): <_T>(contructor: _T) => _T;
export function designSystemConsumer<T extends { new (...args: any[]) }>(
    argsOrConstructor: any
): any {
    function decorator(constructor: T, options: ConsumerArgs): T {
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

            public disconnectedCallback(): void {
                if (!!this.provider) {
                    this.provider.unsubscribe(this);
                }
            }
        }

        return Consumer;
    }

    if (typeof argsOrConstructor === "function") {
        return decorator(argsOrConstructor, { recipes: [] });
    } else {
        return (constructor: T): T => {
            return decorator(constructor, argsOrConstructor);
        };
    }
}
