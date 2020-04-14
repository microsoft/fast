import { emptyArray } from "../interfaces";

export interface Splice {
    index: number;
    removed: any[];
    addedCount: number;
}

export function newSplice(index: number, removed: any[], addedCount: number): Splice {
    return {
        index: index,
        removed: removed,
        addedCount: addedCount,
    };
}

const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3;

// Note: This function is *based* on the computation of the Levenshtein
// "edit" distance. The one change is that "updates" are treated as two
// edits - not one. With Array splices, an update is really a delete
// followed by an add. By retaining this, we optimize for "keeping" the
// maximum array items in the original array. For example:
//
//   'xxxx123' -> '123yyyy'
//
// With 1-edit updates, the shortest path would be just to update all seven
// characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
// leaves the substring '123' intact.
function calcEditDistances(
    current: any[],
    currentStart: number,
    currentEnd: number,
    old: any[],
    oldStart: number,
    oldEnd: number
): any[] {
    // "Deletion" columns
    const rowCount = oldEnd - oldStart + 1;
    const columnCount = currentEnd - currentStart + 1;
    const distances = new Array(rowCount);
    let north;
    let west;

    // "Addition" rows. Initialize null column.
    for (let i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
    }

    // Initialize null row
    for (let j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
    }

    for (let i = 1; i < rowCount; ++i) {
        for (let j = 1; j < columnCount; ++j) {
            if (current[currentStart + j - 1] === old[oldStart + i - 1]) {
                distances[i][j] = distances[i - 1][j - 1];
            } else {
                north = distances[i - 1][j] + 1;
                west = distances[i][j - 1] + 1;
                distances[i][j] = north < west ? north : west;
            }
        }
    }

    return distances;
}

// This starts at the final weight, and walks "backward" by finding
// the minimum previous weight recursively until the origin of the weight
// matrix.
function spliceOperationsFromEditDistances(distances: number[][]): number[] {
    let i = distances.length - 1;
    let j = distances[0].length - 1;
    let current = distances[i][j];
    const edits: number[] = [];

    while (i > 0 || j > 0) {
        if (i === 0) {
            edits.push(EDIT_ADD);
            j--;
            continue;
        }
        if (j === 0) {
            edits.push(EDIT_DELETE);
            i--;
            continue;
        }

        const northWest = distances[i - 1][j - 1];
        const west = distances[i - 1][j];
        const north = distances[i][j - 1];

        let min;
        if (west < north) {
            min = west < northWest ? west : northWest;
        } else {
            min = north < northWest ? north : northWest;
        }

        if (min === northWest) {
            if (northWest === current) {
                edits.push(EDIT_LEAVE);
            } else {
                edits.push(EDIT_UPDATE);
                current = northWest;
            }
            i--;
            j--;
        } else if (min === west) {
            edits.push(EDIT_DELETE);
            i--;
            current = west;
        } else {
            edits.push(EDIT_ADD);
            j--;
            current = north;
        }
    }

    edits.reverse();
    return edits;
}

function sharedPrefix(current: any[], old: any[], searchLength: number): number {
    for (let i = 0; i < searchLength; ++i) {
        if (current[i] !== old[i]) {
            return i;
        }
    }

    return searchLength;
}

function sharedSuffix(current: any[], old: any[], searchLength: number): number {
    let index1 = current.length;
    let index2 = old.length;
    let count = 0;

    while (count < searchLength && current[--index1] === old[--index2]) {
        count++;
    }

    return count;
}

function intersect(start1: number, end1: number, start2: number, end2: number): number {
    // Disjoint
    if (end1 < start2 || end2 < start1) {
        return -1;
    }

    // Adjacent
    if (end1 === start2 || end2 === start1) {
        return 0;
    }

    // Non-zero intersect, span1 first
    if (start1 < start2) {
        if (end1 < end2) {
            return end1 - start2; // Overlap
        }

        return end2 - start2; // Contained
    }

    // Non-zero intersect, span2 first
    if (end2 < end1) {
        return end2 - start1; // Overlap
    }

    return end1 - start1; // Contained
}

/**
 * Splice Projection functions:
 *
 * A splice map is a representation of how a previous array of items
 * was transformed into a new array of items. Conceptually it is a list of
 * tuples of
 *
 *   <index, removed, addedCount>
 *
 * which are kept in ascending index order of. The tuple represents that at
 * the |index|, |removed| sequence of items were removed, and counting forward
 * from |index|, |addedCount| items were added.
 */

/**
 * Lacking individual splice mutation information, the minimal set of
 * splices can be synthesized given the previous state and final state of an
 * array. The basic approach is to calculate the edit distance matrix and
 * choose the shortest path through it.
 *
 * Complexity: O(l * p)
 *   l: The length of the current array
 *   p: The length of the old array
 */
export function calcSplices(
    current: any[],
    currentStart: number,
    currentEnd: number,
    old: any[],
    oldStart: number,
    oldEnd: number
): ReadonlyArray<never> | Splice[] {
    let prefixCount = 0;
    let suffixCount = 0;

    const minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
    if (currentStart === 0 && oldStart === 0) {
        prefixCount = sharedPrefix(current, old, minLength);
    }

    if (currentEnd === current.length && oldEnd === old.length) {
        suffixCount = sharedSuffix(current, old, minLength - prefixCount);
    }

    currentStart += prefixCount;
    oldStart += prefixCount;
    currentEnd -= suffixCount;
    oldEnd -= suffixCount;

    if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
        return emptyArray;
    }

    if (currentStart === currentEnd) {
        const splice = newSplice(currentStart, [], 0);

        while (oldStart < oldEnd) {
            splice.removed.push(old[oldStart++]);
        }

        return [splice];
    } else if (oldStart === oldEnd) {
        return [newSplice(currentStart, [], currentEnd - currentStart)];
    }

    const ops = spliceOperationsFromEditDistances(
        calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd)
    );

    const splices: Splice[] = [];
    let splice: Splice | undefined = void 0;
    let index = currentStart;
    let oldIndex = oldStart;

    for (let i = 0; i < ops.length; ++i) {
        switch (ops[i]) {
            case EDIT_LEAVE:
                if (splice !== void 0) {
                    splices.push(splice);
                    splice = void 0;
                }

                index++;
                oldIndex++;
                break;
            case EDIT_UPDATE:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }

                splice.addedCount++;
                index++;

                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            case EDIT_ADD:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }

                splice.addedCount++;
                index++;
                break;
            case EDIT_DELETE:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }

                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            // no default
        }
    }

    if (splice !== void 0) {
        splices.push(splice);
    }

    return splices;
}

const $push = Array.prototype.push;

function mergeSplice(
    splices: Splice[],
    index: number,
    removed: any[],
    addedCount: number
): void {
    const splice = newSplice(index, removed, addedCount);
    let inserted = false;
    let insertionOffset = 0;

    for (let i = 0, ii = splices.length; i < ii; i++) {
        const current = splices[i];
        current.index += insertionOffset;

        if (inserted) {
            continue;
        }

        const intersectCount = intersect(
            splice.index,
            splice.index + splice.removed.length,
            current.index,
            current.index + current.addedCount
        );

        if (intersectCount >= 0) {
            // Merge the two splices

            splices.splice(i, 1);
            i--;

            insertionOffset -= current.addedCount - current.removed.length;

            splice.addedCount += current.addedCount - intersectCount;
            const deleteCount =
                splice.removed.length + current.removed.length - intersectCount;

            if (!splice.addedCount && !deleteCount) {
                // merged splice is a noop. discard.
                inserted = true;
            } else {
                let currentRemoved = current.removed;

                if (splice.index < current.index) {
                    // some prefix of splice.removed is prepended to current.removed.
                    const prepend = splice.removed.slice(0, current.index - splice.index);
                    $push.apply(prepend, currentRemoved);
                    currentRemoved = prepend;
                }

                if (
                    splice.index + splice.removed.length >
                    current.index + current.addedCount
                ) {
                    // some suffix of splice.removed is appended to current.removed.
                    const append = splice.removed.slice(
                        current.index + current.addedCount - splice.index
                    );
                    $push.apply(currentRemoved, append);
                }

                splice.removed = currentRemoved;

                if (current.index < splice.index) {
                    splice.index = current.index;
                }
            }
        } else if (splice.index < current.index) {
            // Insert splice here.

            inserted = true;

            splices.splice(i, 0, splice);
            i++;

            const offset = splice.addedCount - splice.removed.length;
            current.index += offset;
            insertionOffset += offset;
        }
    }

    if (!inserted) {
        splices.push(splice);
    }
}

function createInitialSplices(changeRecords: Splice[]): Splice[] {
    const splices: Splice[] = [];

    for (let i = 0, ii = changeRecords.length; i < ii; i++) {
        const record = changeRecords[i];
        mergeSplice(splices, record.index, record.removed, record.addedCount);
    }

    return splices;
}

export function projectArraySplices(array: any[], changeRecords: any[]): Splice[] {
    let splices: Splice[] = [];
    const initialSplices = createInitialSplices(changeRecords);

    for (let i = 0, ii = initialSplices.length; i < ii; ++i) {
        const splice = initialSplices[i];

        if (splice.addedCount === 1 && splice.removed.length === 1) {
            if (splice.removed[0] !== array[splice.index]) {
                splices.push(splice);
            }

            continue;
        }

        splices = splices.concat(
            calcSplices(
                array,
                splice.index,
                splice.index + splice.addedCount,
                splice.removed,
                0,
                splice.removed.length
            )
        );
    }

    return splices;
}
