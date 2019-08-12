export function parseCSSString(input: string): string[] {
    if (input !== undefined) {
        const parsedString: string[] = input.split(" ");

        if (parsedString.length === 1) {
            return [parsedString[0], parsedString[0], parsedString[0], parsedString[0]]
        } else if (parsedString.length === 2) {
            return [parsedString[0], parsedString[1], parsedString[0], parsedString[1]]
        } else if (parsedString.length === 3) {
            return [parsedString[0], parsedString[1], parsedString[2], parsedString[1]]
        } else if (parsedString.length === 4) {
            return [parsedString[0], parsedString[1], parsedString[2], parsedString[3]]
        }
    }
}
