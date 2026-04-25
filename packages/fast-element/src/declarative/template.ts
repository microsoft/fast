import type {
    FASTElementDefinition,
    FASTElementTemplateResolver,
    TemplateLifecycleCallbacks,
} from "../components/fast-definitions.js";
import { FAST } from "../platform.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { getDefinitionSchemaTransforms } from "./definition-options.js";
import { Message } from "./interfaces.js";
import { ensureDeclarativeRuntime } from "./runtime.js";
import { Schema } from "./schema.js";
import { declarativeTemplateBridge, type TemplatePublisher } from "./template-bridge.js";
import { TemplateParser } from "./template-parser.js";
import { transformInnerHTML } from "./utilities.js";

const templateElementName = "f-template";

const ensuredTemplateElements = new WeakMap<CustomElementRegistry, Promise<void>>();

type MutableFASTElementDefinition = FASTElementDefinition & {
    lifecycleCallbacks?: TemplateLifecycleCallbacks;
};

function isTemplateElementConstructor(
    value: CustomElementConstructor | undefined,
): boolean {
    return value === FTemplateElement || value?.prototype instanceof FTemplateElement;
}

async function ensureTemplateElementDefined(
    registry: CustomElementRegistry,
): Promise<void> {
    const ensured = ensuredTemplateElements.get(registry);

    if (ensured) {
        return ensured;
    }

    const definitionPromise = Promise.resolve().then(() => {
        const existing = registry.get(templateElementName);

        if (existing !== void 0) {
            if (isTemplateElementConstructor(existing)) {
                return;
            }

            throw new Error(
                "The <f-template> element is already defined in this registry by a different implementation.",
            );
        }

        const RegisteredTemplateElement = class extends FTemplateElement {
            protected get registry(): CustomElementRegistry {
                return registry;
            }
        };

        registry.define(templateElementName, RegisteredTemplateElement);
    });

    const pending = definitionPromise.catch(error => {
        ensuredTemplateElements.delete(registry);
        throw error;
    });

    ensuredTemplateElements.set(registry, pending);

    return pending;
}

function chainLifecycleCallback<TArgs extends unknown[]>(
    first: ((...args: TArgs) => void) | undefined,
    second: ((...args: TArgs) => void) | undefined,
): ((...args: TArgs) => void) | undefined {
    if (!first) {
        return second;
    }

    if (!second) {
        return first;
    }

    return (...args: TArgs) => {
        first(...args);
        second(...args);
    };
}

/**
 * Returns a declarative template resolver that waits for the matching
 * `<f-template>` element and resolves it into a concrete `ViewTemplate`.
 *
 * @param callbacks - Optional per-element lifecycle callbacks.
 * @public
 */
export function declarativeTemplate(
    callbacks?: TemplateLifecycleCallbacks,
): FASTElementTemplateResolver {
    ensureDeclarativeRuntime();

    return async definition => {
        if (callbacks) {
            const existing = definition.lifecycleCallbacks;
            (definition as MutableFASTElementDefinition).lifecycleCallbacks = {
                elementDidRegister: chainLifecycleCallback(
                    existing?.elementDidRegister,
                    callbacks.elementDidRegister,
                ),
                templateWillUpdate: chainLifecycleCallback(
                    existing?.templateWillUpdate,
                    callbacks.templateWillUpdate,
                ),
                templateDidUpdate: chainLifecycleCallback(
                    existing?.templateDidUpdate,
                    callbacks.templateDidUpdate,
                ),
                elementDidDefine: chainLifecycleCallback(
                    existing?.elementDidDefine,
                    callbacks.elementDidDefine,
                ),
                elementWillHydrate: chainLifecycleCallback(
                    existing?.elementWillHydrate,
                    callbacks.elementWillHydrate,
                ),
                elementDidHydrate: chainLifecycleCallback(
                    existing?.elementDidHydrate,
                    callbacks.elementDidHydrate,
                ),
            };
        }

        await ensureTemplateElementDefined(definition.registry);
        return declarativeTemplateBridge.requestTemplate(definition);
    };
}

class FTemplateElement extends HTMLElement implements TemplatePublisher {
    public static readonly observedAttributes = ["name"];

    protected get registry(): CustomElementRegistry {
        return customElements;
    }

    public get name(): string | undefined {
        return this.getAttribute("name") ?? undefined;
    }

    public set name(value: string | undefined) {
        if (value == null) {
            this.removeAttribute("name");
            return;
        }

        this.setAttribute("name", value);
    }

    public connectedCallback(): void {
        declarativeTemplateBridge.registerPublisher(this.registry, this.name, this);
    }

    public disconnectedCallback(): void {
        declarativeTemplateBridge.unregisterPublisher(this.registry, this.name, this);
    }

    public attributeChangedCallback(
        attributeName: string,
        previousName: string | null,
        nextName: string | null,
    ): void {
        if (attributeName !== "name" || !this.isConnected || previousName === nextName) {
            return;
        }

        declarativeTemplateBridge.movePublisher(
            this.registry,
            previousName ?? undefined,
            nextName ?? undefined,
            this,
        );
    }

    public publishTemplate(definition: FASTElementDefinition): ElementViewTemplate {
        ensureDeclarativeRuntime();

        const name = definition.name;
        const templates = this.getElementsByTagName("template");

        if (templates.length > 1) {
            throw FAST.error(Message.moreThanOneTemplateProvided, {
                name,
            });
        }

        if (templates.length === 0) {
            throw FAST.error(Message.noTemplateProvided, { name });
        }

        definition.lifecycleCallbacks?.elementDidRegister?.(name);
        definition.lifecycleCallbacks?.templateWillUpdate?.(name);

        const schema = new Schema(name);
        const innerHTML = transformInnerHTML(this.innerHTML);
        const parser = new TemplateParser();
        const { strings, values } = parser.parse(innerHTML, schema);

        for (const transform of getDefinitionSchemaTransforms(definition)) {
            transform({ definition, schema });
        }

        return parser.createTemplate(strings, values);
    }
}
