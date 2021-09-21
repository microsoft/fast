export function test<T>(expression: () => T): T | undefined {
    try {
        return expression();
    } catch (e) {
        console.error(e);
    }
}
