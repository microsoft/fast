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
import { FASTElement } from "@microsoft/fast-element";
import { NavigationMessage } from "./navigation";
import { childRouteParameter } from "./routes";
import { RouterExecutionContext } from "./view";
const routerProperty = "$router";
// TODO: remove this from here and from fast-foundation
// TODO: move this to fast-element so router and foundation can both use it
function composedParent(element) {
    const parentNode = element.parentElement;
    if (parentNode) {
        return parentNode;
    } else {
        const rootNode = element.getRootNode();
        if (rootNode.host instanceof HTMLElement) {
            // this is shadow-root
            return rootNode.host;
        }
    }
    return null;
}
function findParentRouterForElement(element) {
    let parent = element;
    while ((parent = composedParent(parent))) {
        if (routerProperty in parent) {
            return parent[routerProperty];
        }
    }
    return null;
}
/**
 * @alpha
 */
export const Router = Object.freeze({
    getOrCreateFor(element) {
        const router = element[routerProperty];
        if (router !== void 0) {
            return router;
        }
        return (element[routerProperty] = new DefaultRouter(element));
    },
    find(element) {
        return element[routerProperty] || findParentRouterForElement(element);
    },
    from(BaseType) {
        class RouterBase extends BaseType {
            constructor() {
                super();
                Router.getOrCreateFor(this);
            }
            get config() {
                return this[routerProperty].config;
            }
            set config(value) {
                this[routerProperty].config = value;
            }
        }
        const proto = RouterBase.prototype;
        if ("connectedCallback" in proto) {
            const original = proto.connectedCallback;
            proto.connectedCallback = function () {
                original.call(this);
                this[routerProperty].connect();
            };
        } else {
            proto.connectedCallback = function () {
                this[routerProperty].connect();
            };
        }
        if ("disconnectedCallback" in proto) {
            const original = proto.disconnectedCallback;
            proto.disconnectedCallback = function () {
                original.call(this);
                this[routerProperty].disconnect();
            };
        } else {
            proto.disconnectedCallback = function () {
                this[routerProperty].disconnect();
            };
        }
        return RouterBase;
    },
});
/**
 * @alpha
 */
export function isFASTElementHost(host) {
    return host instanceof FASTElement;
}
/**
 * @alpha
 */
export class DefaultRouter {
    constructor(host) {
        this.host = host;
        this.parentRouter = void 0;
        this.contributors = new Set();
        this.navigationQueue = null;
        this.linkHandler = null;
        this.newView = null;
        this.newRoute = null;
        this.childCommandContributor = null;
        this.childRoute = null;
        this.isConnected = false;
        this.routerConfig = null;
        this.view = null;
        this.route = null;
        this.onNavigationMessage = message =>
            __awaiter(this, void 0, void 0, function* () {
                const process = this.config.createNavigationProcess();
                yield process.run(this, message);
                this.navigationQueue.receive().then(this.onNavigationMessage);
            });
        host[routerProperty] = this;
    }
    get config() {
        return this.routerConfig;
    }
    set config(value) {
        this.routerConfig = value;
        this.tryConnect();
    }
    get parent() {
        if (this.parentRouter === void 0) {
            if (!this.isConnected) {
                return null;
            }
            this.parentRouter = findParentRouterForElement(this.host);
        }
        return this.parentRouter || null;
    }
    get level() {
        if (this.parent === null) {
            return 0;
        }
        return this.parent.level + 1;
    }
    shouldRender(route) {
        var _a;
        if (this.route && this.route.endpoint.path === route.endpoint.path) {
            const newParams =
                route === null || route === void 0 ? void 0 : route.allParams;
            const oldParams =
                (_a = this.route) === null || _a === void 0 ? void 0 : _a.allParams;
            if (JSON.stringify(oldParams) === JSON.stringify(newParams)) {
                return false;
            }
        }
        return true;
    }
    beginRender(route, command) {
        return __awaiter(this, void 0, void 0, function* () {
            this.newRoute = route;
            this.newView = yield command.createView();
            this.newView.bind(route.allTypedParams, RouterExecutionContext.create(this));
            this.newView.appendTo(this.host);
            yield command.transition.begin(this.host, this.view, this.newView);
            return {
                commit: this.renderOperationCommit.bind(
                    this,
                    command.layout,
                    command.transition
                ),
                rollback: this.renderOperationRollback.bind(this, command.transition),
            };
        });
    }
    connect() {
        this.isConnected = true;
        this.tryConnect();
    }
    disconnect() {
        if (this.parent === null) {
            if (this.navigationQueue !== null) {
                this.navigationQueue.disconnect();
                this.navigationQueue = null;
            }
            if (this.linkHandler !== null) {
                this.linkHandler.disconnect();
                this.linkHandler = null;
            }
        } else {
            this.parent.removeContributor(this);
        }
        this.isConnected = false;
        this.parentRouter = void 0;
    }
    addContributor(contributor) {
        this.contributors.add(contributor);
    }
    removeContributor(contributor) {
        this.contributors.delete(contributor);
    }
    tryConnect() {
        if (this.config === null || !this.isConnected) {
            return;
        }
        if (this.parent === null) {
            if (this.navigationQueue !== null) {
                this.navigationQueue.disconnect();
            }
            this.navigationQueue = this.config.createNavigationQueue();
            this.navigationQueue.connect();
            this.navigationQueue.receive().then(this.onNavigationMessage);
            if (this.linkHandler !== null) {
                this.linkHandler.disconnect();
            }
            this.linkHandler = this.config.createLinkHandler();
            this.linkHandler.connect();
        } else {
            this.config.parent = this.parent.config;
            this.parent.addContributor(this);
        }
    }
    renderOperationCommit(layout, transition) {
        return __awaiter(this, void 0, void 0, function* () {
            yield layout.beforeCommit(this.host);
            yield transition.commit(this.host, this.view, this.newView);
            yield layout.afterCommit(this.host);
            if (this.view !== null) {
                this.view.dispose();
            }
            this.route = this.newRoute;
            this.view = this.newView;
            this.newRoute = null;
            this.newView = null;
        });
    }
    renderOperationRollback(transition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.newView !== null) {
                yield transition.rollback(this.host, this.view, this.newView);
                this.newView.dispose();
                this.newRoute = null;
                this.newView = null;
            }
        });
    }
    navigate(phase) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tunnel(phase);
        });
    }
    leave(phase) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tunnel(phase);
            if (!phase.canceled) {
                const contributors = this.contributors;
                this.contributors = new Set();
                phase.onCancel(() => (this.contributors = contributors));
            }
        });
    }
    construct(phase) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.parent !== null) {
                const rest = phase.route.allParams[childRouteParameter] || "";
                const match = yield this.config.recognizeRoute(rest);
                if (match === null) {
                    const events = this.config.createEventSink();
                    events.onUnhandledNavigationMessage(
                        this,
                        new NavigationMessage(rest)
                    );
                    phase.cancel();
                    return;
                }
                this.childRoute = match.route;
                this.childCommandContributor = yield match.command.createContributor(
                    this,
                    match.route
                );
            }
            yield this.tunnel(phase);
        });
    }
    enter(phase) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tunnel(phase);
        });
    }
    commit(phase) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tunnel(phase);
        });
    }
    tunnel(phase) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = this.childRoute;
            const contributor = this.childCommandContributor;
            if (route && contributor) {
                yield phase.evaluateContributor(contributor, route, this);
            }
            if (phase.canceled) {
                return;
            }
            const potentialContributors = [
                ...this.config.findContributors(phase.name),
                ...Array.from(this.contributors),
            ];
            for (const potential of potentialContributors) {
                yield phase.evaluateContributor(potential, void 0, this);
                if (phase.canceled) {
                    return;
                }
            }
        });
    }
}
