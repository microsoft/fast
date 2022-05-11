// How do we sync children on parent and parent on child?
class DesignTokenNode {
    #parent: DesignTokenNode | null = null;
    get parent() {
        return this.#parent;
    }

    appendTo(node: DesignTokenNode);
}
