/**
 * Timeout for use in async tets.
 */
export async function timeout(timeout = 0): Promise<void> {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve(void 0);
        }, timeout);
    });
}
