import {
    Mutable,
    ElementStyles,
    html,
    HTMLView,
    ViewTemplate,
    FASTElementDefinition,
    defaultExecutionContext,
    FASTElement,
    DOM,
} from "@microsoft/fast-element";
import { navigationParticipant } from "./participants";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { Transition } from "./transition";
import {
    Layout,
    LayoutAndTransitionRouteDefinition,
    HasElement,
    HasTemplate,
} from "./routes";
import { Navigation } from "./navigation";
import { NavigationContributor, NavigationPhase } from "./navigation-process";
import { RecognizedRoute } from "./recognizer";

export interface NavigationCommand {
    createContributor(
        router: Router,
        route: RecognizedRoute
    ): Promise<NavigationContributor>;
}

export class Ignore implements NavigationCommand {
    public async createContributor() {
        return {
            async tryNavigate(phase: NavigationPhase) {
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
            async tryNavigate(phase: NavigationPhase) {
                phase.cancel(async () => Navigation.replace(path));
            },
        };
    }
}

function factoryFromElementName(name: string) {
    return html`<${name} ${navigationParticipant()}></${name}>`;
}

type ViewFactory = { create(): HTMLView };

function factoryFromElementInstance(element: HTMLElement): ViewFactory {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(element);
    const view = new HTMLView(fragment, []);
    return {
        create() {
            return view;
        },
    };
}

class RenderContributor {
    private currentView: HTMLView | null;
    private newView: HTMLView | null = null;

    constructor(
        private router: Router,
        private route: RecognizedRoute,
        private command: Render
    ) {
        this.currentView = router.view;
    }

    async construct() {
        const viewModel = this.route.params;
        this.newView = await this.command.createView();

        if (this.newView) {
            this.newView.appendTo(this.router);
            this.newView.bind(viewModel, defaultExecutionContext);
        }
    }

    async commit() {
        const router = this.router;
        const command = this.command;

        if (router.$fastController.template !== command.layout.template) {
            if (this.currentView !== null) {
                this.currentView.dispose();
                this.currentView = null;
            }

            router.$fastController.template = command.layout.template!;
        }

        if (router.$fastController.styles !== command.layout.styles) {
            router.$fastController.styles = command.layout.styles!;
        }

        await command.transition(this.router, this.currentView, this.newView!);

        (router as Mutable<Router>).view = this.newView!;
        (router as Mutable<Router>).route = this.route;
        (router as Mutable<Router>).command = command;
    }

    async rollback() {
        if (this.newView) {
            this.newView.dispose();
        }
    }
}

export class Render implements NavigationCommand {
    private _layout: Layout | null = null;
    private _transition: Transition | null = null;

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
        definition: LayoutAndTransitionRouteDefinition & (HasElement | HasTemplate)
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
                    styles === void 0
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

        return command;
    }
}
