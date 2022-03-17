import { LinkedList } from "./linked-list";

describe("LinkedList", () => {
    const list = new LinkedList<number>();

    list.push(0);
    list.push(1);
    list.push(2);

    test("should be the correct size.", () => {
        expect(list.size).toBe(3);
    });

    test("should have the correct value at position 0.", () => {
        expect(list.iterator().next().value).toEqual(0);
    });

    test("should remove the last element.", () => {
        list.pop();
        expect(list.size).toBe(2);
    });

    test("should remove the first element.", () => {
        list.shift();
        expect(list.size).toBe(1);
        expect(list.iterator().next().value).toEqual(1);
    });

    test("should add a new element at the beginning.", () => {
        list.unshift(0);
        expect(list.size).toBe(2);
        expect(list.iterator().next().value).toEqual(0);
    });

    test("should remove the only element.", () => {
        list.pop();
        list.pop();
        expect(list.iterator().next().value).toEqual(undefined);
    });

    test("should convert the list to an array.", () => {
        list.push(0);
        list.push(1);

        const array: number[] = list.toArray();

        expect(array.length).toBe(2);
        expect(array[0]).toEqual(0);
    });

    test("should clear the list.", () => {
        list.clear();
        expect(list.size).toBe(0);
    });

    test("should indicate the list is empty.", () => {
        expect(list.isEmpty()).toEqual(true);
    });
});