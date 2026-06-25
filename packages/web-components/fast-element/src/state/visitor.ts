export interface ObjectVisitor<TVisitorData> {
    visitObject(object: any, data: TVisitorData): void;
    visitArray(array: any[], data: TVisitorData): void;
    visitProperty(object: any, key: PropertyKey, value: any, data: TVisitorData): void;
}

function shouldTraverse(value: any, traversed: WeakSet<any> | Set<any>) {
    return (
        value !== null &&
        value !== void 0 &&
        typeof value === "object" &&
        !traversed.has(value)
    );
}

export function visitObject<TVisitorData>(
    object: any,
    deep: boolean,
    visitor: ObjectVisitor<TVisitorData>,
    data: TVisitorData,
    traversed: WeakSet<any> | Set<any>
): void {
    if (!shouldTraverse(object, traversed)) {
        return;
    }

    traversed.add(object);

    if (Array.isArray(object)) {
        visitor.visitArray(object, data);

        for (const item of object) {
            visitObject(item, deep, visitor, data, traversed);
        }
    } else {
        visitor.visitObject(object, data);

        for (const key in object) {
            const value = object[key];
            visitor.visitProperty(object, key, value, data);

            if (deep) {
                visitObject(value, deep, visitor, data, traversed);
            }
        }
    }
}
