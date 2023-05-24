import {
    CompiledViewBehaviorFactory,
    FASTElementDefinition,
    html,
    HTMLView,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { RenderOperation, Router } from "./router.js";
import { RouterConfiguration } from "./configuration.js";
import { FASTElementLayout, Layout, RouteView, Transition } from "./view.js";
import {
    ElementFallbackRouteDefinition,
    ElementRouteDefinition,
    TemplateFallbackRouteDefinition,
    TemplateRouteDefinition,
} from "./routes.js";
import { Route } from "./navigation.js";
import { RecognizedRoute } from "./recognizer.js";
import { navigationContributor, NavigationContributor } from "./contributors.js";
import { NavigationCommitPhase, NavigationPhase } from "./phases.js";

/**
 * @beta
 */
export interface NavigationCommand {
    createContributor(
        router: Router,
        route: RecognizedRoute
    ): Promise<NavigationContributor>;
}

/**
 * @beta
 */
export interface RenderCommand extends NavigationCommand {
    layout: Layout;
    transition: Transition;
    createView(): Promise<RouteView>;
}

/**
 * @beta
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
 * @beta
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

function factoryFromElementName(tagName: string) {
    const tag = html.partial(tagName);
    return html`<${tag} ${navigationContributor()}></${tag}>`;
}

type ViewFactory = { create(): HTMLView };

function factoryFromElementInstance(element: HTMLElement): ViewFactory {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(element);

    const factory =
        navigationContributor() as ViewBehaviorFactory as CompiledViewBehaviorFactory;
    factory.targetNodeId = "h";

    const view = new HTMLView(fragment, [factory], {
        [factory.targetNodeId]: element,
    });

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
 * @beta
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
                    let def = FASTElementDefinition.getByType(element);

                    if (def) {
                        factory = factoryFromElementName(def.name);
                    } else {
                        element = await (element as Function)();

                        if (typeof element === "string") {
                            factory = factoryFromElementName(element);
                        } else if (element instanceof HTMLElement) {
                            factory = factoryFromElementInstance(element);
                        } else {
                            def = FASTElementDefinition.getByType(element);

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
                    (definition as any).factory = factory =
                        factoryFromElementInstance(element);
                } else {
                    (definition as any).factory = factory =
                        factoryFromElementName(element);
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
