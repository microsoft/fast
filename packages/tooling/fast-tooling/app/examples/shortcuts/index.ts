import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
} from "../../../src";
import {
    Shortcuts,
    shortcutsId,
} from "../../../src/message-system-service/shortcuts.service";
import { ShortcutsAction } from "../../../src/message-system-service/shortcuts.service-action";
import dataDictionaryConfig from "./data-dictionary-config";
import schemaDictionary from "./schema-dictionary";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../dist/message-system.min.js");
const dataElement = document.getElementById("data");
const inputElement = document.getElementById("input");
document.body.setAttribute("style", "margin: 0");

/* eslint-disable @typescript-eslint/no-unused-vars */
const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;
let fastShortcuts: Shortcuts;
let dataDictionary;

function handleMessageSystem(e: MessageEvent) {
    if (e.data) {
        if (
            e.data.type === MessageSystemType.initialize ||
            e.data.type === MessageSystemType.data
        ) {
            dataDictionary = e.data.dataDictionary;
            dataElement.innerHTML = JSON.stringify(dataDictionary, null, 2);
        }

        if (e.data.type === MessageSystemType.initialize) {
            const config: any = fastMessageSystem.getConfigById(shortcutsId) as any;
            inputElement.removeAttribute("disabled");
            inputElement.addEventListener(config.eventListenerType, config.eventListener);
        }
    }
}

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: dataDictionaryConfig as any,
        schemaDictionary,
    });
    fastMessageSystem.add({
        onMessage: handleMessageSystem,
    });

    fastShortcuts = new Shortcuts({
        messageSystem: fastMessageSystem,
        actions: [
            new ShortcutsAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        ctrlKey: true,
                    },
                    {
                        shiftKey: true,
                    },
                    {
                        value: "D",
                    },
                ],
                action: () => {
                    fastMessageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        dataLocation: "text",
                        linkedData: [{ id: "text" }],
                        options: {
                            originatorId: shortcutsId,
                        },
                    });
                },
            }),
        ],
    });
}
