import {
    DOM,
    DOMAspect,
    ExecutionContext,
    FASTElement,
    FASTElementDefinition,
    HostController,
    Observable,
    observable,
} from "@microsoft/fast-element";
import { PendingTaskEvent } from "@microsoft/fast-element/pending-task.js";
import { RenderInfo } from "../render-info.js";
import { StyleRenderer } from "../styles/style-renderer.js";
import { FASTSSRStyleStrategy } from "../styles/style-strategy.js";
import { DefaultTemplateRenderer } from "../template-renderer/template-renderer.js";
import { SSRView } from "../view.js";
import { DefaultElementRenderer, renderAttribute } from "./element-renderer.js";
import { AsyncElementRenderer, AttributesMap, ElementRenderer } from "./interfaces.js";

/**
 * Sinks to apply aspect operations to an element
 */
const sinks: Record<number, (el: any, name: any, value: any) => void> = {
    [DOMAspect.property]: (el: any, name: string, value: any) => {
        el[name] = value;
    },
    [DOMAspect.attribute]: DOM.setAttribute,
    [DOMAspect.booleanAttribute]: DOM.setBooleanAttribute,
};

/**
 * An {@link ElementRenderer} implementation designed to render components
 * built with FAST.
 *
 */
abstract class FASTElementRenderer extends DefaultElementRenderer {
    /**
     * The element instance represented by the {@link FASTElementRenderer}.
     */
    public readonly element!: FASTElement;

    /**
     * The custom element constructor
     */
    public readonly ctor: CustomElementConstructor;

    /**
     * A function that decies if given tagName should defer hydration.
     * When true, instructs the ElementRenderer to yield the `defer-hydration` attribute for
     * rendered elements.
     */
    protected abstract deferHydration: (tagName: string) => boolean;

    protected needsHydration: boolean = false;

    /**
     * The template renderer to use when rendering a component template
     */
    @observable
    protected abstract templateRenderer: DefaultTemplateRenderer;
    templateRendererChanged() {
        if (this.templateRenderer) {
            this.needsHydration = this.templateRenderer.emitHydratableMarkup;
        }
    }

    /**
     * Responsible for rendering stylesheets
     */
    protected abstract styleRenderer: StyleRenderer;

    protected attributes: AttributesMap = new Map();

    public static matchesClass(
        ctor: typeof HTMLElement,
        tagName: string,
        attributes: AttributesMap
    ): boolean {
        return ctor.prototype instanceof FASTElement;
    }

    /**
     * Indicate to the {@link FASTElementRenderer} that the instance should execute DOM connection behavior.
     */
    public connectedCallback(): void {
        super.connectedCallback();
        Observable.getNotifier(this.element.$fastController).subscribe(
            this,
            "isConnected"
        );

        try {
            this.element.connectedCallback();
        } catch (e) {
            const { tryRecoverFromErrors } = this.templateRenderer;
            if (tryRecoverFromErrors) {
                this.disableTemplateRendering();

                if (typeof tryRecoverFromErrors === "function") {
                    tryRecoverFromErrors(e);
                }
            } else {
                throw e;
            }
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        Observable.getNotifier(this.element.$fastController).unsubscribe(
            this,
            "isConnected"
        );
        this.element.disconnectedCallback();
    }

    public handleChange(source: HostController, property: "isConnected") {
        if (this.element.$fastController.isConnected) {
            const view = this.element.$fastController.view;

            if (view && SSRView.isSSRView(view)) {
                if (view.hostStaticAttributes) {
                    view.hostStaticAttributes.forEach((value, key) => {
                        this.element.setAttribute(key, value);
                    });
                }

                if (view.hostDynamicAttributes) {
                    for (const attr of view.hostDynamicAttributes) {
                        const aspect = attr.factory.aspectType;
                        if (aspect in sinks && attr.factory.dataBinding) {
                            sinks[aspect](
                                this.element,
                                attr.factory.targetAspect,
                                attr.factory.dataBinding.evaluate(
                                    this.element,
                                    ExecutionContext.default
                                )
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * Disables the rendering of the component's template.
     */
    protected disableTemplateRendering() {
        this.renderShadow = noOpRenderShadow;
        this.yieldAttributes = yieldContextualAttributes;
        this.needsHydration = false;
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

    public setAttribute(name: string, value: string): void {
        super.setAttribute(name, value);
        this.attributes.set(name, value);
    }

    /**
     * Constructs a new {@link FASTElementRenderer}.
     * @param tagName - the tag-name of the element to create.
     */
    constructor(tagName: string, renderInfo: RenderInfo) {
        super(tagName, renderInfo);

        const ctor = customElements.get(this.tagName);

        if (ctor) {
            this.ctor = ctor;
            this.element = new ctor() as FASTElement;
            (this.element as any).tagName = tagName;
        } else {
            throw new Error(
                `FASTElementRenderer was unable to find a constructor for a custom element with the tag name '${tagName}'.`
            );
        }
    }

    /**
     * Yield attributes assigned to the elmeent
     *
     */
    protected *yieldAttributes() {
        const { attributes } = this.element;
        for (
            let i = 0, name, value;
            i < attributes.length && ({ name, value } = attributes[i]);
            i++
        ) {
            yield renderAttribute(name, value, this.element.tagName);
        }
    }

    abstract renderShadow:
        | ((renderInfo: RenderInfo) => IterableIterator<string>)
        | ((renderInfo: RenderInfo) => IterableIterator<string | Promise<void>>);
}

export abstract class SyncFASTElementRenderer
    extends FASTElementRenderer
    implements ElementRenderer
{
    renderAttributes = renderAttributesSync;
    renderShadow = renderShadow;
}
export abstract class AsyncFASTElementRenderer
    extends FASTElementRenderer
    implements AsyncElementRenderer
{
    constructor(tagName: string, renderInfo: RenderInfo) {
        super(tagName, renderInfo);

        this.element.addEventListener(PendingTaskEvent.type, this.pendingTaskHandler);
    }
    public *renderAttributes(
        this: AsyncFASTElementRenderer
    ): IterableIterator<string | Promise<string>> {
        if (this.element !== undefined) {
            if (this.awaiting.size) {
                yield this.pauseRendering()
                    .then(() => "")
                    .catch(reason => {
                        throw reason;
                    });
            }

            yield* renderAttributesSync.call(this);
        }
    }
    renderShadow = renderShadow;

    private async pauseRendering() {
        for (const awaiting of this.awaiting) {
            try {
                await awaiting;
            } catch (e) {
                const { tryRecoverFromErrors } = this.templateRenderer;

                if (tryRecoverFromErrors) {
                    this.disableTemplateRendering();

                    if (typeof tryRecoverFromErrors === "function") {
                        tryRecoverFromErrors(e);
                    }
                } else {
                    throw e;
                }
            }
        }

        this.awaiting.clear();
    }

    private awaiting: Set<Promise<void>> = new Set();

    private pendingTaskHandler = (e: Event) => {
        if (PendingTaskEvent.isPendingTask(e)) {
            this.awaiting.add(e.complete);
        }
    };
}

function* renderAttributesSync(this: FASTElementRenderer): IterableIterator<string> {
    yield* this.yieldAttributes();

    if (this.deferHydration(this.tagName)) {
        yield " defer-hydration";
    }

    if (this.needsHydration) {
        yield " needs-hydration";
    }
}

function* renderShadow(
    this: FASTElementRenderer,
    renderInfo: RenderInfo
): IterableIterator<string> {
    const view = this.element.$fastController.view as unknown as SSRView;
    const styles = FASTSSRStyleStrategy.getStylesFor(this.element);

    const elementDefinition = FASTElementDefinition.getByType(this.ctor);
    const yieldDSD = elementDefinition?.shadowOptions !== undefined;
    const yieldBoundaryMarker =
        elementDefinition && elementDefinition.shadowOptions === undefined && view;

    if (yieldDSD) {
        yield '<template shadowrootmode="open" shadowroot="open">';
    } else if (yieldBoundaryMarker) {
        yield `<!--fe-eb$$start$$${view.codes.id}$$fe-eb-->`;
    }

    if (styles) {
        yield this.styleRenderer.render(styles);
    }

    if (view !== null) {
        yield* this.templateRenderer.renderOpCodes(
            (view as unknown as SSRView).codes,
            renderInfo,
            this.element,
            ExecutionContext.default
        );
    }

    if (yieldDSD) {
        yield "</template>";
    } else if (yieldBoundaryMarker) {
        yield `<!--fe-eb$$end$$${view.codes.id}$$fe-eb-->`;
    }
}

// eslint-disable-next-line
function* noOpRenderShadow() {}
function* yieldContextualAttributes(this: FASTElementRenderer) {
    const { attributes } = this;
    for (const [key, value] of attributes) {
        yield renderAttribute(key, value, this.element.tagName);
    }
}
