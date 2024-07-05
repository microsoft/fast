export function validateRendererOutput(
    strings: IterableIterator<string>,
    expected: (string | ((x: any) => boolean))[]
): boolean {
    let passed = false;
    let i = 0;
    let current = strings.next();

    while (!current.done) {
        const validator = expected[i];
        // check if there are more strings than validators
        if (validator === undefined) {
            passed = false;
            break;
        }

        if (typeof validator === "function") {
            passed = validator(current.value);
        } else {
            passed = current.value === expected[i];
        }

        if (!passed) {
            break;
        }

        current = strings.next();
        i++;
    }

    return passed;
}
