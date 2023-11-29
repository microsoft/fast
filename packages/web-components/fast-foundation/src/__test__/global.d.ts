declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            toHaveBooleanAttribute(a: string): Promise<R>;
        }
    }
}

export {};

declare module "*.svg" {
    const content: any;
    export default content;
}
