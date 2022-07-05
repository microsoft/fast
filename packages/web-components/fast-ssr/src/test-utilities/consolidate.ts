export function consolidate(strings: IterableIterator<string>): string {
    let str = "";
    let current = strings.next();

    while (!current.done) {
        str = str.concat(current.value);
        current = strings.next();
    }

    return str;
}
