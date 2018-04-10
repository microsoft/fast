/**
 * Gets the array link data
 */
export function getArrayLinks(data: any): string[] {
    if (Array.isArray(data)) {
        return data.map((item: any, index: number) => {
            const defaultValue: string = `Item ${index + 1}`;

            switch (typeof item) {
                case "object":
                    return item.text || defaultValue;
                case "string":
                    return item;
                default:
                    return defaultValue;
            }
        });
    } else {
        return [];
    }
}
