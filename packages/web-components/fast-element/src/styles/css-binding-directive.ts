import type { Binding, BindingSource } from "../observation/binding.js";
import type { Subscriber } from "../observation/notifier.js";
import type { ExpressionObserver } from "../observation/observable.js";
import { AddBehavior, CSSDirective } from "./css-directive.js";
import type { ComposableStyles } from "./element-styles.js";
import type { HostBehavior, HostController } from "./host.js";

/**
 * Enables bindings in CSS.
 *
 * @public
 */
export class CSSBindingDirective implements HostBehavior, Subscriber, CSSDirective, BindingSource {
  /**
   * Creates an instance of CSSBindingDirective.
   * @param dataBinding - The binding to use in CSS.
   * @param targetAspect - The CSS property to target.
   */
    public constructor(
      public readonly dataBinding: Binding,
      public readonly targetAspect: string
    ) {}

    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS(add: AddBehavior): ComposableStyles {
      add(this);
      return `var(${this.targetAspect})`;
    }

    /**
     * Executed when this behavior's host is connected.
     * @param controller - Controls the behavior lifecycle.
     */
    connectedCallback(controller: HostController): void {
      const observer: ExpressionObserver =
        (controller as any)[this.targetAspect] ??
        ((controller as any)[this.targetAspect] = this.dataBinding.createObserver(this, this));

      (observer as any).controller = controller;

      this.handleChange(null, observer);
    }

    /**
     * Called when a subject this instance has subscribed to changes.
     * @param subject - The subject of the change.
     * @param args - The event args detailing the change that occurred.
     *
     * @internal
     */
    handleChange(_: any, observer: ExpressionObserver): void {
      const controller = (observer as any).controller;
      (controller.source as HTMLElement).style
        .setProperty(this.targetAspect, observer.bind(controller));
    }
  }

  CSSDirective.define(CSSBindingDirective);
