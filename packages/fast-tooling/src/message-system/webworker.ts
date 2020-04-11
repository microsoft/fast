/// <reference lib="webworker" />

import { getMessage } from "./message-system.utilities";

onmessage = function (e: MessageEvent): void {
    if (e.data && e.data.type !== undefined) {
        postMessage(getMessage(e.data));
    }
};
