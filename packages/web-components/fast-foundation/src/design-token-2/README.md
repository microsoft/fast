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
- Implement an internal re-parent mechanism that avoids notifying for upstream tokens on removal and then again on appendChild. This will provide performance improvements for nodes that are moved.

## API



### class: `DesignTokenNode`

#### Fields

| Name       | Privacy | Type                | Default | Description | Inherited From |
| ---------- | ------- | ------------------- | ------- | ----------- | -------------- |
| `parent`   | public  |                     |         |             |                |
| `children` | public  | `DesignTokenNode[]` |         |             |                |

#### Methods

| Name               | Privacy | Description | Parameters                                          | Return | Inherited From |
| ------------------ | ------- | ----------- | --------------------------------------------------- | ------ | -------------- |
| `appendChild`      | public  |             | `child: DesignTokenNode`                            |        |                |
| `removeChild`      | public  |             | `child: DesignTokenNode`                            |        |                |
| `setTokenValue`    | public  |             | `token: DesignToken<T>, value: DesignTokenValue<T>` |        |                |
| `getTokenValue`    | public  |             | `token: DesignToken<T>`                             | `T`    |                |
| `deleteTokenValue` | public  |             | `token: DesignToken<T>`                             | `void` |                |

<hr/>





### class: `DesignToken`

#### Fields

| Name      | Privacy | Type             | Default | Description | Inherited From |
| --------- | ------- | ---------------- | ------- | ----------- | -------------- |
| `name`    | public  | `string`         |         |             |                |
| `$value`  | public  |                  |         |             |                |
| `default` | public  | `T or undefined` |         |             |                |

#### Methods

| Name             | Privacy | Description | Parameters                                                          | Return | Inherited From |
| ---------------- | ------- | ----------- | ------------------------------------------------------------------- | ------ | -------------- |
| `getValueFor`    | public  |             | `target: FASTElement`                                               | `T`    |                |
| `setValueFor`    | public  |             | `target: FASTElement, value: DesignToken<T> or DesignTokenValue<T>` | `void` |                |
| `deleteValueFor` | public  |             | `target: FASTElement`                                               | `this` |                |
| `withDefault`    | public  |             | `value: DesignToken<T> or DesignTokenValue<T>`                      | `this` |                |
| `subscribe`      | public  |             | `subscriber: FASTDesignTokenSubscriber<this>`                       | `void` |                |
| `unsubscribe`    | public  |             | `subscriber: FASTDesignTokenSubscriber<this>`                       | `void` |                |

<hr/>

### class: `CSSDesignToken`

#### Superclass

| Name          | Module                                  | Package |
| ------------- | --------------------------------------- | ------- |
| `DesignToken` | src/design-token-2/fast-design-token.ts |         |

#### Fields

| Name                | Privacy | Type             | Default                                          | Description | Inherited From |
| ------------------- | ------- | ---------------- | ------------------------------------------------ | ----------- | -------------- |
| `cssCustomProperty` | public  | `string`         | `` `--${configuration.cssCustomPropertyName}` `` |             |                |
| `name`              | public  | `string`         |                                                  |             | DesignToken    |
| `$value`            | public  |                  |                                                  |             | DesignToken    |
| `default`           | public  | `T or undefined` |                                                  |             | DesignToken    |

#### Methods

| Name             | Privacy | Description | Parameters                                                          | Return             | Inherited From |
| ---------------- | ------- | ----------- | ------------------------------------------------------------------- | ------------------ | -------------- |
| `createCSS`      | public  |             | `add: AddBehavior`                                                  | `ComposableStyles` |                |
| `getValueFor`    | public  |             | `target: FASTElement`                                               | `T`                | DesignToken    |
| `setValueFor`    | public  |             | `target: FASTElement, value: DesignToken<T> or DesignTokenValue<T>` | `void`             | DesignToken    |
| `deleteValueFor` | public  |             | `target: FASTElement`                                               | `this`             | DesignToken    |
| `withDefault`    | public  |             | `value: DesignToken<T> or DesignTokenValue<T>`                      | `this`             | DesignToken    |
| `subscribe`      | public  |             | `subscriber: FASTDesignTokenSubscriber<this>`                       | `void`             | DesignToken    |
| `unsubscribe`    | public  |             | `subscriber: FASTDesignTokenSubscriber<this>`                       | `void`             | DesignToken    |

<hr/>


