import {
    baseLayerLuminance,
    fastAnchor,
    fastBadge,
    fastDivider,
    fastTab,
    fastTabPanel,
    fastTabs,
    fillColor,
    StandardLuminance,
    SwatchRGB,
} from "@microsoft/fast-components";
import "./style.css";
import { DesignSystem } from "@microsoft/fast-foundation";
import examples from "./registry";
import toolingGuidance from "./.tmp/tooling-guidance";
import toolingReactGuidance from "./.tmp/tooling-react-guidance";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("@microsoft/site-utilities/statics/assets/fast-inline-logo.svg");
FASTInlineLogo;

DesignSystem.getOrCreate().register(
    fastAnchor(),
    fastBadge(),
    fastDivider(),
    fastTabs(),
    fastTab(),
    fastTabPanel()
);

/**
 * The links to examples
 */
const exampleIds = Object.keys(examples);
const iframeAttributes = {
    style:
        "width:1000px; height:500px; border:0; border-radius: 4px; overflow:hidden; padding: 20px;",
    embed:
        "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts",
};

enum Guidance {
    tooling = "tooling-guidance",
    toolingReact = "tooling-react-guidance",
}

function initializeExample(id: string) {
    const textContainer = document.getElementById("text");
    const tabsContainer = document.getElementById("tabs");
    const iframeTab = document.querySelector("[data-id='iframe-tab']");
    const iframePanel = document.querySelector("[data-id='iframe-panel']");
    const codeEmbedTab = document.querySelector("[data-id='code-embed-tab']");
    const codeEmbedPanel = document.querySelector("[data-id='code-embed-panel']");

    if (tabsContainer !== null) {
        tabsContainer.setAttribute("style", "display: block;");

        if (iframeTab !== null) {
            iframeTab.innerHTML = "Example";
        }

        if (iframePanel !== null) {
            const iframe = document.createElement("iframe");
            iframe.setAttribute("src", `/examples/${id}`);
            Object.entries(iframeAttributes).forEach(
                ([attributeName, attributeValue]: [string, string]) => {
                    iframe.setAttribute(attributeName, attributeValue);
                }
            );
            iframePanel.append(iframe);
        }

        if (codeEmbedTab !== null) {
            codeEmbedTab.innerHTML = "TypeScript";
        }

        if (codeEmbedPanel !== null) {
            const codeEmbedIframe = document.createElement("iframe");
            codeEmbedIframe.setAttribute("src", examples[id].codeEmbedSrc);
            Object.entries(iframeAttributes).forEach(
                ([attributeName, attributeValue]: [string, string]) => {
                    codeEmbedIframe.setAttribute(attributeName, attributeValue);
                }
            );
            codeEmbedPanel.append(codeEmbedIframe);
        }
    }

    if (textContainer !== null) {
        textContainer.innerHTML = examples[id].text;
    }
}

function initializeGuidance(id: string) {
    const textContainer = document.getElementById("text");

    if (textContainer !== null) {
        switch (id) {
            case Guidance.tooling:
                textContainer.innerHTML = toolingGuidance;
                break;
            case Guidance.toolingReact:
                textContainer.innerHTML = toolingReactGuidance;
                break;
        }
    }
}

function initialize() {
    if (
        exampleIds.find(exampleId => {
            return `/${exampleId}` === window.location.pathname;
        })
    ) {
        initializeExample(window.location.pathname.slice(1));
    } else if (
        Object.entries(Guidance)
            .map(([, value]) => {
                return value;
            })
            .find(guidanceId => {
                return `/${guidanceId}` === window.location.pathname;
            })
    ) {
        initializeGuidance(window.location.pathname.slice(1));
    }

    baseLayerLuminance.withDefault(StandardLuminance.LightMode);
    fillColor.withDefault(
        SwatchRGB.create(
            StandardLuminance.LightMode,
            StandardLuminance.LightMode,
            StandardLuminance.LightMode
        )
    );
}

/**
 * Initialize
 */
initialize();
