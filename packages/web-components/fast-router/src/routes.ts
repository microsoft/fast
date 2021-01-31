import {
    RouteRecognizer,
    RecognizedRoute,
    Endpoint,
    ConfigurableRoute,
    Route,
} from "./recognizer";
import { NavigationCommand, Redirect, Render, Ignore } from "./commands";
import {
    ViewTemplate,
    FASTElement,
    ElementStyles,
    ComposableStyles,
} from "@microsoft/fast-element";
import { Transition } from "./transition";
import { RouterConfiguration } from "./configuration";
import { Router } from "./router";

export const childRouteParameter = "fast-child-route";

export type LayoutDefinition = {
    template?: ViewTemplate;
    styles?: ComposableStyles | ComposableStyles[];
};

export type Layout = {
    template: ViewTemplate | null;
    styles: ElementStyles | null;
};

export type SupportsSettings<TSettings = any> = {
    settings?: TSettings;
};

export type PathedRouteDefinition<TSettings = any> = SupportsSettings<TSettings> & Route;

export type IgnorableRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings>;

export type LayoutAndTransitionRouteDefinition = {
    layout?: LayoutDefinition | ViewTemplate;
    transition?: Transition;
};

export type RedirectRouteDefinition<TSettings = any> = PathedRouteDefinition<
    TSettings
> & {
    redirect: string;
};

export type NavigableRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    LayoutAndTransitionRouteDefinition & {
        childRouters?: boolean;
    };

export type FASTElementConstructor = new () => FASTElement;

export type HasElement = {
    element:
        | string
        | FASTElementConstructor
        | HTMLElement
        | (() => Promise<string | FASTElementConstructor | HTMLElement>);
};

export type ElementFallbackRouteDefinition<
    TSettings = any
> = LayoutAndTransitionRouteDefinition & HasElement & SupportsSettings<TSettings>;

export type ElementRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasElement;

export type HasTemplate = {
    template: ViewTemplate | (() => Promise<ViewTemplate>);
};

export type TemplateFallbackRouteDefinition<
    TSettings = any
> = LayoutAndTransitionRouteDefinition & HasTemplate & SupportsSettings<TSettings>;

export type TemplateRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasTemplate;

export type HasCommand = {
    command: NavigationCommand;
};

export type CommandRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    HasCommand;

export type CommandFallbackRouteDefinition<TSettings = any> = HasCommand &
    SupportsSettings<TSettings>;

export type FallbackRouteDefinition<TSettings = any> =
    | ElementFallbackRouteDefinition<TSettings>
    | TemplateFallbackRouteDefinition<TSettings>
    | Pick<RedirectRouteDefinition<TSettings>, "redirect">
    | CommandFallbackRouteDefinition<TSettings>;

export type DefinitionCallback = () =>
    | Promise<FallbackRouteDefinition>
    | FallbackRouteDefinition;

export type RenderableRouteDefinition<TSettings = any> =
    | ElementRouteDefinition<TSettings>
    | TemplateRouteDefinition<TSettings>;

export type MappableRouteDefinition<TSettings = any> =
    | RenderableRouteDefinition<TSettings>
    | RedirectRouteDefinition<TSettings>
    | CommandRouteDefinition<TSettings>
    | ParentRouteDefinition<TSettings>;

export type ParentRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    LayoutAndTransitionRouteDefinition & {
        children: MappableRouteDefinition<TSettings>[];
    };

export type RouteLocationResult<TSettings = any> = {
    route: RecognizedRoute<TSettings>;
    command: NavigationCommand;
};

function getFallbackCommand(
    config: RouterConfiguration,
    definition: FallbackRouteDefinition
): NavigationCommand {
    if ("command" in definition) {
        return definition.command;
    } else if ("redirect" in definition) {
        return new Redirect(definition.redirect);
    } else {
        return Render.fromDefinition(config, definition);
    }
}

export class RouteCollection<TSettings = any> {
    private recognizer = new RouteRecognizer<TSettings>();
    private configToCommand = new Map<string, NavigationCommand>();
    private fallbackCommand: NavigationCommand | null = null;
    private fallbackSettings: TSettings | null = null;

    public constructor(private owner: RouterConfiguration) {}

    public ignore(definitionOrString: IgnorableRouteDefinition<TSettings> | string) {
        if (typeof definitionOrString === "string") {
            definitionOrString = { path: definitionOrString };
        }

        this.configToCommand.set(definitionOrString.path, new Ignore());
        this.recognizer.add(definitionOrString, definitionOrString.settings);
    }

    public map(...routes: MappableRouteDefinition<TSettings>[]) {
        for (const route of routes) {
            if ("children" in route) {
                const childRoutes = route.children.map(x => {
                    const childRoute = {
                        ...route,
                        ...x,
                        path: `${route.path}/${x.path}`,
                    };

                    if (childRoute.children === route.children) {
                        delete (childRoute as any).children;
                    }

                    return childRoute;
                });

                this.map(...childRoutes);
                continue;
            }

            let command: NavigationCommand;

            if ("command" in route) {
                command = route.command;
            } else if ("redirect" in route) {
                command = new Redirect(route.redirect);
            } else {
                command = Render.fromDefinition(this.owner, route);
            }

            this.configToCommand.set(route.path, command);
            this.recognizer.add(route, route.settings);

            if ("childRouters" in route && route.childRouters) {
                const childRouterRoute = {
                    ...route,
                    path: route.path + `/*${childRouteParameter}`,
                };

                this.configToCommand.set(childRouterRoute.path, command);
                this.recognizer.add(childRouterRoute, childRouterRoute.settings);
            }
        }
    }

    public fallback(
        definitionOrCallback: FallbackRouteDefinition<TSettings> | DefinitionCallback
    ) {
        const owner = this.owner;

        if (typeof definitionOrCallback === "function") {
            this.fallbackCommand = {
                async createContributor(router: Router, route: RecognizedRoute) {
                    const input = await definitionOrCallback();
                    const command = getFallbackCommand(owner, input);
                    return command.createContributor(router, route);
                },
            };
        } else {
            this.fallbackCommand = getFallbackCommand(owner, definitionOrCallback);
        }
    }

    public find(path: string): RouteLocationResult<TSettings> | null {
        const result = this.recognizer.recognize(path);

        if (result !== null) {
            return {
                route: result,
                command: this.configToCommand.get(result.endpoint.path)!,
            };
        }

        if (this.fallbackCommand !== null) {
            return {
                route: new RecognizedRoute<TSettings>(
                    new Endpoint<TSettings>(
                        new ConfigurableRoute("*", false),
                        [],
                        this.fallbackSettings
                    ),
                    {}
                ),
                command: this.fallbackCommand,
            };
        }

        return null;
    }
}
