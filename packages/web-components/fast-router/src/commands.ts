import { Mutable, ElementStyles, html, HTMLView, ViewTemplate, FASTElementDefinition, defaultExecutionContext, FASTElement } from "@microsoft/fast-element";
import { navigationParticipant } from "./participants";
import { NavigationTransaction } from "./transaction";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { Transition } from "./transition";
import { Layout, LayoutAndTransitionRouteDefinition, HasElement, HasTemplate } from './routes';
import { Navigation } from './navigation';

export interface NavigationCommand {
  execute(transaction: NavigationTransaction): Promise<void>;
}

export class Ignore implements NavigationCommand {
  public async execute(transaction: NavigationTransaction): Promise<void> { }
}

export class Redirect implements NavigationCommand {
  constructor(private redirect: string) {}

  public async execute(transaction: NavigationTransaction): Promise<void> {
    // TODO: generate new route based on redirect and route params
    Navigation.replace(this.redirect);
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
    }
  };
}

export class Render implements NavigationCommand {
  private _layout: Layout | null = null;
  private _transition: Transition | null = null;

  constructor(
    private owner: RouterConfiguration, 
    private createView: () => Promise<HTMLView>
  ) { }

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

  public async execute(transaction: NavigationTransaction): Promise<void> {
    const router = transaction.owner;

    if (router.command === this) {
      // TODO: if the command is the same, defer to a strategy
      // strategy should determine whether or not to re-create the view
      // or to just update the params
      return;
    }

    if (!await transaction.tryLeave()) {
      return;
    }

    const viewModel = transaction.route.params;
    const newView = await this.createView();
    let currentView = router.view;

    if (newView) {
      // router.beginEnter(this);

      // hide new view
      newView.appendTo(router);
      newView.bind(viewModel, defaultExecutionContext);

      // router.tunnelTransaction(this); // process child routers

      if (!await transaction.tryEnter()) {
        newView.dispose();
        // router.rejectEnter(this);
        return;
      }

      // router.commitEnter(this);

      if (router.$fastController.template !== this.layout.template) {
        if (currentView !== null) {
          currentView.dispose();
          currentView = null;
        }
  
        router.$fastController.template = this.layout.template!;
      }
  
      if (router.$fastController.styles !== this.layout.styles) {
        router.$fastController.styles = this.layout.styles!;
      }
  
      console.log("enter");

      await this.transition(router, currentView, newView);

      (transaction.owner as Mutable<Router>).view = newView;
      (transaction.owner as Mutable<Router>).route = transaction.route;
      (transaction.owner as Mutable<Router>).command = transaction.command;
    }
  }

  public static fromDefinition(
    owner: RouterConfiguration,
    definition: LayoutAndTransitionRouteDefinition & (HasElement | HasTemplate)
  ): Render {
    let createView;

    if ('template' in definition) {
      createView = async () => {
          let template = definition.template;

          if (typeof template === 'function') {
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
        } else if (typeof element === 'function') {
          // Do not cache it becase the function could return
          // a different value each time.
          let def = FASTElementDefinition.forType(element);

          if (def) {
            factory = factoryFromElementName(def.name);
          } else {
            element = await (element as Function)();

            if (typeof element === 'string') {
              factory = factoryFromElementName(element);
            } else if (element instanceof HTMLElement) {
              factory = factoryFromElementInstance(element);
            } else {
              def = FASTElementDefinition.forType(element as any);

              if (def) {
                factory = factoryFromElementName(def.name);
              } else {
                throw new Error('Invalid value for element in route config.');
              }
            }
          }
        } else if (element instanceof HTMLElement) {
          (definition as any).factory = factory = factoryFromElementInstance(element);
        } else {
          (definition as any).factory = factory = factoryFromElementName(element);
        }
        
        return factory.create();
      }
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
        layout.styles = styles === void 0
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