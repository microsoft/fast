const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

/**
 * Gets a random char from {@link chars}
 */
function getRandomChar() {
    return chars[Math.floor(Math.random() * (chars.length - 1))];
}

function getId(length: number): string {
    let str = "";
    for (let i = 0; i < length; i++) {
        str += getRandomChar();
    }

    return str;
}

const usedIds = new Set<string>();
// When id-associated object is garbage-collected,
// delete the id from usedIds, allowing re-use.
const gcHandler = new FinalizationRegistry((value: string) => {
    usedIds.delete(value);
});

/**
 * Generates an ID string. The ID is not guaranteed to be unique.
 * @param length - the number of characters in the id string.
 * @returns
 */
export const IDManager = Object.freeze({
    /**
     * Returns a unique ID to associate to a specific object reference.
     * This manager does not store any references to the provided object,
     * so calling this more than once for an object will generate multiple
     * ids for the object.
     *
     * @param source - The object to associate the unique id.
     * @param length - The character length of the id string.
     * @returns the ID string.
     */
    getFor<T extends object>(source: T, length = 10): string {
        let str;

        // Generate a new ID until there is no collision
        do {
            str = getId(length);
        } while (usedIds.has(str));

        usedIds.add(str);
        gcHandler.register(source, str);

        return str;
    },
});
