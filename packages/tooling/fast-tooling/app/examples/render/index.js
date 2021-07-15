import { DesignSystem } from "@microsoft/fast-foundation";
import {
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "../../../src";
import { fastToolingHTMLRender } from "../../../src/web-components/html-render";
import { fastToolingHTMLRenderLayerNavigation } from "../../../src/web-components/html-render-layer-navigation";
import { nativeElementDefinitions } from "../../../src/definitions/";
import dataDictionaryConfig from "../../../src/__test__/html-render/data-dictionary-config";
import schemaDictionary from "../../../src/__test__/html-render/schema-dictionary";
DesignSystem.getOrCreate()
    .withPrefix("fast-tooling")
    .register(fastToolingHTMLRender(), fastToolingHTMLRenderLayerNavigation());
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../dist/message-system.min.js");
document.body.setAttribute("style", "margin: 0");
const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem;
const htmlRender = document.getElementById("htmlRender");
const button1 = document.getElementById("testbutton1");
const button2 = document.getElementById("testbutton2");
function handleMessageSystem(e) {
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
        if (
            e.data.type === MessageSystemType.navigation &&
            e.data.action === MessageSystemNavigationTypeAction.update &&
            e.data.activeNavigationConfigId !== "foo"
        ) {
            console.log("Message Recieved", e.data);
        }
    }
}
if (window.Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: dataDictionaryConfig,
        schemaDictionary,
    });
    fastMessageSystem.add({
        onMessage: handleMessageSystem,
    });
    htmlRender.markupDefinitions = Object.values(nativeElementDefinitions);
    htmlRender.messageSystem = fastMessageSystem;
    button1.onclick = () => {
        fastMessageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: "root",
            activeNavigationConfigId: "foo",
        });
    };
    button2.onclick = () => {
        fastMessageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: "span",
            activeNavigationConfigId: "foo",
        });
    };
}
