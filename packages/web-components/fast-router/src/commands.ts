import {
    ElementStyles,
    html,
    HTMLView,
    ViewTemplate,
    FASTElementDefinition,
} from "@microsoft/fast-element";
import { RenderOperation, Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { Transition } from "./transition";
import {
    ElementRouteDefinition,
    TemplateRouteDefinition,
    ElementFallbackRouteDefinition,
    TemplateFallbackRouteDefinition,
} from "./routes";
import { Navigation } from "./navigation";
import { RecognizedRoute } from "./recognizer";
import { navigationContributor, NavigationContributor } from "./contributors";
import { NavigationCommitPhase, NavigationPhase } from "./phases";
import { Layout } from "./layout";

export interface NavigationCommand {
    createContributor(
        router: Router,
        route: RecognizedRoute
    ): Promise<NavigationContributor>;
}

export interface RenderCommand extends NavigationCommand {
    layout: Layout;
    transition: Transition;
    createView(): Promise<HTMLView>;
}

export class Ignore implements NavigationCommand {
    public async createContributor() {
        return {
            async navigate(phase: NavigationPhase) {
                phase.cancel();
            },
        };
    }
}

export class Redirect implements NavigationCommand {
    constructor(private redirect: string) {}

    public async createContributor() {
        const path = this.redirect;
        return {
            async navigate(phase: NavigationPhase) {
                phase.cancel(async () => Navigation.replace(path));
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

export class Render implements RenderCommand {
    private _layout: Layout | null = null;
    private _transition: Transition | null = null;

    public title = "";

    constructor(
        private owner: RouterConfiguration,
        public createView: () => Promise<HTMLView>
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
        let createView;

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
            let layout: Layout = {} as any;

            if (definition.layout instanceof ViewTemplate) {
                layout.template = definition.layout;
                layout.styles = null;
            } else {
                let styles = definition.layout.styles;

                layout.template = definition.layout.template || null;
                layout.styles =
                    styles === void 0 || styles === null
                        ? null
                        : Array.isArray(styles)
                        ? ElementStyles.create(styles)
                        : styles instanceof ElementStyles
                        ? styles
                        : ElementStyles.create([styles]);
            }

            command.layout = layout;
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
