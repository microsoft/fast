/**
 * A timeout helper for use in tests.
 * @param timeout The length of the timeout.
 * @returns A promise that resolves once the configured time has elapsed.
 * @public
 */
export async function timeout(timeout = 0): Promise<void> {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve(void 0);
        }, timeout);
    });
}
