import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { Layout, RouteView, Transition } from "./view";
import {
    ElementRouteDefinition,
    TemplateRouteDefinition,
    ElementFallbackRouteDefinition,
    TemplateFallbackRouteDefinition,
} from "./routes";
import { RecognizedRoute } from "./recognizer";
import { NavigationContributor } from "./contributors";
import { NavigationCommitPhase, NavigationPhase } from "./phases";
/**
 * @alpha
 */
export interface NavigationCommand {
    createContributor(
        router: Router,
        route: RecognizedRoute
    ): Promise<NavigationContributor>;
}
/**
 * @alpha
 */
export interface RenderCommand extends NavigationCommand {
    layout: Layout;
    transition: Transition;
    createView(): Promise<RouteView>;
}
/**
 * @alpha
 */
export declare class Ignore implements NavigationCommand {
    createContributor(): Promise<{
        navigate(phase: NavigationPhase): Promise<void>;
    }>;
}
/**
 * @alpha
 */
export declare class Redirect implements NavigationCommand {
    private redirect;
    constructor(redirect: string);
    createContributor(): Promise<{
        navigate(phase: NavigationPhase): Promise<void>;
    }>;
}
declare class RenderContributor {
    private router;
    private route;
    private command;
    private operation;
    constructor(router: Router, route: RecognizedRoute, command: Render);
    construct(phase: NavigationPhase): Promise<void>;
    commit(phase: NavigationCommitPhase): Promise<void>;
}
/**
 * @alpha
 */
export declare class Render implements RenderCommand {
    private owner;
    createView: () => Promise<RouteView>;
    private _layout;
    private _transition;
    title: string;
    constructor(owner: RouterConfiguration, createView: () => Promise<RouteView>);
    get transition(): Transition;
    set transition(value: Transition);
    get layout(): Layout;
    set layout(value: Layout);
    createContributor(router: Router, route: RecognizedRoute): Promise<RenderContributor>;
    static fromDefinition(
        owner: RouterConfiguration,
        definition:
            | ElementRouteDefinition
            | TemplateRouteDefinition
            | ElementFallbackRouteDefinition
            | TemplateFallbackRouteDefinition
    ): Render;
}
export {};
