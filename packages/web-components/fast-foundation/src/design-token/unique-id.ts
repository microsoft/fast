/**
 * Unique ID generator
 * @internal
 */
export function* uniqueId(): Generator<string, string> {
    let id = 0;

    while (true) {
        id++;
        yield id.toString(16);
    }
}
