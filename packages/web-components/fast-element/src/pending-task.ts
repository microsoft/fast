/**
 * An implementation of the https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/pending-task.md proposal.
 * @public
 */
export interface PendingTask extends Event {
    /**
     * A promise that resolves when the pending task is complete.
     */
    readonly complete: Promise<void>;
}

/**
 * A concrete implementation of {@link PendingTask}
 * @public
 */
export class PendingTaskEvent extends Event implements PendingTask {
    /**
     * The type of the pending task event.
     */
    public static readonly type = "pending-task";

    /**
     * Creates an instance of PendingTaskEvent.
     * @param complete - A promise that resolves when the pending task is complete.
     */
    public constructor(public readonly complete: Promise<void>) {
        super(PendingTaskEvent.type, { bubbles: true, composed: true });
    }

    /**
     * Determines whether a value is a PendingTaskEvent.
     * @param value - The value to check.
     * @returns True if the value is a PendingTaskEvent; false otherwise.
     */
    public static isPendingTask<T extends Event>(
        value: T | PendingTask
    ): value is PendingTask {
        return (
            value.type === PendingTaskEvent.type &&
            typeof (value as any).complete?.then === "function"
        );
    }
}
