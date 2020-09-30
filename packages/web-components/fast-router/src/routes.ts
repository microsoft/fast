import { RouteRecognizer, RecognizedRoute, Endpoint } from "./recognizer";
import { NavigationCommand, Redirect, Render, Ignore } from "./commands";
import {
    ViewTemplate,
    FASTElement,
    ElementStyles,
    ComposableStyles,
} from "@microsoft/fast-element";
import { Transition } from "./transition";
import { RouterConfiguration } from "./configuration";

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

export type PathedRouteDefinition<TSettings = any> = SupportsSettings<TSettings> & {
    path: string;
    caseSensitive?: boolean;
};

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
    LayoutAndTransitionRouteDefinition;

export type FASTElementConstructor = new () => FASTElement;

export type HasElement = {
    element:
        | string
        | FASTElementConstructor
        | (() => Promise<string | FASTElementConstructor>);
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
    | RedirectRouteDefinition<TSettings>
    | CommandFallbackRouteDefinition<TSettings>;

export type RenderableRouteDefinition<TSettings = any> =
    | ElementRouteDefinition<TSettings>
    | TemplateRouteDefinition<TSettings>;

export type MappableRouteDefinition<TSettings = any> =
    | RenderableRouteDefinition<TSettings>
    | RedirectRouteDefinition<TSettings>
    | CommandRouteDefinition<TSettings>;

export type RouteLocationResult<TSettings = any> = {
    route: RecognizedRoute<TSettings>;
    command: NavigationCommand;
};

export class RouteCollection<TSettings = any> {
    private recognizer = new RouteRecognizer<TSettings>();
    private configToCommand = new Map<any, NavigationCommand>();
    private fallbackCommand: NavigationCommand | null = null;
    private fallbackSettings: TSettings | null = null;

    public constructor(private owner: RouterConfiguration) {}

    public ignore(definitionOrString: IgnorableRouteDefinition<TSettings> | string) {
        if (typeof definitionOrString === "string") {
            definitionOrString = { path: definitionOrString };
        }

        const path = {
            value: definitionOrString.path,
            caseSensitive: definitionOrString.caseSensitive === true,
        };

        this.configToCommand.set(path, new Ignore());
        this.recognizer.add(path, false, definitionOrString.settings);
    }

    public map(...routes: MappableRouteDefinition<TSettings>[]) {
        for (const route of routes) {
            let command: NavigationCommand;

            if ("command" in route) {
                command = route.command;
            } else if ("redirect" in route) {
                command = new Redirect(route.redirect);
            } else {
                command = Render.fromDefinition(this.owner, route);
            }

            const path = {
                value: route.path,
                caseSensitive: route.caseSensitive === true,
            };

            this.configToCommand.set(path, command);
            this.recognizer.add(path, false, route.settings);
        }
    }

    public fallback(definition: FallbackRouteDefinition<TSettings>) {
        if ("command" in definition) {
            this.fallbackCommand = definition.command;
        } else if ("redirect" in definition) {
            this.fallbackCommand = new Redirect(definition.redirect);
        } else {
            this.fallbackCommand = Render.fromDefinition(this.owner, definition);
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
                        true,
                        { value: "*" },
                        [],
                        this.fallbackSettings
                    ),
                    {},
                    null
                ),
                command: this.fallbackCommand,
            };
        }

        return null;
    }
}
