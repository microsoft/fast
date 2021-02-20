import {
    RouteRecognizer,
    RecognizedRoute,
    Endpoint,
    ConfigurableRoute,
    Route,
    RouteParameterConverter,
} from "./recognizer";
import { NavigationCommand, Redirect, Render, Ignore } from "./commands";
import {
    ViewTemplate,
    FASTElement,
    ElementStyles,
    ComposableStyles,
    Constructable,
} from "@microsoft/fast-element";
import { Transition } from "./transition";
import { RouterConfiguration } from "./configuration";
import { Router } from "./router";

export const childRouteParameter = "fast-child-route";

export type LayoutDefinition = {
    template?: ViewTemplate | null;
    styles?: ComposableStyles | ComposableStyles[] | null;
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

export type HasTitle = {
    title?: string;
};

export type NavigableRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    LayoutAndTransitionRouteDefinition &
    HasTitle & {
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
> = LayoutAndTransitionRouteDefinition &
    HasElement &
    SupportsSettings<TSettings> &
    HasTitle;

export type ElementRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasElement;

export type HasTemplate = {
    template: ViewTemplate | (() => Promise<ViewTemplate>);
};

export type TemplateFallbackRouteDefinition<
    TSettings = any
> = LayoutAndTransitionRouteDefinition &
    HasTemplate &
    SupportsSettings<TSettings> &
    HasTitle;

export type TemplateRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasTemplate;

export type HasCommand = {
    command: NavigationCommand;
};

export type CommandRouteDefinition<TSettings = any> = PathedRouteDefinition<TSettings> &
    HasCommand &
    HasTitle;

export type CommandFallbackRouteDefinition<TSettings = any> = HasCommand &
    SupportsSettings<TSettings> &
    HasTitle;

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

export type ConverterObject = {
    convert: RouteParameterConverter;
};

export type ParameterConverter =
    | RouteParameterConverter
    | ConverterObject
    | Constructable<ConverterObject>;

const booleanConverter = value => {
    if (value === void 0 || value === null) {
        return false;
    }

    switch (value.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        default:
            return false;
    }
};

export class RouteCollection<TSettings = any> {
    private recognizer = new RouteRecognizer<TSettings>();
    private configToCommand = new Map<string, NavigationCommand>();
    private fallbackCommand: NavigationCommand | null = null;
    private fallbackSettings: TSettings | null = null;
    private converters: Record<string, RouteParameterConverter> = {};

    public constructor(private owner: RouterConfiguration) {
        this.converter("number", value => (value === void 0 ? NaN : parseFloat(value)));
        this.converter("float", value => (value === void 0 ? NaN : parseFloat(value)));
        this.converter("int", value => (value === void 0 ? NaN : parseInt(value)));
        this.converter("integer", value => (value === void 0 ? NaN : parseInt(value)));
        this.converter("Date", value =>
            value === void 0 ? new Date(Date.now()) : new Date(value)
        );
        this.converter("boolean", booleanConverter);
        this.converter("bool", booleanConverter);
    }

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
                const titleBuilder = this.owner.createTitleBuilder();
                const childRoutes = route.children.map(x => {
                    const childRoute = {
                        ...route,
                        ...x,
                        path: `${route.path}/${x.path}`,
                    };

                    if ("title" in route || "title" in x) {
                        const parentTitle = (route as HasTitle).title || "";
                        const childTitle = (x as HasTitle).title || "";
                        (childRoute as HasTitle).title = titleBuilder.joinTitles(
                            parentTitle,
                            childTitle
                        );
                    }

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

    public converter(name: string, converter: ParameterConverter) {
        let normalizedConverter: RouteParameterConverter;

        if ("convert" in converter) {
            normalizedConverter = converter.convert.bind(converter);
        } else if (converter.prototype && "convert" in converter.prototype) {
            normalizedConverter = (value: string | undefined) => {
                const obj = this.owner.construct(
                    converter as Constructable<ConverterObject>
                );
                return obj.convert(value);
            };
        } else {
            normalizedConverter = converter as RouteParameterConverter;
        }

        this.converters[name] = normalizedConverter;
    }

    public async find(path: string): Promise<RouteLocationResult<TSettings> | null> {
        const result = await this.recognizer.recognize(path, this.converters);

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
                        [],
                        this.fallbackSettings
                    ),
                    {},
                    {}
                ),
                command: this.fallbackCommand,
            };
        }

        return null;
    }
}
