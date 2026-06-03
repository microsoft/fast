import { getDefinitionSchemaTransforms } from "../components/definition-schema-transforms.js";
import type {
    FASTElementDefinition,
    FASTElementTemplateResolver,
    TemplateLifecycleCallbacks,
} from "../components/fast-definitions.js";
import { Schema } from "../components/schema.js";
import { FAST } from "../platform.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { Message } from "./interfaces.js";
import { ensureDeclarativeRuntime } from "./runtime.js";
import { declarativeTemplateBridge, type TemplatePublisher } from "./template-bridge.js";
import { TemplateParser } from "./template-parser.js";
import { transformInnerHTML } from "./utilities.js";

const templateElementName = "f-template";

const ensuredTemplateElements = new WeakMap<CustomElementRegistry, Promise<void>>();

type FTemplateElementConstructor = CustomElementConstructor & {
    new (): FTemplateElement;
};

type MutableFASTElementDefinition = FASTElementDefinition & {
    lifecycleCallbacks?: TemplateLifecycleCallbacks;
};

/**
 * Resolves a string, or a promise for a string, containing an `<f-template>`
 * element for a declarative template callback.
 *
 * The resolved string must contain exactly one `<f-template>` element.
 * Attributes on the `<f-template>` are preserved, and the `<f-template>` must
 * contain exactly one child `<template>` element. The returned promise settles
 * when string resolution and template creation complete.
 * @public
 */
export type DeclarativeTemplateStringResolver = (
    templateString: string | Promise<string>,
) => Promise<void>;

/**
 * Context provided to a declarative template callback.
 * @public
 */
export interface DeclarativeTemplateCallbackContext {
    /**
     * The FAST element definition whose template is being resolved.
     */
    readonly definition: FASTElementDefinition;

    /**
     * Resolves a string containing an `<f-template>` element into the template
     * for the current definition.
     */
    readonly templateStringResolver: DeclarativeTemplateStringResolver;
}

/**
 * Callback invoked while resolving a declarative template.
 *
 * The callback may complete asynchronously after dynamic imports, fetches, or
 * other async template-loading work. It must return or await the promise from
 * `templateStringResolver()`. If the callback completes successfully without
 * calling `templateStringResolver()`, template resolution rejects.
 * @public
 */
export type DeclarativeTemplateCallback = (
    context: DeclarativeTemplateCallbackContext,
) => void | Promise<void>;

/**
 * Options for `declarativeTemplate()`.
 * @public
 */
export interface DeclarativeTemplateOptions extends TemplateLifecycleCallbacks {
    /**
     * Optional callback used to resolve an `<f-template>` from a string instead
     * of a connected `<f-template>` element in the DOM.
     */
    readonly callback?: DeclarativeTemplateCallback;
}

function isTemplateElementConstructor(
    value: CustomElementConstructor | undefined,
): value is FTemplateElementConstructor {
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

function createTemplateElementFromString(
    templateString: string,
    registry: CustomElementRegistry,
    name: string,
): FTemplateElement {
    const container = document.createElement("template");
    container.innerHTML = templateString;

    const fragment = document.createDocumentFragment();
    fragment.append(container.content);

    const [source, ...additionalTemplates] = Array.from(
        fragment.querySelectorAll(templateElementName),
    );

    if (source === void 0 || additionalTemplates.length > 0) {
        throw FAST.error(Message.invalidTemplateString, { name });
    }

    const TemplateElement = registry.get(templateElementName);

    if (!isTemplateElementConstructor(TemplateElement)) {
        throw new Error(
            "The <f-template> element must be defined before resolving a template string.",
        );
    }

    const templateElement = new TemplateElement();

    for (const attribute of Array.from(source.attributes)) {
        templateElement.setAttribute(attribute.name, attribute.value);
    }

    templateElement.append(...Array.from(source.childNodes));

    return templateElement;
}

class TemplateStringPublisher implements TemplatePublisher {
    public constructor(private readonly callback: DeclarativeTemplateCallback) {}

    public publishTemplate(
        definition: FASTElementDefinition,
    ): Promise<ElementViewTemplate> {
        return new Promise((resolve, reject) => {
            let settled = false;
            let resolverCalled = false;
            let resolverCompletion: Promise<void> | undefined;

            const rejectTemplate = (error: unknown): void => {
                if (settled) {
                    return;
                }

                settled = true;
                reject(error);
            };

            const resolveTemplate = (template: ElementViewTemplate): void => {
                if (settled) {
                    return;
                }

                settled = true;
                resolve(template);
            };

            const templateStringResolver: DeclarativeTemplateStringResolver =
                templateString => {
                    if (settled) {
                        return Promise.resolve();
                    }

                    if (resolverCompletion) {
                        return resolverCompletion;
                    }

                    resolverCalled = true;

                    const templatePromise = Promise.resolve(templateString).then(
                        resolvedTemplateString => {
                            const templateElement = createTemplateElementFromString(
                                resolvedTemplateString,
                                definition.registry,
                                definition.name,
                            );

                            return templateElement.publishTemplate(definition);
                        },
                    );

                    templatePromise.then(resolveTemplate, rejectTemplate);

                    resolverCompletion = templatePromise.then(() => void 0);
                    resolverCompletion.catch(() => {});

                    return resolverCompletion;
                };

            Promise.resolve()
                .then(() =>
                    this.callback({
                        definition,
                        templateStringResolver,
                    }),
                )
                .then(
                    () => {
                        if (!resolverCalled) {
                            rejectTemplate(
                                FAST.error(Message.templateStringResolverNotCalled, {
                                    name: definition.name,
                                }),
                            );
                        }
                    },
                    error => {
                        if (!resolverCalled) {
                            rejectTemplate(error);
                        }
                    },
                );
        });
    }
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
): FASTElementTemplateResolver;
/**
 * Returns a declarative template resolver that waits for the matching
 * `<f-template>` element, or an `<f-template>` string supplied through
 * `options.callback`, and resolves it into a concrete `ViewTemplate`.
 *
 * @param options - Optional per-element lifecycle callbacks and template
 * callback.
 * @public
 */
export function declarativeTemplate(
    options?: DeclarativeTemplateOptions,
): FASTElementTemplateResolver;
export function declarativeTemplate(
    options?: DeclarativeTemplateOptions,
): FASTElementTemplateResolver {
    ensureDeclarativeRuntime();

    return async definition => {
        if (options) {
            const existing = definition.lifecycleCallbacks;
            (definition as MutableFASTElementDefinition).lifecycleCallbacks = {
                elementDidRegister: chainLifecycleCallback(
                    existing?.elementDidRegister,
                    options.elementDidRegister,
                ),
                templateWillUpdate: chainLifecycleCallback(
                    existing?.templateWillUpdate,
                    options.templateWillUpdate,
                ),
                templateDidUpdate: chainLifecycleCallback(
                    existing?.templateDidUpdate,
                    options.templateDidUpdate,
                ),
                elementDidDefine: chainLifecycleCallback(
                    existing?.elementDidDefine,
                    options.elementDidDefine,
                ),
                elementWillHydrate: chainLifecycleCallback(
                    existing?.elementWillHydrate,
                    options.elementWillHydrate,
                ),
                elementDidHydrate: chainLifecycleCallback(
                    existing?.elementDidHydrate,
                    options.elementDidHydrate,
                ),
            };
        }

        await ensureTemplateElementDefined(definition.registry);

        if (options?.callback) {
            const publisher = new TemplateStringPublisher(options.callback);
            declarativeTemplateBridge.registerPublisher(
                definition.registry,
                definition.name,
                publisher,
            );

            try {
                return await declarativeTemplateBridge.requestTemplate(definition);
            } finally {
                declarativeTemplateBridge.unregisterPublisher(
                    definition.registry,
                    definition.name,
                    publisher,
                );
            }
        }

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
        const templates = Array.from(this.children).filter(
            (child): child is HTMLTemplateElement => child.tagName === "TEMPLATE",
        );

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

        const schema = definition.schema ?? new Schema(name);
        definition.schema = schema;
        const innerHTML = transformInnerHTML(this.innerHTML);
        const parser = new TemplateParser();
        const { strings, values } = parser.parse(innerHTML, schema);

        for (const transform of getDefinitionSchemaTransforms(definition)) {
            transform({ definition, schema });
        }

        return parser.createTemplate(strings, values);
    }
}
