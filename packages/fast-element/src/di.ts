export type Resolver = (container: Container) => any;

export interface ServiceLocator {
    get<T>(key: InterfaceSymbol<T>): T | null;
    get<T = any>(key: any): T | null;
}

export interface Container extends ServiceLocator {
    registerResolver(key: any, resolver: Resolver): void;
}

export interface Registry {
    register(controller: Container): void;
}

export interface InterfaceSymbol<T> {}

export const DI = {
    createInterface<T>(friendlyName?: string): InterfaceSymbol<T> {
        return Symbol(friendlyName);
    },
};
