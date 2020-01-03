/// <reference lib="webworker" />

import { getMessage } from "./message-system";

onmessage = function(e: MessageEvent): void {
    postMessage(getMessage(e.data));
};
