import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(packageRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageName = packageJson.name;

function defineGlobal(name, value) {
    if (!(name in globalThis)) {
        Object.defineProperty(globalThis, name, {
            configurable: true,
            value,
            writable: true,
        });
    }
}

function installBrowserShims() {
    const EventTargetBase = globalThis.EventTarget ?? class EventTargetShim {};

    class NodeShim extends EventTargetBase {
        static ELEMENT_NODE = 1;
        static TEXT_NODE = 3;
        static COMMENT_NODE = 8;
        static DOCUMENT_FRAGMENT_NODE = 11;

        parentNode = null;
        childNodes = [];

        appendChild(node) {
            this.childNodes.push(node);
            node.parentNode = this;
            return node;
        }

        append(...nodes) {
            for (const node of nodes) {
                this.appendChild(node);
            }
        }

        removeChild(node) {
            this.childNodes = this.childNodes.filter(current => current !== node);
            node.parentNode = null;
            return node;
        }

        cloneNode() {
            return new NodeShim();
        }
    }

    class TextShim extends NodeShim {
        nodeType = NodeShim.TEXT_NODE;

        constructor(data = "") {
            super();
            this.data = data;
        }
    }

    class CommentShim extends TextShim {
        nodeType = NodeShim.COMMENT_NODE;
    }

    class ElementShim extends NodeShim {
        nodeType = NodeShim.ELEMENT_NODE;
        attributes = new Map();
        className = "";
        innerHTML = "";

        constructor(tagName = "") {
            super();
            this.localName = tagName.toLowerCase();
            this.tagName = tagName.toUpperCase();
        }

        attachShadow() {
            return new ShadowRootShim();
        }

        getAttribute(name) {
            return this.attributes.get(name) ?? null;
        }

        hasAttribute(name) {
            return this.attributes.has(name);
        }

        setAttribute(name, value) {
            this.attributes.set(name, String(value));
        }

        removeAttribute(name) {
            this.attributes.delete(name);
        }

        querySelectorAll() {
            return [];
        }

        cloneNode() {
            return new ElementShim(this.localName);
        }
    }

    class HTMLElementShim extends ElementShim {}
    class DocumentFragmentShim extends NodeShim {
        nodeType = NodeShim.DOCUMENT_FRAGMENT_NODE;
        adoptedStyleSheets = [];

        querySelectorAll() {
            return [];
        }
    }
    class ShadowRootShim extends DocumentFragmentShim {}
    class HTMLTemplateElementShim extends HTMLElementShim {
        constructor() {
            super("template");
            this.content = new DocumentFragmentShim();
        }
    }
    class CSSStyleSheetShim {
        replace() {
            return Promise.resolve(this);
        }

        replaceSync() {}
    }
    class MutationObserverShim {
        disconnect() {}
        observe() {}
        takeRecords() {
            return [];
        }
    }
    class DocumentShim extends NodeShim {
        adoptedStyleSheets = [];
        body = new HTMLElementShim("body");

        createComment(data) {
            return new CommentShim(data);
        }

        createDocumentFragment() {
            return new DocumentFragmentShim();
        }

        createElement(tagName) {
            return tagName.toLowerCase() === "template"
                ? new HTMLTemplateElementShim()
                : new HTMLElementShim(tagName);
        }

        createTextNode(data) {
            return new TextShim(data);
        }

        createTreeWalker() {
            return {
                currentNode: null,
                nextNode() {
                    return null;
                },
            };
        }
    }

    defineGlobal("Node", NodeShim);
    defineGlobal("Text", TextShim);
    defineGlobal("Comment", CommentShim);
    defineGlobal("Element", ElementShim);
    defineGlobal("HTMLElement", HTMLElementShim);
    defineGlobal("Document", DocumentShim);
    defineGlobal("DocumentFragment", DocumentFragmentShim);
    defineGlobal("ShadowRoot", ShadowRootShim);
    defineGlobal("HTMLTemplateElement", HTMLTemplateElementShim);
    defineGlobal("CSSStyleSheet", CSSStyleSheetShim);
    defineGlobal("MutationObserver", MutationObserverShim);
    defineGlobal("NodeFilter", { SHOW_ELEMENT: 1, SHOW_COMMENT: 128 });
    defineGlobal("document", new DocumentShim());
    defineGlobal("window", globalThis);
    defineGlobal("customElements", {
        define() {},
        get() {
            return undefined;
        },
        whenDefined() {
            return Promise.resolve();
        },
    });
}

function packageRelativePath(exportTarget) {
    return exportTarget.startsWith("./") ? exportTarget.slice(2) : exportTarget;
}

function collectTargets(exportPath, target, targets) {
    if (typeof target === "string") {
        targets.push([exportPath, "default", target]);
        return;
    }

    for (const [condition, conditionTarget] of Object.entries(target)) {
        if (typeof conditionTarget === "string") {
            targets.push([exportPath, condition, conditionTarget]);
        }
    }
}

function verifyExportTargets() {
    const targets = [];

    for (const [exportPath, target] of Object.entries(packageJson.exports)) {
        collectTargets(exportPath, target, targets);
    }

    const missingTargets = targets.filter(([, , target]) => {
        return !existsSync(join(packageRoot, packageRelativePath(target)));
    });

    if (missingTargets.length > 0) {
        console.error("Package export targets are missing:");

        for (const [exportPath, condition, target] of missingTargets) {
            console.error(`  ${exportPath} (${condition}) -> ${target}`);
        }

        console.error("Run `npm run build:tsc -w @microsoft/fast-element` first.");
        process.exitCode = 1;
        return false;
    }

    return true;
}

function toSpecifier(exportPath) {
    return exportPath === "." ? packageName : `${packageName}/${exportPath.slice(2)}`;
}

async function importExport(exportPath) {
    const specifier = toSpecifier(exportPath);

    if (exportPath === "./package.json") {
        await import(specifier, { with: { type: "json" } });
        return;
    }

    await import(specifier);
}

async function main() {
    if (!verifyExportTargets()) {
        return;
    }

    installBrowserShims();

    const failures = [];

    for (const exportPath of Object.keys(packageJson.exports)) {
        try {
            await importExport(exportPath);
        } catch (error) {
            failures.push([toSpecifier(exportPath), error]);
        }
    }

    if (failures.length > 0) {
        console.error("Package export imports failed:");

        for (const [specifier, error] of failures) {
            console.error(`\n${specifier}`);
            console.error(error?.stack ?? error);
        }

        process.exitCode = 1;
        return;
    }

    console.log(
        `Imported ${Object.keys(packageJson.exports).length} package exports successfully.`,
    );
}

main().catch(error => {
    console.error(error?.stack ?? error);
    process.exitCode = 1;
});
