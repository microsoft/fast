import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";
import type { ChatTurn } from "./chat-data.js";
import { cannedTurnMap, fallbackTurn } from "./chat-data.js";

function escapeAttribute(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderSuggestion(text: string): string {
    return `<chat-suggestion text="${escapeAttribute(text)}"></chat-suggestion>`;
}

export class ChatApp extends FASTElement {
    @attr({ attribute: "welcome-title" })
    public welcomeTitle: string = "FAST Chat Demo";

    @attr({ attribute: "composer-placeholder" })
    public composerPlaceholder: string = "Type one of the suggested prompts exactly.";

    @attr({ attribute: "initial-suggestion" })
    public initialSuggestion: string = "Hi";

    public composer: HTMLTextAreaElement | null = null;
    public transcript: HTMLElement | null = null;

    private readonly _queue: ChatTurn[] = [];
    private _isStreaming = false;

    public handleSubmit(event: Event): void {
        event.preventDefault();
        this.sendCurrentMessage();
    }

    public handleComposerKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            this.sendCurrentMessage();
        }
    }

    public handleSuggestion(event: Event): void {
        const suggestionEvent = event as CustomEvent<string>;
        const suggestion = suggestionEvent.detail;

        if (!this.composer || typeof suggestion !== "string") {
            return;
        }

        this.composer.value = suggestion;
        this.composer.focus();
        this.composer.setSelectionRange(suggestion.length, suggestion.length);
    }

    private sendCurrentMessage(): void {
        if (!this.composer || !this.transcript) {
            return;
        }

        const message = this.composer.value.trim();

        if (!message) {
            return;
        }

        this.appendUserMessage(message);
        this.composer.value = "";
        this.scrollTranscript();

        this._queue.push(cannedTurnMap.get(message) ?? fallbackTurn);
        void this.processQueue();
    }

    private appendUserMessage(message: string): void {
        if (!this.transcript) {
            return;
        }

        const messageElement = document.createElement("chat-message");
        const paragraph = document.createElement("p");

        messageElement.setAttribute("kind", "user");
        paragraph.textContent = message;
        messageElement.append(paragraph);
        this.transcript.append(messageElement);
    }

    private async processQueue(): Promise<void> {
        if (this._isStreaming) {
            return;
        }

        const nextTurn = this._queue.shift();

        if (!nextTurn) {
            return;
        }

        this._isStreaming = true;

        try {
            await this.streamTurn(nextTurn);
        } finally {
            this._isStreaming = false;
        }

        if (this._queue.length > 0) {
            void this.processQueue();
        }
    }

    private async streamTurn(turn: ChatTurn): Promise<void> {
        await this.streamIntoTranscript([
            ...turn.responseChunks,
            renderSuggestion(turn.nextSuggestedUserMessage),
        ]);
    }

    private streamIntoTranscript(chunks: readonly string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement("iframe");

            iframe.setAttribute("aria-hidden", "true");
            iframe.tabIndex = -1;
            iframe.style.display = "none";
            document.body.append(iframe);

            iframe.onload = () => {
                iframe.onload = null;

                const iframeDocument = iframe.contentDocument;

                if (!iframeDocument || !this.transcript) {
                    iframe.remove();
                    reject(new Error("Streaming iframe failed to initialize."));
                    return;
                }

                iframeDocument.write("<streaming-element>");

                const streamingElement =
                    iframeDocument.querySelector("streaming-element");

                if (!streamingElement) {
                    iframe.remove();
                    reject(new Error("Unable to create the streaming element."));
                    return;
                }

                this.transcript.append(streamingElement);

                const writeChunks = async (): Promise<void> => {
                    for (const chunk of chunks) {
                        iframeDocument.write(chunk);
                        this.scrollTranscript();
                        await this.delay(600);
                    }

                    iframeDocument.write("</streaming-element>");
                    iframeDocument.close();
                    this.scrollTranscript();
                    iframe.remove();
                    resolve();
                };

                void writeChunks().catch(error => {
                    iframe.remove();
                    reject(error);
                });
            };

            iframe.src = "";
        });
    }

    private scrollTranscript(): void {
        if (!this.transcript) {
            return;
        }

        this.transcript.scrollTop = this.transcript.scrollHeight;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => {
            window.setTimeout(resolve, ms);
        });
    }
}

ChatApp.define(
    {
        name: "chat-app",
        template: declarativeTemplate() as any,
    },
    [observerMap()],
);
