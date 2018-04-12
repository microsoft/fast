/**
 * For all keys <K> of an type <T>, reassign the type of each key <P>
 */
export type KeyOfToType<T, P> = {
    [K in keyof T]: P
};
