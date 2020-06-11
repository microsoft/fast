import {
    FASTAnchor,
    FASTBadge,
    FASTDesignSystemProvider,
    FASTDivider,
} from "@microsoft/fast-components";
import "./style.css";
import examples from "./registry";
import toolingGuidance from "./tooling-guidance";
import toolingReactGuidance from "./tooling-react-guidance";

// prevent tree shaking
FASTAnchor;
FASTBadge;
FASTDivider;
FASTDesignSystemProvider;

/**
 * The links to examples
 */
const exampleIds = Object.keys(examples);

enum Guidance {
    tooling = "tooling-guidance",
    toolingReact = "tooling-react-guidance",
}

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
}

/**
 * Initialize
 */
initialize();
