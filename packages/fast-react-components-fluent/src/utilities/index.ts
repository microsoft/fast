export type formatToPx = (item: number) => string;

export const toPx: formatToPx = (item: number): string => {
    return `${item}px`;
};
