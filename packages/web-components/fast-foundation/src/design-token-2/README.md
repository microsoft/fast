## Notifications
A token will emit a notification when it changes, and the argument provided will be the DesignTokenNode for which the value has changed. This notification can be used by implementing logic to perform side effects when tokens change (like reflect to CSS custom properties).

```ts
const token = DesignToken.create<number>("token");
const node = new DesignTokenNode();

Observable.getNotifier(token).subscribe({
    handleChange(token: DesignToken<unknown>, node: DesignTokenNode) {
        // do stuff
    }
});
```