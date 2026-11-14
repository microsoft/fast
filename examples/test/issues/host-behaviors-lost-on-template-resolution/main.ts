import { FASTElementDefinition } from "@microsoft/fast-element";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { html } from "@microsoft/fast-element/html.js";

const template = html`
    <span>Template ready</span>
`;

async function createDemo(prefix: string, templateReady: boolean) {
    let connected = 0;
    let disconnected = 0;
    const connectedOutput = document.querySelector<HTMLOutputElement>(
        `#${prefix}-connected`,
    )!;
    const disconnectedOutput = document.querySelector<HTMLOutputElement>(
        `#${prefix}-disconnected`,
    )!;

    class BehaviorDemo extends FASTElement {
        constructor() {
            super();
            this.$fastController.addBehavior({
                connectedCallback() {
                    connectedOutput.value = String(++connected);
                },
                disconnectedCallback() {
                    disconnectedOutput.value = String(++disconnected);
                },
            });
        }
    }

    const definition = await FASTElementDefinition.compose(BehaviorDemo, {
        name: `${prefix}-behavior-demo`,
        template: templateReady ? template : undefined,
    });
    definition.define();

    const element = document.createElement(definition.name);
    const host = document.querySelector<HTMLDivElement>(`#${prefix}-host`)!;
    const detach = document.querySelector<HTMLButtonElement>(`#${prefix}-detach`)!;
    const reconnect = document.querySelector<HTMLButtonElement>(`#${prefix}-reconnect`)!;
    host.append(element);

    detach.addEventListener("click", () => {
        element.remove();
        detach.disabled = true;
        reconnect.disabled = false;
    });
    reconnect.addEventListener("click", () => {
        host.append(element);
        detach.disabled = false;
        reconnect.disabled = true;
    });
    detach.disabled = false;

    return definition;
}

await createDemo("ready", true);
const pendingDefinition = await createDemo("pending", false);
const resolveTemplate = document.querySelector<HTMLButtonElement>("#resolve-template")!;
resolveTemplate.addEventListener("click", () => {
    pendingDefinition.template = template;
    resolveTemplate.disabled = true;
});
resolveTemplate.disabled = false;
