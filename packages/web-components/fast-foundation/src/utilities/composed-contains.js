import { composedParent } from "./composed-parent";
/**
 * Determines if the reference element contains the test element in a "composed" DOM tree that
 * ignores shadow DOM boundaries.
 *
 * Returns true of the test element is a descendent of the reference, or exist in
 * a shadow DOM that is a logical descendent of the reference. Otherwise returns false.
 * @param reference - The element to test for containment against.
 * @param test - The element being tested for containment.
 *
 * @public
 */
export function composedContains(reference, test) {
    let current = test;
    while (current !== null) {
        if (current === reference) {
            return true;
        }
        current = composedParent(current);
    }
    return false;
}
