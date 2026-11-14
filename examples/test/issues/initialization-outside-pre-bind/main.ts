import type { HostBehavior } from "@microsoft/fast-element";
import { FASTElement, html, Observable, Updates } from "@microsoft/fast-element";

export class WitnessElement extends FASTElement {
    declare input: string;
    declare display: string;

    constructor() {
        super();
        this.input = "DEFAULT";
        this.display = "Derived: DEFAULT";
    }

    derive(): void {
        this.display = `Derived: ${this.input}`;
    }

    connectedCallback(): void {
        super.connectedCallback();

        // Sample the actual bound DOM before the caller can perform late derivation.
        const rendered = this.shadowRoot!.querySelector(".display")!;
        const witness = this.closest("section")!.querySelector(".first-output")!;
        if (!witness.hasAttribute("data-captured")) {
            witness.textContent = rendered.textContent;
            witness.setAttribute("data-captured", "");
        }
    }
}

Observable.defineProperty(WitnessElement.prototype, "input");
Observable.defineProperty(WitnessElement.prototype, "display");

export class BeforeReplayElement extends WitnessElement {
    connectedCallback(): void {
        this.derive();
        super.connectedCallback();
    }
}

export class AfterBindElement extends WitnessElement {
    connectedCallback(): void {
        super.connectedCallback();
        this.derive();
    }
}

const initializeBeforeBinding: HostBehavior<PreBindElement> = {
    connectedCallback(controller) {
        controller.source.derive();
    },
};

export class PreBindElement extends WitnessElement {
    constructor() {
        super();
        this.$fastController.addBehavior(initializeBeforeBinding);
    }
}

const template = html<WitnessElement>`
    <p>Live bound output: <span class="display">${x => x.display}</span></p>
`;

const variants = [
    { id: "before-replay", name: "ordering-before-replay", type: BeforeReplayElement },
    { id: "after-bind", name: "ordering-after-bind", type: AfterBindElement },
    { id: "pre-bind", name: "ordering-pre-bind", type: PreBindElement },
] as const;

const button = document.querySelector<HTMLButtonElement>("#run")!;
button.addEventListener(
    "click",
    async () => {
        button.disabled = true;
        const hosts = variants.map(variant => {
            const host = document.createElement(variant.name) as WitnessElement;
            host.input = "SUPPLIED";
            document.querySelector(`#${variant.id} .host`)!.append(host);
            return host;
        });

        for (const variant of variants) {
            await FASTElement.define(variant.type, { name: variant.name, template });
        }

        // Only the live output is allowed to settle; first-output witnesses never change.
        await Updates.next();
        hosts.forEach(host => {
            host.closest("section")!.querySelector(".restored-input")!.textContent =
                host.input;
        });
        document.querySelector("#status")!.textContent = "Upgrade complete";
    },
    { once: true },
);
