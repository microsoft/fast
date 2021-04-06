/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IteratorDefinedResult<T> {
    readonly done: false;
    readonly value: T;
}

export interface IteratorUndefinedResult {
    readonly done: true;
    readonly value: undefined;
}

export const FIN: IteratorUndefinedResult = { done: true, value: undefined };
export type IteratorResult<T> = IteratorDefinedResult<T> | IteratorUndefinedResult;

export interface Iterator<T> {
    next(): IteratorResult<T>;
}

export namespace Iterator {
    const _empty: Iterator<any> = {
        next() {
            return FIN;
        },
    };

    export function empty<T>(): Iterator<T> {
        return _empty;
    }

    export function fromArray<T>(
        array: T[],
        index = 0,
        length = array.length
    ): Iterator<T> {
        return {
            next(): IteratorResult<T> {
                if (index >= length) {
                    return FIN;
                }

                return { done: false, value: array[index++] };
            },
        };
    }

    export function from<T>(elements: Iterator<T> | T[] | undefined): Iterator<T> {
        if (!elements) {
            return Iterator.empty();
        } else if (Array.isArray(elements)) {
            return Iterator.fromArray(elements);
        } else {
            return elements;
        }
    }

    export function map<T, R>(iterator: Iterator<T>, fn: (t: T) => R): Iterator<R> {
        return {
            next() {
                const element = iterator.next();
                if (element.done) {
                    return FIN;
                } else {
                    return { done: false, value: fn(element.value) };
                }
            },
        };
    }

    export function filter<T>(iterator: Iterator<T>, fn: (t: T) => boolean): Iterator<T> {
        return {
            next() {
                while (true) {
                    const element = iterator.next();
                    if (element.done) {
                        return FIN;
                    }
                    if (fn(element.value)) {
                        return { done: false, value: element.value };
                    }
                }
            },
        };
    }

    export function forEach<T>(iterator: Iterator<T>, fn: (t: T) => void): void {
        for (let next = iterator.next(); !next.done; next = iterator.next()) {
            fn(next.value);
        }
    }

    export function collect<T>(iterator: Iterator<T>): T[] {
        const result: T[] = [];
        forEach(iterator, value => result.push(value));
        return result;
    }
}
