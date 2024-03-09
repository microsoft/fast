interface CloseWatcher extends EventTarget {
    new (options?: CloseWatcherOptions): CloseWatcher;
    requestClose(): void;
    close(): void;
    destroy(): void;

    oncancel: (event: Event) => any | null;
    onclose: (event: Event) => any | null;
}

declare const CloseWatcher: CloseWatcher;

interface CloseWatcherOptions {
    signal: AbortSignal;
}

declare interface Window {
    CloseWatcher?: CloseWatcher;
}
