/**
 * Queues a macro task and resolves after the task is complete.
 */
export async function nextMacroTask(): Promise<void> {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve(void 0);
        });
    });
}
