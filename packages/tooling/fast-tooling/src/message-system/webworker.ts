/// <reference lib="webworker" />

import { getMessage } from "./message-system.utilities";

onmessage = function (e: MessageEvent): void {
    if (e.data?.[0]?.type) {
        postMessage(getMessage(e.data));
    }
};
