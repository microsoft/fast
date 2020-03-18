import { Behavior } from "./directives/behavior";

export interface View {
    bind(source: unknown): void;
    unbind(): void;
}

export interface ElementView extends View {
    appendTo(node: Node): void;
}

export interface SyntheticView extends View {
    readonly firstChild: Node;
    readonly lastChild: Node;
    insertBefore(node: Node): void;
    remove(): void;
    dispose(): void;
}

const range = document.createRange();

export class HTMLView implements ElementView, SyntheticView {
    private source: any = void 0;
    public firstChild: Node;
    public lastChild: Node;

    constructor(private fragment: DocumentFragment, private behaviors: Behavior[]) {
        this.firstChild = fragment.firstChild!;
        this.lastChild = fragment.lastChild!;
    }

    public appendTo(node: Node) {
        node.appendChild(this.fragment);
    }

    public insertBefore(node: Node) {
        if (this.fragment.hasChildNodes()) {
            node.parentNode!.insertBefore(this.fragment, node);
        } else {
            let parentNode = node.parentNode!;
            const end = this.lastChild!;
            let current = this.firstChild!;
            let next;

            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next!;
            }

            parentNode.insertBefore(end, node);
        }
    }

    public remove() {
        range.setStart(this.firstChild, 0);
        range.setEnd(this.lastChild, 0);
        this.fragment = range.extractContents();
    }

    public dispose() {
        range.setStart(this.firstChild, 0);
        range.setEnd(this.lastChild, 0);
        range.deleteContents();

        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
        }
    }

    public bind(source: unknown) {
        if (this.source === source) {
            return;
        } else if (this.source !== void 0) {
            this.unbind();
        }

        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].bind(source);
        }
    }

    public unbind() {
        if (this.source === void 0) {
            return;
        }

        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
        }

        this.source = void 0;
    }

    public static disposeContiguousBatch(views: SyntheticView[]) {
        range.setStart(views[0].firstChild, 0);
        range.setEnd(views[views.length - 1].lastChild, 0);
        range.deleteContents();

        for (let i = 0, ii = views.length; i < ii; ++i) {
            const behaviors = (views[i] as any).behaviors as Behavior[];

            for (let j = 0, jj = behaviors.length; j < jj; ++j) {
                behaviors[j].unbind();
            }
        }
    }
}
