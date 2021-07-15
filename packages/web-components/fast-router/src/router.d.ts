import { FASTElement } from "@microsoft/fast-element";
import { RenderCommand } from "./commands";
import { RouterConfiguration } from "./configuration";
import { NavigationContributor } from "./contributors";
import { RecognizedRoute } from "./recognizer";
/**
 * @alpha
 */
export interface RenderOperation {
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
/**
 * @alpha
 */
export interface Router<TSettings = any> {
    readonly level: number;
    readonly parent: Router | null;
    readonly route: RecognizedRoute | null;
    config: RouterConfiguration | null;
    connect(): void;
    disconnect(): void;
    shouldRender(route: RecognizedRoute<TSettings>): boolean;
    beginRender(
        route: RecognizedRoute<TSettings>,
        command: RenderCommand
    ): Promise<RenderOperation>;
    addContributor(contributor: NavigationContributor): void;
    removeContributor(contributor: NavigationContributor): void;
}
declare const routerProperty = "$router";
/**
 * @alpha
 */
export interface RouterElement extends HTMLElement {
    readonly [routerProperty]: Router;
    config: RouterConfiguration | null;
    connectedCallback(): any;
    disconnectedCallback(): any;
}
/**
 * @alpha
 */
export declare const Router: Readonly<{
    getOrCreateFor(element: HTMLElement): Router<any> | DefaultRouter;
    find(element: HTMLElement): Router | null;
    from<
        TBase extends {
            new (): HTMLElement;
            prototype: HTMLElement;
        }
    >(
        BaseType: TBase
    ): new () => InstanceType<TBase> & RouterElement;
}>;
/**
 * @alpha
 */
export declare function isFASTElementHost(
    host: HTMLElement
): host is HTMLElement & FASTElement;
/**
 * @alpha
 */
export declare class DefaultRouter implements Router {
    readonly host: HTMLElement;
    private parentRouter;
    private contributors;
    private navigationQueue;
    private linkHandler;
    private newView;
    private newRoute;
    private childCommandContributor;
    private childRoute;
    private isConnected;
    private routerConfig;
    private view;
    route: RecognizedRoute | null;
    constructor(host: HTMLElement);
    get config(): RouterConfiguration | null;
    set config(value: RouterConfiguration | null);
    get parent(): Router<any>;
    get level(): number;
    shouldRender(route: RecognizedRoute): boolean;
    beginRender(
        route: RecognizedRoute,
        command: RenderCommand
    ): Promise<{
        commit: any;
        rollback: any;
    }>;
    connect(): void;
    disconnect(): void;
    addContributor(contributor: NavigationContributor): void;
    removeContributor(contributor: NavigationContributor): void;
    private tryConnect;
    private onNavigationMessage;
    private renderOperationCommit;
    private renderOperationRollback;
    private navigate;
    private leave;
    private construct;
    private enter;
    private commit;
    private tunnel;
}
export {};
