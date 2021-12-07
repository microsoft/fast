import {
    FASTElementDefinition,
    html,
    HTMLView,
    ViewTemplate,
} from "@microsoft/fast-element";
import { RenderOperation, Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { FASTElementLayout, Layout, RouteView, Transition } from "./view";
import {
    ElementFallbackRouteDefinition,
    ElementRouteDefinition,
    TemplateFallbackRouteDefinition,
    TemplateRouteDefinition,
} from "./routes";
import { Route } from "./navigation";
import { RecognizedRoute } from "./recognizer";
import { navigationContributor, NavigationContributor } from "./contributors";
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
export class Ignore implements NavigationCommand {
    public async createContributor() {
        return {
            async navigate(phase: NavigationPhase) {
                phase.cancel();
            },
        };
    }
}

/**
 * @alpha
 */
export class Redirect implements NavigationCommand {
    constructor(private redirect: string) {}

    public async createContributor() {
        const redirect = this.redirect;
        return {
            async navigate(phase: NavigationPhase) {
                const config = phase.router.config!;
                const path =
                    (await config.generateRouteFromName(
                        redirect,
                        phase.route.allParams
                    )) ||
                    (await config.generateRouteFromPath(redirect, phase.route.allParams));

                if (path === null) {
                    throw new Error(
                        `Invalid redirect. Name or path not found: ${redirect}`
                    );
                }

                phase.cancel(async () => Route.path.replace(path));
            },
        };
    }
}

function factoryFromElementName(name: string) {
    return html`<${name} ${navigationContributor()}></${name}>`;
}

type ViewFactory = { create(): HTMLView };

function factoryFromElementInstance(element: HTMLElement): ViewFactory {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(element);

    const view = new HTMLView(fragment, [
        navigationContributor().createBehavior(element),
    ]);

    return {
        create() {
            return view;
        },
    };
}

class RenderContributor {
    private operation!: RenderOperation;

    constructor(
        private router: Router,
        private route: RecognizedRoute,
        private command: Render
    ) {}

    async construct(phase: NavigationPhase) {
        if (!this.router.shouldRender(this.route)) {
            phase.cancel();
            return;
        }

        this.operation = await this.router.beginRender(this.route, this.command);
        phase.onCancel(() => this.operation.rollback());
    }

    async commit(phase: NavigationCommitPhase) {
        await this.operation.commit();

        if (this.command.title) {
            phase.setTitle(this.command.title);
        }
    }
}

/**
 * @alpha
 */
export class Render implements RenderCommand {
    private _layout: Layout | null = null;
    private _transition: Transition | null = null;

    public title = "";

    constructor(
        private owner: RouterConfiguration,
        public createView: () => Promise<RouteView>
    ) {}

    public get transition(): Transition {
        return this._transition || this.owner.defaultTransition;
    }

    public set transition(value: Transition) {
        this._transition = value;
    }

    public get layout(): Layout {
        return this._layout || this.owner.defaultLayout;
    }

    public set layout(value: Layout) {
        this._layout = value;
    }

    public async createContributor(router: Router, route: RecognizedRoute) {
        return new RenderContributor(router, route, this);
    }

    public static fromDefinition(
        owner: RouterConfiguration,
        definition:
            | ElementRouteDefinition
            | TemplateRouteDefinition
            | ElementFallbackRouteDefinition
            | TemplateFallbackRouteDefinition
    ): Render {
        let createView: () => Promise<RouteView>;

        if ("template" in definition) {
            createView = async () => {
                let template = definition.template;

                if (typeof template === "function") {
                    template = await template();
                }

                return template.create();
            };
        } else {
            createView = async () => {
                let element = definition.element;
                let factory: ViewFactory | null = null;

                if ((definition as any).factory) {
                    factory = (definition as any).factory as ViewFactory;
                } else if (typeof element === "function") {
                    // Do not cache it becase the function could return
                    // a different value each time.
                    let def = FASTElementDefinition.forType(element);

                    if (def) {
                        factory = factoryFromElementName(def.name);
                    } else {
                        element = await (element as Function)();

                        if (typeof element === "string") {
                            factory = factoryFromElementName(element);
                        } else if (element instanceof HTMLElement) {
                            factory = factoryFromElementInstance(element);
                        } else {
                            def = FASTElementDefinition.forType(element as any);

                            if (def) {
                                factory = factoryFromElementName(def.name);
                            } else {
                                throw new Error(
                                    "Invalid value for element in route config."
                                );
                            }
                        }
                    }
                } else if (element instanceof HTMLElement) {
                    (definition as any).factory = factory = factoryFromElementInstance(
                        element
                    );
                } else {
                    (definition as any).factory = factory = factoryFromElementName(
                        element
                    );
                }

                return factory.create();
            };
        }

        const command = new Render(owner, createView);

        if (definition.layout) {
            if (definition.layout instanceof ViewTemplate) {
                command.layout = new FASTElementLayout(definition.layout);
            } else {
                command.layout = definition.layout;
            }
        }

        if (definition.transition) {
            command.transition = definition.transition;
        }

        if (definition.title) {
            command.title = definition.title;
        }

        return command;
    }
}
