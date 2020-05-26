import {
    defaultExecutionContext,
    ExecutionContext,
    HTMLView,
    ViewTemplate,
} from "@microsoft/fast-element";

export interface FixtureOptions {
    document?: Document;
    parent?: HTMLElement;
    source?: any;
    context?: ExecutionContext;
}

export interface Fixture<TElement = HTMLElement> {
    document: Document;
    template: ViewTemplate;
    view: HTMLView;
    parent: HTMLElement;
    element: TElement;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

function findElement(view: HTMLView): HTMLElement {
    let current: Node | null = view.firstChild;

    while (current !== null && current.nodeType !== 1) {
        current = current.nextSibling;
    }

    return current as any;
}

export function uniqueName(): string {
    return `fast-unique-${Math.random().toString(36).substring(7)}`;
}

export async function fixture<TElement = HTMLElement>(
    templateOrElementName: ViewTemplate | string,
    options: FixtureOptions = {}
): Promise<Fixture<TElement>> {
    if (typeof templateOrElementName === "string") {
        const html = `<${templateOrElementName}></${templateOrElementName}>`;
        templateOrElementName = new ViewTemplate(html, []);
    }

    const view = templateOrElementName.create();
    const document = options.document || globalThis.document;
    const parent = options.parent || document.createElement("div");
    const source = options.source || {};
    const context = options.context || defaultExecutionContext;
    const element = findElement(view) as any;
    let isConnected = false;

    view.bind(source, context);
    view.appendTo(parent);

    customElements.upgrade(parent);

    await Promise.resolve();

    const connect = async () => {
        if (isConnected) {
            return;
        }

        isConnected = true;
        document.body.appendChild(parent);
        await Promise.resolve();
    };

    const disconnect = async () => {
        if (!isConnected) {
            return;
        }

        isConnected = false;
        document.body.removeChild(parent);
        await Promise.resolve();
    };

    return {
        document,
        template: templateOrElementName,
        view,
        parent,
        element,
        connect,
        disconnect,
    };
}
