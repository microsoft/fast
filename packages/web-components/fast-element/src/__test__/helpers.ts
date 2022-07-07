export function toHTML(node: Node, preserveCommentMarkup: boolean = false): string {
    return Array.from(node.childNodes)
        .map((x: any) => {
            if (preserveCommentMarkup && x.nodeType === 8) {
                return `<!--${x.textContent}-->`;
            }

            return x.outerHTML || x.textContent;
        })
        .join("");
}
