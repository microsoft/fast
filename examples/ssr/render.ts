import { DOM } from "@microsoft/fast-element";
import { getElementRenderer } from "@lit-labs/ssr/lib/element-renderer";
import { RenderInfo } from "@lit-labs/ssr";

function renderTextNode(node: Text): string {
    return node.data;
}

function renderCommentNode(node: Comment): string {
    return `<!--${node.data}-->`;
}

function getAttributes(node: Element): Map<string, string> {
    const collected = new Map<string, string>();
    const attributes = node.attributes;

    for (
        let i = 0, attr = attributes[i];
        i < attributes.length;
        i++, attr = attributes[i]
    ) {
        collected.set(attr.name, attr.value);
    }

    return collected;
}

function* renderAttributeString(node: Element): IterableIterator<string> {
    for (const [name, value] of getAttributes(node).entries()) {
        yield `${name}="${value}" `;
    }
}

function* renderNonCustomElementNode(
    walker: TreeWalker,
    renderInfo: RenderInfo
): IterableIterator<string> {
    const node = walker.currentNode as Element;
    const tagName = (node as Element).localName;
    yield `<${tagName} `;
    yield* renderAttributeString(node);
    yield ">";
    // eslint-disable-next-line
    yield* renderTree(walker, renderInfo);
    yield `</${tagName}>`;
}
function* renderCustomElementNode(
    walker: TreeWalker,
    renderInfo: RenderInfo
): IterableIterator<string> {
    const node = walker.currentNode as Element;
    const tagName = node.localName;
    const attributes = getAttributes(node);
    const renderer = getElementRenderer(
        renderInfo,
        tagName,
        customElements.get(tagName)!,
        attributes
    );

    if (!renderer) {
        // If no renderer has been registered for the custom element,
        // render it as a non-custom element.
        yield* renderNonCustomElementNode(walker, renderInfo);
        return;
    }

    for (const [name, value] of attributes) {
        renderer.setAttribute(name, value);
    }

    Object.getOwnPropertyNames(node).forEach((name: string) =>
        renderer.setProperty(name, (node as any)[name])
    );

    renderInfo.customElementInstanceStack.push(renderer);

    renderer.connectedCallback();

    yield `<${tagName}`;
    yield* renderer.renderAttributes();
    // If the element is nested inside another, add the `defer-hydration` attribute
    // this aligns with lit's behavior
    if (renderInfo.customElementHostStack.length > 0) {
        yield " defer-hydration";
    }
    yield `>`;

    const shadowContent = renderer.renderShadow(renderInfo);

    if (shadowContent) {
        renderInfo.customElementHostStack.push(renderer);
        // hard-code open shadow root because otherwise
        // the custom element doesn't have a mechanism to
        // obtain the element's shadow root during hydration
        yield `<template shadowroot="open">`;
        yield* shadowContent;
        yield "</template>";
        renderInfo.customElementHostStack.pop();
    }

    // eslint-disable-next-line
    yield* renderTree(walker, renderInfo);
    yield `</${tagName}>`;
    renderInfo.customElementInstanceStack.pop();
}

function* renderElementNode(
    walker: TreeWalker,
    renderInfo: RenderInfo
): IterableIterator<string> {
    const node = walker.currentNode as Element;
    const tagName = node.localName;

    if (customElements.get(tagName)) {
        yield* renderCustomElementNode(walker, renderInfo);
    } else {
        yield `<${tagName} `;
        yield* renderAttributeString(node);
        yield ">";
        // eslint-disable-next-line
        yield* renderTree(walker, renderInfo);
        yield `</${tagName}>`;
    }
}

function* renderNode(
    walker: TreeWalker,
    renderInfo: RenderInfo
): IterableIterator<string> {
    const node = walker.currentNode;
    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            yield* renderElementNode(walker, renderInfo);
            break;
        case Node.TEXT_NODE:
            yield renderTextNode(node as Text);
            break;
        case Node.COMMENT_NODE:
            yield renderCommentNode(node as Comment);
            break;
    }
}

function* renderTree(
    walker: TreeWalker,
    renderInfo: RenderInfo
): IterableIterator<string> {
    let node = walker.firstChild();
    const hasChildren = node !== null;

    while (node) {
        yield* renderNode(walker, renderInfo);
        node = walker.nextSibling();
    }

    // Only move walker to parent walker.currentNode was
    // moved by walker.firstChild();
    if (hasChildren) {
        walker.parentNode();
    }
}

export function* render(
    fragment: DocumentFragment,
    renderInfo: RenderInfo
): IterableIterator<string> {
    const walker = document.createTreeWalker(
        fragment,
        NodeFilter.SHOW_TEXT + NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_ELEMENT
    );
    yield* renderTree(walker, renderInfo);
}
