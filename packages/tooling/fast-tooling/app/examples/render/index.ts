import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
} from "../../../src";
import { HTMLRender } from "../../../src/web-components/html-render/html-render"
import dataDictionaryConfig from "./data-dictionary-config";
import schemaDictionary from "./schema-dictionary";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../dist/message-system.min.js");
document.body.setAttribute("style", "margin: 0");

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

HTMLRender;

const htmlRender:HTMLRender = document.getElementById("htmlRender") as HTMLRender;

function handleMessageSystem(e: MessageEvent) {
    if (e.data) {
        if (
            e.data.type === MessageSystemType.initialize ||
            e.data.type === MessageSystemType.data
        ) {
            /**Initialize stuff here */
        }

        if (e.data.type === MessageSystemType.initialize) {
//            const config: any = fastMessageSystem.getConfigById(shortcutsId) as any;
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
    htmlRender.messageSystem = fastMessageSystem;
}
