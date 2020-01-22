import ReactDOM from "react-dom";
import { isNil } from "lodash-es";

/**
 * Attempts to extract an html element from a ref
 */
export function extractElementFromRef(
    sourceRef: React.RefObject<any> | HTMLElement
): HTMLElement | null {
    if (sourceRef instanceof HTMLElement) {
        return sourceRef;
    }
    if (!isNil(sourceRef.current)) {
        if (sourceRef.current instanceof HTMLElement) {
            return sourceRef.current;
        }

        const foundNode: Element | Text | null = ReactDOM.findDOMNode(sourceRef.current);

        if (foundNode instanceof HTMLElement) {
            return foundNode;
        }
    }

    return null;
}
