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
import { DefaultNavigationQueue } from "./navigation";
import { Layout, Transition } from "./view";
import { RouteCollection } from "./routes";
import { DefaultLinkHandler } from "./links";
import { DefaultNavigationProcess } from "./process";
import { DefaultTitleBuilder } from "./titles";
import { DefaultRoutingEventSink } from "./events";
import { isNavigationPhaseContributor } from "./contributors";
import { DefaultRouteRecognizer } from "./recognizer";
/**
 * @alpha
 */
export class RouterConfiguration {
    constructor() {
        this.isConfigured = false;
        this.routes = new RouteCollection(this);
        this.contributors = [];
        this.defaultLayout = Layout.default;
        this.defaultTransition = Transition.default;
        this.title = "";
        this.parent = null;
    }
    createNavigationQueue() {
        return this.construct(DefaultNavigationQueue);
    }
    createLinkHandler() {
        return this.construct(DefaultLinkHandler);
    }
    createNavigationProcess() {
        return new DefaultNavigationProcess();
    }
    createEventSink() {
        return this.construct(DefaultRoutingEventSink);
    }
    createTitleBuilder() {
        return this.construct(DefaultTitleBuilder);
    }
    createRouteRecognizer() {
        return this.construct(DefaultRouteRecognizer);
    }
    construct(Type) {
        if (this.parent !== null) {
            return this.parent.construct(Type);
        }
        return new Type();
    }
    recognizeRoute(path) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConfigured();
            return this.routes.recognize(path);
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
    generateRouteFromName(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConfigured();
            return this.routes.generateFromName(name, params);
        });
    }
    /**
     * Generate a path and query string from a route path and params object.
     *
     * @param path - The path of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateRouteFromPath(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConfigured();
            return this.routes.generateFromPath(path, params);
        });
    }
    findContributors(phase) {
        return this.contributors.filter(x => isNavigationPhaseContributor(x, phase));
    }
    cached(ElementType) {
        let instance = null;
        return () =>
            __awaiter(this, void 0, void 0, function* () {
                if (instance === null) {
                    instance = new ElementType();
                }
                return instance;
            });
    }
    ensureConfigured() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConfigured) {
                yield this.configure();
                this.isConfigured = true;
            }
        });
    }
}
