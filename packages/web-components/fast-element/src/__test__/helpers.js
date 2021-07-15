export function toHTML(node, preserveCommentMarkup = false) {
    return Array.from(node.childNodes)
        .map(x => {
            if (preserveCommentMarkup && x.nodeType === 8) {
                return `<!--${x.textContent}-->`;
            }
            return x.outerHTML || x.textContent;
        })
        .join("");
}
let counter = 0;
export function uniqueElementName() {
    return `test-element-${++counter}`;
}
