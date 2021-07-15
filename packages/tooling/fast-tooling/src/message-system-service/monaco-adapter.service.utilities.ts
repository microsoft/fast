import { LinkedData, Parent } from "../";
import { DataDictionary } from "../message-system";

export interface ExtendedParent extends Parent {
    /**
     * The current dictionary ID this parent refers to
     */
    currentId: string;

    /**
     * The linked data index in the parent
     */
    linkedDataIndex: number;
}

/**
 *
 * @alpha
 * @internal
 */
export function findDictionaryIdParents(
    dictionaryId: string,
    dataDictionary: DataDictionary<unknown>,
    parents: ExtendedParent[] = []
): ExtendedParent[] {
    if (
        dataDictionary[0][dictionaryId] &&
        dataDictionary[0][dictionaryId].parent &&
        dataDictionary[0][dictionaryId].parent.id
    ) {
        const parent = dataDictionary[0][dictionaryId].parent;

        parents.unshift({
            ...parent,
            currentId: dictionaryId,
            linkedDataIndex: dataDictionary[0][parent.id].data[
                parent.dataLocation
            ].findIndex((dictionaryItem: LinkedData) => {
                return dictionaryItem.id === dictionaryId;
            }),
        });

        findDictionaryIdParents(parent.id, dataDictionary, parents);
    }

    return parents;
}

/**
 *
 * @alpha
 * @internal
 */
export function findUpdatedDictionaryId(
    parents: ExtendedParent[],
    dataDictionary: DataDictionary<unknown>,
    dictionaryId: string = dataDictionary[1]
): string {
    if (parents.length === 0) {
        return dictionaryId;
    }

    const dataLocation = parents[0].dataLocation;
    const linkedDataIndex = parents[0].linkedDataIndex;

    if (
        !dataDictionary[0][dictionaryId].data ||
        !dataDictionary[0][dictionaryId].data[dataLocation] ||
        !dataDictionary[0][dictionaryId].data[dataLocation][linkedDataIndex] ||
        typeof dataDictionary[0][dictionaryId].data[dataLocation][linkedDataIndex].id !==
            "string"
    ) {
        return dictionaryId;
    }

    const newDictionaryId =
        dataDictionary[0][dictionaryId].data[dataLocation][linkedDataIndex].id;
    parents.shift();

    return findUpdatedDictionaryId(parents, dataDictionary, newDictionaryId);
}
