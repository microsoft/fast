import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { Aspect, ExecutionContext, DOM, FASTElement } from "@microsoft/fast-element";
import { TemplateRenderer } from "../template-renderer/template-renderer.js";
import { SSRView } from "../view.js";
import { StyleRenderer } from "../styles/style-renderer.js";

const prefix = "fast-style";
let id = 0;
function nextId(): string {
    return `${prefix}-${id++}`;
}

export abstract class FASTElementRenderer extends ElementRenderer {
    /**
     * The element instance represented by the {@link FASTElementRenderer}.
     */
    public readonly element!: FASTElement;

    /**
     * The template renderer to use when rendering a component template
     */
    protected abstract templateRenderer: TemplateRenderer;

    /**
     * Responsible for rendering stylesheets
     */
    protected abstract styleRenderer: StyleRenderer;

    /**
     * Tests a constructor to determine if it should be managed by a {@link FASTElementRenderer}.
     * @param ctor - The constructor to test.
     */
    public static matchesClass(ctor: typeof HTMLElement): boolean {
        return ctor.prototype instanceof FASTElement;
    }

    /**
     * Indicate to the {@link FASTElementRenderer} that the instance should execute DOM connection behavior.
     */
    public connectedCallback(): void {
        this.element.connectedCallback();
        const view = this.element.$fastController.view;

        if (view && SSRView.isSSRView(view)) {
            if (view.hostStaticAttributes) {
                view.hostStaticAttributes.forEach((value, key) => {
                    this.element.setAttribute(key, value);
                });
            }

            if (view.hostDynamicAttributes) {
                for (const attr of view.hostDynamicAttributes) {
                    const result = attr.binding(this.element, ExecutionContext.default);

                    const { target } = attr;
                    switch (attr.aspect) {
                        case Aspect.property:
                            (this.element as any)[target] = result;
                            break;
                        case Aspect.attribute:
                            DOM.setAttribute(this.element, target, result);
                            break;
                        case Aspect.booleanAttribute:
                            DOM.setBooleanAttribute(this.element, target, result);
                            break;
                    }
                }
            }
        }
    }

    /**
     * Indicate to the {@link FASTElementRenderer} that an attribute has been changed.
     * @param name - The name of the changed attribute
     * @param old - The old attribute value
     * @param value - The new attribute value
     */
    public attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
    ): void {
        this.element.attributeChangedCallback(name, old, value);
    }

    /**
     * Constructs a new {@link FASTElementRenderer}.
     * @param tagName - the tag-name of the element to create.
     */
    constructor(tagName: string) {
        super(tagName);

        const ctor: typeof FASTElement | null = customElements.get(this.tagName);

        if (ctor) {
            this.element = new ctor();
        } else {
            throw new Error(
                `FASTElementRenderer was unable to find a constructor for a custom element with the tag name '${tagName}'.`
            );
        }
    }

    /**
     * Renders the component internals to light DOM instead of shadow DOM.
     * @param renderInfo - information about the current rendering context.
     */
    public *renderLight(renderInfo: RenderInfo): IterableIterator<string> {
        // TODO - this will yield out the element's template using the template renderer, skipping any shadow-DOM specific emission.
        yield "";
    }

    /**
     * Render the component internals to shadow DOM.
     * @param renderInfo - information about the current rendering context.
     */
    public *renderShadow(renderInfo: RenderInfo): IterableIterator<string> {
        const view = this.element.$fastController.view;
        const styles = this.element.$fastController.styles;

        if (styles) {
            yield this.styleRenderer.render(styles);
        }

        if (view !== null) {
            yield* this.templateRenderer.renderOpCodes(
                ((view as unknown) as SSRView).codes,
                renderInfo,
                this.element,
                ExecutionContext.default
            );
        }
    }
}
