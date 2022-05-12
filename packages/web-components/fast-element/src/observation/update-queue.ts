import { Callable, KernelServiceId } from "../interfaces.js";
import { FAST } from "../platform.js";

/**
 * A work queue used to synchronize writes to the DOM.
 * @public
 */
export interface UpdateQueue {
    /**
     * Schedules DOM update work in the next async batch.
     * @param callable - The callable function or object to queue.
     */
    enqueue(callable: Callable): void;

    /**
     * Resolves with the next DOM update.
     */
    next(): Promise<void>;

    /**
     * Immediately processes all work previously scheduled
     * through enqueue.
     * @remarks
     * This also forces nextUpdate promises
     * to resolve.
     */
    process(): void;

    /**
     * Sets the update mode used by queueUpdate.
     * @param isAsync - Indicates whether DOM updates should be asynchronous.
     * @remarks
     * By default, the update mode is asynchronous, since that provides the best
     * performance in the browser. Passing false to setUpdateMode will instead cause
     * the queue to be immediately processed for each call to queueUpdate. However,
     * ordering will still be preserved so that nested tasks do not run until
     * after parent tasks complete.
     */
    setMode(isAsync: boolean): void;
}

/**
 * The default UpdateQueue.
 * @public
 */
export const Updates: UpdateQueue = FAST.getById(KernelServiceId.updateQueue, () => {
    const tasks: Callable[] = [];
    const pendingErrors: any[] = [];
    const rAF = globalThis.requestAnimationFrame;
    let updateAsync = true;

    function throwFirstError(): void {
        if (pendingErrors.length) {
            throw pendingErrors.shift();
        }
    }

    function tryRunTask(task: Callable): void {
        try {
            (task as any).call();
        } catch (error) {
            if (updateAsync) {
                pendingErrors.push(error);
                setTimeout(throwFirstError, 0);
            } else {
                tasks.length = 0;
                throw error;
            }
        }
    }

    function process(): void {
        const capacity = 1024;
        let index = 0;

        while (index < tasks.length) {
            tryRunTask(tasks[index]);
            index++;

            // Prevent leaking memory for long chains of recursive calls to `DOM.queueUpdate`.
            // If we call `DOM.queueUpdate` within a task scheduled by `DOM.queueUpdate`, the queue will
            // grow, but to avoid an O(n) walk for every task we execute, we don't
            // shift tasks off the queue after they have been executed.
            // Instead, we periodically shift 1024 tasks off the queue.
            if (index > capacity) {
                // Manually shift all values starting at the index back to the
                // beginning of the queue.
                for (
                    let scan = 0, newLength = tasks.length - index;
                    scan < newLength;
                    scan++
                ) {
                    tasks[scan] = tasks[scan + index];
                }

                tasks.length -= index;
                index = 0;
            }
        }

        tasks.length = 0;
    }

    function enqueue(callable: Callable): void {
        tasks.push(callable);

        if (tasks.length < 2) {
            updateAsync ? rAF(process) : process();
        }
    }

    return Object.freeze({
        enqueue,
        next: () => new Promise(enqueue),
        process,
        setMode: (isAsync: boolean) => (updateAsync = isAsync),
    });
});
