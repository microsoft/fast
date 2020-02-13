export type Resolver = (container: IContainer) => any;

export interface IServiceLocator {
    get<T>(key: InterfaceSymbol<T>): T | null;
    get<T = any>(key: any): T | null;
}

export interface IContainer extends IServiceLocator {
    registerResolver(key: any, resolver: Resolver): void;
}

export interface IRegistry {
    register(controller: IContainer): void;
}

export interface InterfaceSymbol<T> {}

export const DI = {
    createInterface<T>(friendlyName?: string): InterfaceSymbol<T> {
        return Symbol(friendlyName);
    },
};
