import { oneTime } from "../binding/one-time.js";
import { getDefinitionSchemaTransforms } from "../components/definition-schema-transforms.js";
import type {
    FASTElementDefinition,
    FASTElementTemplateResolver,
} from "../components/fast-definitions.js";
import { Schema } from "../components/schema.js";
import type { Constructable } from "../interfaces.js";
import { FAST } from "../platform.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { Message } from "./interfaces.js";
import { ensureDeclarativeRuntime } from "./runtime.js";
import { applyShadowOptions } from "./shadow.js";
import { attributeDirectivePrefix } from "./syntax.js";
import { declarativeTemplateBridge, type TemplatePublisher } from "./template-bridge.js";
import { TemplateParser } from "./template-parser.js";
import { escapeBracesInCodeElements, transformInnerHTML } from "./utilities.js";

const templateElementName = "f-template";

const ensuredTemplateElements = new WeakMap<CustomElementRegistry, Promise<void>>();

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

/**
 * Returns a declarative template resolver that waits for the matching
 * `<f-template>` element and resolves it into a concrete `ViewTemplate`.
 *
 * @public
 */
export function declarativeTemplate<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>,
>(): FASTElementTemplateResolver<TType> {
    ensureDeclarativeRuntime();

    return async definition => {
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

        const hosts = Array.from(this.children).filter(
            child => child.tagName === "F-HOST",
        );

        if (hosts.length > 1) {
            throw FAST.error(Message.moreThanOneHostProvided, { name });
        }

        applyShadowOptions(this, templates[0], definition);

        const schema = definition.schema ?? new Schema(name);
        definition.schema = schema;
        const template = templates[0].cloneNode(true) as HTMLTemplateElement;

        for (const attribute of Array.from(template.attributes)) {
            template.removeAttributeNode(attribute);
        }

        const defaults: Array<{ name: string; value: string }> = [];

        for (const attribute of Array.from(hosts[0]?.attributes ?? [])) {
            if (
                !attribute.value.includes("{") &&
                !attribute.name.startsWith(attributeDirectivePrefix) &&
                !/^[?:@]/.test(attribute.name)
            ) {
                defaults.push({ name: attribute.name, value: attribute.value });
            } else {
                template.setAttributeNode(attribute.cloneNode() as Attr);
            }
        }

        const innerHTML = transformInnerHTML(
            escapeBracesInCodeElements(template.outerHTML),
        );
        const parser = new TemplateParser();
        const { strings, values } = parser.parse(innerHTML, schema);

        // Static declarations are defaults, not replacements for authored attributes.
        if (defaults.length > 0) {
            const hostStrings = ["<template"];
            const hostValues = defaults.map(attribute => {
                hostStrings[hostStrings.length - 1] += ` ${attribute.name}="`;
                hostStrings.push('"');
                return oneTime<HTMLElement>(
                    host => host.getAttribute(attribute.name) ?? attribute.value,
                );
            });
            hostStrings[hostStrings.length - 1] += strings[0].slice("<template".length);
            strings.splice(0, 1, ...hostStrings);
            values.unshift(...hostValues);
        }

        for (const transform of getDefinitionSchemaTransforms(definition)) {
            transform({ definition, schema });
        }

        return parser.createTemplate(strings, values);
    }
}
