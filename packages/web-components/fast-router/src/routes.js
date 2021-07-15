var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { RecognizedRoute, Endpoint, ConfigurableRoute } from "./recognizer";
import { Redirect, Render, Ignore } from "./commands";
import { QueryString } from "./query-string";
/**
 * @internal
 */
export const childRouteParameter = "fast-child-route";
function getFallbackCommand(config, definition) {
    if ("command" in definition) {
        return definition.command;
    } else if ("redirect" in definition) {
        return new Redirect(definition.redirect);
    } else {
        return Render.fromDefinition(config, definition);
    }
}
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
const defaultConverters = {
    number: value => (value === void 0 ? NaN : parseFloat(value)),
    float: value => (value === void 0 ? NaN : parseFloat(value)),
    int: value => (value === void 0 ? NaN : parseInt(value)),
    integer: value => (value === void 0 ? NaN : parseInt(value)),
    Date: value => (value === void 0 ? new Date(Date.now()) : new Date(value)),
    boolean: booleanConverter,
    bool: booleanConverter,
};
/**
 * @alpha
 */
export class RouteCollection {
    constructor(owner) {
        this.owner = owner;
        this._recognizer = null;
        this.pathToCommand = new Map();
        this.fallbackCommand = null;
        this.fallbackSettings = null;
        this.converters = {};
    }
    get recognizer() {
        if (this._recognizer === null) {
            this._recognizer = this.owner.createRouteRecognizer();
        }
        return this._recognizer;
    }
    ignore(definitionOrString) {
        if (typeof definitionOrString === "string") {
            definitionOrString = { path: definitionOrString };
        }
        this.pathToCommand.set(definitionOrString.path, new Ignore());
        this.recognizer.add(definitionOrString, definitionOrString.settings);
    }
    map(...routes) {
        for (const route of routes) {
            if ("children" in route) {
                const titleBuilder = this.owner.createTitleBuilder();
                const childRoutes = route.children.map(x => {
                    const childRoute = Object.assign(
                        Object.assign(Object.assign({}, route), x),
                        { path: `${route.path}/${x.path}` }
                    );
                    if ("title" in route || "title" in x) {
                        const parentTitle = route.title || "";
                        const childTitle = x.title || "";
                        childRoute.title = titleBuilder.joinTitles(
                            parentTitle,
                            childTitle
                        );
                    }
                    if ("name" in x) {
                        const parentName = route.name ? route.name + "/" : "";
                        childRoute.name = parentName + x.name;
                    }
                    if (childRoute.children === route.children) {
                        delete childRoute.children;
                    }
                    return childRoute;
                });
                this.map(...childRoutes);
                continue;
            }
            let command;
            if ("command" in route) {
                command = route.command;
            } else if ("redirect" in route) {
                command = new Redirect(route.redirect);
            } else {
                command = Render.fromDefinition(this.owner, route);
            }
            this.pathToCommand.set(route.path, command);
            this.recognizer.add(route, route.settings);
            if ("childRouters" in route && route.childRouters) {
                const childRouterRoute = Object.assign(Object.assign({}, route), {
                    path: route.path + `/*${childRouteParameter}`,
                });
                this.pathToCommand.set(childRouterRoute.path, command);
                this.recognizer.add(childRouterRoute, childRouterRoute.settings);
            }
        }
    }
    fallback(definitionOrCallback) {
        const owner = this.owner;
        if (typeof definitionOrCallback === "function") {
            this.fallbackCommand = {
                createContributor(router, route) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const input = yield definitionOrCallback();
                        const command = getFallbackCommand(owner, input);
                        return command.createContributor(router, route);
                    });
                },
            };
        } else {
            this.fallbackCommand = getFallbackCommand(owner, definitionOrCallback);
        }
    }
    converter(name, converter) {
        let normalizedConverter;
        if ("convert" in converter) {
            normalizedConverter = converter.convert.bind(converter);
        } else if (converter.prototype && "convert" in converter.prototype) {
            normalizedConverter = value => {
                const obj = this.owner.construct(converter);
                return obj.convert(value);
            };
        } else {
            normalizedConverter = converter;
        }
        this.converters[name] = normalizedConverter;
    }
    recognize(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.recognizer.recognize(
                path,
                this.aggregateConverters()
            );
            if (result !== null) {
                return {
                    route: result,
                    command: this.pathToCommand.get(result.endpoint.path),
                };
            }
            if (this.fallbackCommand !== null) {
                const separated = QueryString.separate(path);
                const queryParams = QueryString.parse(separated.queryString);
                return {
                    route: new RecognizedRoute(
                        new Endpoint(
                            new ConfigurableRoute("*", "", false),
                            [],
                            [],
                            this.fallbackSettings
                        ),
                        {},
                        {},
                        queryParams
                    ),
                    command: this.fallbackCommand,
                };
            }
            return null;
        });
    }
    /**
     * Generate a path and query string from a route name and params object.
     *
     * @param name - The name of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateFromName(name, params) {
        return this.recognizer.generateFromName(name, params);
    }
    /**
     * Generate a path and query string from a route path and params object.
     *
     * @param path - The path of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateFromPath(path, params) {
        return this.recognizer.generateFromPath(path, params);
    }
    aggregateConverters() {
        if (this.owner.parent === null) {
            return Object.assign(Object.assign({}, defaultConverters), this.converters);
        }
        return Object.assign(
            Object.assign({}, this.owner.parent.routes.aggregateConverters()),
            this.converters
        );
    }
}
