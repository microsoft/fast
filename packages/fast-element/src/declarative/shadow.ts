import type { FASTElementDefinition } from "../components/fast-definitions.js";
import { FAST } from "../platform.js";
import { Message } from "./interfaces.js";

const shadowAttributes = ["mode", "delegatesfocus", "clonable", "serializable"];

export function applyShadowOptions(
    publisher: HTMLElement,
    template: HTMLTemplateElement,
    definition: FASTElementDefinition,
): void {
    const declarations = Array.from(publisher.children).filter(
        child => child.tagName === "F-SHADOW",
    );
    const name = definition.name;

    if (declarations.length > 1) {
        throw FAST.error(Message.moreThanOneShadowProvided, { name });
    }

    const declaration = declarations[0];
    if (declaration) {
        for (const attribute of Array.from(declaration.attributes)) {
            if (
                !shadowAttributes.includes(attribute.name) ||
                /[{}]/.test(attribute.value)
            ) {
                throw FAST.error(Message.invalidShadowConfiguration, {
                    name,
                    reason: `Unsupported or non-static attribute '${attribute.name}'.`,
                });
            }
        }
        const mode = declaration.getAttribute("mode") ?? "open";
        if (mode !== "open" && mode !== "closed") {
            throw FAST.error(Message.invalidShadowConfiguration, {
                name,
                reason: "The mode must be 'open' or 'closed'.",
            });
        }
        definition.shadowOptions = {
            ...definition.shadowOptions,
            mode,
            delegatesFocus: declaration.hasAttribute("delegatesfocus"),
            clonable: declaration.hasAttribute("clonable"),
            serializable: declaration.hasAttribute("serializable"),
        };
        return;
    }

    // TODO(#7800): Remove legacy outer/inner template shadowroot configuration in vNext.
    const attributes = new Map<string, string>();
    for (const element of [template, publisher]) {
        const hasMode = attributes.has("shadowrootmode") || attributes.has("shadowroot");
        for (const attribute of Array.from(element.attributes)) {
            if (
                attribute.name.startsWith("shadowroot") &&
                !attributes.has(attribute.name) &&
                !(hasMode && /^(shadowrootmode|shadowroot)$/.test(attribute.name))
            ) {
                attributes.set(attribute.name, attribute.value);
            }
        }
    }
    if (attributes.size === 0) {
        return;
    }
    const mode =
        attributes.get("shadowrootmode") || attributes.get("shadowroot") || "open";
    if (mode !== "open" && mode !== "closed") {
        throw FAST.error(Message.invalidShadowConfiguration, {
            name,
            reason: "The mode must be 'open' or 'closed'.",
        });
    }
    definition.shadowOptions = {
        ...definition.shadowOptions,
        mode,
        ...(attributes.has("shadowrootdelegatesfocus") && { delegatesFocus: true }),
        ...(attributes.has("shadowrootclonable") && { clonable: true }),
        ...(attributes.has("shadowrootserializable") && { serializable: true }),
    };
}
