/**
 * @deprecated - use `classNames` utility from @microsoft/fast-web-utilites
 */
export function joinClasses(
    condition: boolean,
    existingClasses: string,
    newClass: string
): string {
    return condition ? `${existingClasses} ${newClass}` : existingClasses;
}
