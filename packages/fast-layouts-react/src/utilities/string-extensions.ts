export function joinClasses(
    condition: boolean,
    existingClasses: string,
    newClass: string
): string {
    return condition ? `${existingClasses} ${newClass}` : existingClasses;
}
