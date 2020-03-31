import { FastElement, Observable } from "@microsoft/fast-element";
import { DesignSystemResolverEntry } from "../styles/recipes";
import { neutralforegroundrest } from "../styles/recipes";
import { composedParent } from "../utilities";
import { DesignSystemProvider } from "./design-system-provider";

/* tslint:disable */
interface ConsumerArgs {
    recipes: DesignSystemResolverEntry[];
}

export function consumer(args: ConsumerArgs): (source: any) => any {
    return (source: any) => {
        return class Consumer extends source {
            public readonly recipes = args.recipes;

            private provider: DesignSystemProvider | null = null; // TODO: duplicate
            /**
             * Find the parent DesignSystem provider.
             * TODO: duplicate
             */
            public findProvider(): DesignSystemProvider | null {
                let parent = composedParent(this as any);

                while (parent !== null) {
                    if (parent instanceof DesignSystemProvider) {
                        return parent;
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

                    this.recipes.forEach(recipe => this.provider!.suscribe(this));
                }
            }
        };
    };
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
        return class extends constructor implements DesignSystemConsumer {
            public readonly recipes = options.recipes;

            public provider: DesignSystemProvider | null = null;

            /**
             * Find the parent DesignSystem provider.
             */
            public findProvider(): DesignSystemProvider | null {
                let parent = composedParent(this as any);

                while (parent !== null) {
                    if (parent instanceof DesignSystemProvider) {
                        return parent;
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
        };
    }

    if (typeof argsOrConstructor === "function") {
        return decorator(argsOrConstructor, { recipes: [] });
    } else {
        return (constructor: T) => {
            return decorator(constructor, argsOrConstructor);
        };
    }
}
