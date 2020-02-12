import ReactDOM from "react-dom";
import { isNil } from "lodash-es";

/**
 * extracts the html element from React ref or simply returns html element passed in
 */
export function extractHtmlElement(
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
