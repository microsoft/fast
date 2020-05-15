import {
    FASTAnchor,
    FASTBadge,
    FASTDesignSystemProvider,
    FASTDivider,
} from "@microsoft/fast-components";
import "./style.css";
import examples from "./registry";

// prevent tree shaking
FASTAnchor;
FASTBadge;
FASTDivider;
FASTDesignSystemProvider;

/**
 * The links to examples
 */
const exampleIds = Object.keys(examples);

function initializeExample(id: string) {
    const textContainer = document.getElementById("text");
    const iframeContainer = document.getElementById("iframe");

    if (textContainer !== null) {
        textContainer.innerHTML = examples[id].text;
    }

    if (iframeContainer !== null) {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", `/examples/${id}`);
        iframeContainer.append(iframe);
    }
}

function initialize() {
    if (
        exampleIds.find(exampleId => {
            return `/${exampleId}` === window.location.pathname;
        })
    ) {
        initializeExample(window.location.pathname.slice(1));
    }
}

/**
 * Initialize
 */
initialize();
