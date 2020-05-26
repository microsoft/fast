export function toHTML(node: Node): string {
    return Array.from(node.childNodes)
        .map((x: any) => {
            return x.outerHTML || x.textContent;
        })
        .join("");
}
