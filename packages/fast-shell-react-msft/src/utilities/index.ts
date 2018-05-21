export function joinClasses(condition: boolean, existingClasses: string, newClass: string) {
    return condition
        ? `${existingClasses} ${newClass}`
        : existingClasses;
}
