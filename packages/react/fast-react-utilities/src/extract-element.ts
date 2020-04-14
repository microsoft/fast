import ReactDOM from "react-dom";
import { isNil } from "lodash-es";

/**
 * extracts the html element or Text instance from React ref or simply returns html element passed in
 */
export function extractHtmlElement(
    sourceRef: React.RefObject<any> | HTMLElement
): HTMLElement | Text | null {
    if (sourceRef instanceof HTMLElement) {
        return sourceRef;
    }
    if (!isNil(sourceRef.current)) {
        if (sourceRef.current instanceof HTMLElement) {
            return sourceRef.current;
        }
        /* eslint-disable-next-line react/no-find-dom-node */
        const foundNode: Element | Text | null = ReactDOM.findDOMNode(sourceRef.current);

        if (foundNode instanceof HTMLElement || foundNode instanceof Text) {
            return foundNode;
        }
    }

    return null;
}
