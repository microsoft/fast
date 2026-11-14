import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { html } from "@microsoft/fast-element/html.js";
import { Observable } from "@microsoft/fast-element/observable.js";
import { Updates } from "@microsoft/fast-element/updates.js";

const mount = document.querySelector<HTMLButtonElement>("#mount")!;
const detach = document.querySelector<HTMLButtonElement>("#detach")!;
const connection = document.querySelector<HTMLOutputElement>("#connection")!;
const count = document.querySelector<HTMLOutputElement>("#count")!;
const host = document.querySelector<HTMLDivElement>("#host")!;
const requests = document.querySelector<HTMLOListElement>("#requests")!;
let requestCount = 0;

function startRequest() {
    const number = ++requestCount;
    const value = number === 1 ? "Old connection result" : "Current connection result";
    const row = document.createElement("li");
    const resolveButton = document.createElement("button");
    const status = document.createElement("output");
    resolveButton.type = "button";
    resolveButton.textContent = `Resolve request ${number}`;
    status.setAttribute("aria-label", `Request ${number} status`);
    status.textContent = "pending";
    row.append(resolveButton, " — ", status);
    requests.append(row);
    count.value = String(number);

    const promise = new Promise<string>(resolve => {
        resolveButton.addEventListener(
            "click",
            () => {
                resolveButton.disabled = true;
                resolve(value);
            },
            { once: true },
        );
    });
    return { promise, status };
}

export class StaleAsyncConnectionWork extends FASTElement {
    value = "Waiting for result";

    connectedCallback(): void {
        super.connectedCallback();
        this.showConnection();
        const { promise, status } = startRequest();
        void promise
            .then(async value => {
                // Deliberately insufficient: a reconnect makes this true for old work too.
                if (this.$fastController.isConnected) {
                    this.value = value;
                    // Publish completion only after the bound value reaches the UI.
                    await Updates.next();
                    status.textContent = "applied while connected";
                } else {
                    status.textContent = "ignored while disconnected";
                }
            })
            .catch(() => {
                status.textContent = "completion failed";
            });
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.showConnection();
    }

    private showConnection(): void {
        const connected = this.$fastController.isConnected;
        connection.value = connected ? "connected" : "disconnected";
        mount.disabled = connected;
        detach.disabled = !connected;
    }
}

Observable.defineProperty(StaleAsyncConnectionWork.prototype, "value");

await FASTElement.define(StaleAsyncConnectionWork, {
    name: "stale-async-connection-work",
    template: html<StaleAsyncConnectionWork>`
        <p>Value: <output aria-label="Value">${x => x.value}</output></p>
    `,
});

// Keep exactly one element instance: mounting never constructs a replacement.
const element = new StaleAsyncConnectionWork();
mount.addEventListener("click", () => host.append(element));
detach.addEventListener("click", () => element.remove());
mount.disabled = false;
