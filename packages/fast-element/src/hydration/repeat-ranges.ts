import { getHostName } from "./diagnostics.js";
import type { HydrationMarkerStrategy } from "./markers.js";

/** @internal */
export interface HydrationRepeatRange {
    start: Node;
    end: Node;
    startMarker: Comment;
    endMarker: Comment;
}

function isCommentNode(node: Node): node is Comment {
    return node.nodeType === Node.COMMENT_NODE;
}

/** @internal */
export function collectHydrationRepeatRanges(
    first: Node,
    location: Node,
    markers: HydrationMarkerStrategy,
): HydrationRepeatRange[] {
    const itemRanges: HydrationRepeatRange[] = [];
    const stack: Comment[] = [];
    let current: Node | null = first;
    while (current !== null && current !== location) {
        if (isCommentNode(current)) {
            const data = current.data;
            if (markers.isRepeatViewStartMarker(data)) {
                stack.push(current);
            } else if (markers.isRepeatViewEndMarker(data)) {
                const startMarker = stack.pop();
                if (startMarker === undefined) {
                    const expected =
                        current.previousSibling === null
                            ? "end should never be null."
                            : "repeat start marker not found.";
                    throw new Error(
                        `Error when hydrating inside "${getHostName(location)}": ${expected}`,
                    );
                }
                if (stack.length === 0) {
                    const start = startMarker.nextSibling!;
                    const end = current.previousSibling!;
                    itemRanges.push({
                        start,
                        end: end === startMarker ? start : end,
                        startMarker,
                        endMarker: current,
                    });
                }
            }
        }
        current = current.nextSibling;
    }
    if (stack.length !== 0) {
        throw new Error(
            `Error when hydrating inside "${getHostName(location)}": repeat end marker not found.`,
        );
    }

    return itemRanges;
}
