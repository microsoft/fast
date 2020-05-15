import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { MessageSystem } from "@microsoft/fast-tooling";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
    });
}

const root = document.getElementById("root");

if (root !== null) {
    root.innerHTML = "Web Components Example 1";
}
