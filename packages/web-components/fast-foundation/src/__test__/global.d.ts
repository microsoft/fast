declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            hasAttribute(a: string): Promise<R>;
            toHaveBooleanAttribute(a: string): Promise<R>;
        }
    }
}

export {};

declare module "*.svg" {
    const content: any;
    export default content;
}
