export function consolidate(strings: IterableIterator<string>): string {
    let str = "";
    let current = strings.next();

    while (!current.done) {
        str = str.concat(current.value);
        current = strings.next();
    }

    return str;
}

export async function consolidateAsync(
    strings: IterableIterator<string | Promise<string>>
) {
    let value = "";
    for await (const part of strings) {
        value += part;
    }

    return value;
}
