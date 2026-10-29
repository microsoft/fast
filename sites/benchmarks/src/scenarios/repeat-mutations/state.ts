export const mutationItemCount = 2_000;

export function createMutationItems(): number[] {
    return Array.from({ length: mutationItemCount }, (_, index) => index);
}
