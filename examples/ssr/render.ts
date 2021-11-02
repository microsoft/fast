import { DOM } from "@microsoft/fast-element";

function renderTextNode(node: Text): string {
    return node.data;
}

function renderCommentNode(node: Comment): string {
    return `<!--${node.data}-->`;
}

function* renderAttributes(node: Element): IterableIterator<string> {
    const attributes = node.attributes;

    for (
        let i = 0, attr = attributes[i];
        i < attributes.length;
        i++, attr = attributes[i]
    ) {
        yield `${attr.name}="${attr.value}" `;
    }
}

function* renderElementNode(walker: TreeWalker): IterableIterator<string> {
    const node = walker.currentNode as Element;

    yield `<${node.localName} `;
    yield* renderAttributes(node);
    yield ">";
    // eslint-disable-next-line
    yield* renderTree(walker);
    yield `</${node.localName}>`;
}

function* renderNode(walker: TreeWalker): IterableIterator<string> {
    const node = walker.currentNode;
    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            yield* renderElementNode(walker);
            break;
        case Node.TEXT_NODE:
            yield renderTextNode(node as Text);
            break;
        case Node.COMMENT_NODE:
            yield renderCommentNode(node as Comment);
            break;
    }
}

function* renderTree(walker: TreeWalker): IterableIterator<string> {
    let node = walker.firstChild();
    console.log(walker.currentNode);
    const hasChildren = node !== null;

    while (node) {
        yield* renderNode(walker);
        node = walker.nextSibling();
    }

    // Only move walker to parent walker.currentNode was
    // moved by walker.firstChild();
    if (hasChildren) {
        const parent = walker.parentNode();
        console.log(parent, walker.currentNode);
    }
}

export function* render(fragment: DocumentFragment): IterableIterator<string> {
    const walker = DOM.createTemplateWalker(fragment);
    yield* renderTree(walker);
}
