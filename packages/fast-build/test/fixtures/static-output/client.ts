import { enableHydration } from "../../../../fast-element/src/components/enable-hydration.js";
import { FASTElement } from "../../../../fast-element/src/components/fast-element.js";
import { Observable } from "../../../../fast-element/src/observation/observable.js";
import { Updates } from "../../../../fast-element/src/observation/update-queue.js";
import { repeat } from "../../../../fast-element/src/templating/repeat.js";
import { html } from "../../../../fast-element/src/templating/template.js";
import { when } from "../../../../fast-element/src/templating/when.js";

export async function qualify(state: { label: string; show: boolean; items: string[] }) {
    const card = document.querySelector("qualified-card") as Card;
    const root = card.shadowRoot!;
    const nested = root.querySelector("qualified-nested")!;
    const originals = [...root.querySelectorAll("*")];
    const heading = root.querySelector("h2")!;
    const boundText = heading.childNodes[1];
    const repeated = [...root.querySelectorAll("b")];
    const nestedStrong = nested.shadowRoot!.querySelector("strong");
    const scope = root.querySelector<HTMLTemplateElement>("#scope")!;
    const scopeChild = scope.content.firstChild;
    const pre = root.querySelector("pre")!;
    const textarea = root.querySelector("textarea")!;
    const inline = root.querySelector(".inline")!;
    const spans = [...inline.querySelectorAll("span")];
    const whitespaceNodes = [
        pre.firstChild!,
        textarea.firstChild!,
        inline.childNodes[1],
        inline.childNodes[3],
        scopeChild!.firstChild!,
    ].map(node => ({ node, parent: node.parentNode }));
    const snapshot = {
        text: root.textContent,
        pre: pre.textContent,
        textarea: textarea.value,
        inline: inline.textContent,
        scope: scope.content.textContent,
        role: card.getAttribute("role"),
        title: card.getAttribute("title"),
        boundTitle: heading.getAttribute("title"),
        delegatesFocus: root.delegatesFocus,
        clonable: root.clonable,
        serializable: root.serializable,
        layout: spans.map(span => {
            const bounds = span.getBoundingClientRect();
            return [bounds.x, bounds.y, bounds.width, bounds.height];
        }),
    };
    const closed: {
        publicRoot: ShadowRoot | null;
        mode: ShadowRootMode;
        delegatesFocus: boolean;
        text: string | null;
    }[] = [];
    for (const name of ["qualified-closed", "qualified-conflict", "qualified-legacy"]) {
        class ClosedProbe extends HTMLElement {
            readonly internals = this.attachInternals();
        }
        customElements.define(name, ClosedProbe);
        const element = document.querySelector(name) as ClosedProbe;
        const shadow = element.internals.shadowRoot!;
        closed.push({
            publicRoot: element.shadowRoot,
            mode: shadow.mode,
            delegatesFocus: shadow.delegatesFocus,
            text: shadow.textContent,
        });
    }

    enableHydration();
    class Nested extends FASTElement {
        label = state.label;
    }
    Observable.defineProperty(Nested.prototype, "label");
    class Card extends FASTElement {
        label = state.label;
        show = state.show;
        items = state.items;
    }
    for (const name of ["label", "show", "items"]) {
        Observable.defineProperty(Card.prototype, name);
    }
    await Nested.define({
        name: "qualified-nested",
        template: html<Nested>`<strong>${x => x.label}</strong>`,
    });
    await Card.define({
        name: "qualified-card",
        template: html<Card>`<style>:host{display:block}.inline{font:16px monospace;white-space:pre}</style><pre>  first
	second &amp; &lt; 
</pre><div class="inline"><span>A</span> <span>B</span>
<span>C</span></div><textarea>  first
	second &amp; &lt; 
</textarea><h2 title="${x => x.label}">${x => x.label}</h2>${when(
            x => x.show,
            html<Card>`<i>${x => x.label}</i>`,
        )}${repeat(x => x.items, html<string>`<b>${x => x}</b>`)}<qualified-nested :label="${x => x.label}"></qualified-nested><slot>fallback</slot><template id="scope"><span>  scoped
 text </span></template>`,
    });
    const hydrated = await card.$fastController.isHydrated;
    await Updates.next();
    const identity = {
        elements: originals.every(
            (node, index) => root.querySelectorAll("*")[index] === node,
        ),
        text: [...heading.childNodes].includes(boundText),
        nested: nested.shadowRoot!.querySelector("strong") === nestedStrong,
        scope: scope.content.firstChild === scopeChild,
        repeat: repeated.every(
            (node, index) => root.querySelectorAll("b")[index] === node,
        ),
        whitespace: whitespaceNodes.every(
            ({ node, parent }) => node.parentNode === parent,
        ),
    };
    card.label = "updated & < 😄";
    card.show = false;
    card.items = ["one", "two", "three"];
    await Updates.next();
    await Updates.next();
    return {
        snapshot,
        closed,
        hydrated,
        identity,
        updated: {
            heading: heading.textContent,
            title: heading.getAttribute("title"),
            nested: nested.shadowRoot!.textContent,
            conditional: root.querySelector("i") === null,
            repeat: [...root.querySelectorAll("b")].map(node => node.textContent),
            pre: pre.textContent,
            textarea: textarea.value,
            inline: inline.textContent,
            scope: scope.content.textContent,
            textIdentity: [...heading.childNodes].includes(boundText),
        },
    };
}
