import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
} from "@microsoft/fast-tooling";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;
const input = document.getElementById("text") as HTMLInputElement;
const pre = document.getElementById("data-dictionary") as HTMLPreElement;

function handleInputOnKeyUp() {
    fastMessageSystem.postMessage({
        type: MessageSystemType.data,
        action: MessageSystemDataTypeAction.update,
        dataLocation: "",
        data: input.value,
    });
}

function handleMessageSystem(e) {
    if (pre !== null && e.data && typeof e.data.data === "string") {
        pre.innerHTML = e.data.data;
    }
}

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: [
            {
                root: {
                    schemaId: "text",
                    data: "Hello world",
                },
            },
            "root",
        ],
        schemaDictionary: {
            text: {
                id: "text",
                type: "string",
            },
        },
    });
    fastMessageSystem.add({
        onMessage: handleMessageSystem,
    });
}

input.addEventListener("keyup", handleInputOnKeyUp);
input.value = "Hello world";
