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

## Perf Improvements
- Change propagation of token changes to allow propagating a *set* of changes. This should improve performance because the node tree will only need to be walked once for all tokens, instead of once for each token.
- Implement caching mechanism for token context collection. This should speed up appending nodes because the context can be cached and re-used for any node connected. Notifications of adding / removal of tokens should force the cache to update.

## API



### class: `DesignTokenChangeRecord`

<hr/>

### class: `DesignTokenNode`

#### Fields

| Name       | Privacy | Type                | Default | Description | Inherited From |
| ---------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `parent`   | public  |                     |         |             |                |
| `children` | public  | `DesignTokenNode[]` |         |             |                |

#### Methods

| Name               | Privacy | Description | Parameters                                          | Return                      | Inherited From |
| ------------------ | ------- | ----------- | --------------------------------------------------- | --------------------------- | -------------- |
| `appendChild`      | public  |             | `child: DesignTokenNode`                            |                             |                |
| `removeChild`      | public  |             | `child: DesignTokenNode`                            |                             |                |
| `setTokenValue`    | public  |             | `token: DesignToken<T>, value: DesignTokenValue<T>` |                             |                |
| `getTokenValue`    | public  |             | `token: DesignToken<T>`                             | `StaticDesignTokenValue<T>` |                |
| `deleteTokenValue` | public  |             | `token: DesignToken<T>`                             | `void`                      |                |

<hr/>



### class: `DesignToken`

#### Fields

| Name | Privacy | Type | Default | Description | Inherited From |
| ---- | ------- | ---- | ------- | ----------- | -------------- |
| `id` | public  |      | `id++`  |             |                |

<hr/>
