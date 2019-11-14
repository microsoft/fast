# FAST React Utilities

A set of general purpose React utilities.

## Installation

`npm i --save @microsoft/fast-react-utilities`

## Exports
### Hooks
#### useTimeout(callback, delay, [memoKeys...])
A React hook to declaritivly invoke a timeout function. The callback be invoked once after `delay` - measured in miliseconds. Once the timeout is invoked, no other timeout will be registerd unless duration changes.

To force a new timeout to be registed with a previous duration, supply *new* values to the `memoKeys`. This is similar to how React's `useEffect` works.

##### Single execution of callback
```js
function FancyButton() {
    // Execute a callback invoked after 200ms. Callback will only be called once (unless duration changes)
    useTimeout(() => {
        alert("I'm a button")
    }, 200);

    return <button>hello world</button>
}
```
##### Execute callback whenever prop is changed
```js
function FancyButton() {
    // Execute a callback 200ms after render. A new callback will be registered
    // when props.value changes
    useTimeout((props) => {
        alert("I'm a button")
    }, 200, [props.value]);

    return <button>hello world</button>
}
```

##### Execute callback every render
```js
function FancyButton() {
    // Execute a callback 200ms after every render. If render happens before the delay,
    // the previous render's timeout will be canceled.
    useTimeout(() => {
        alert("I'm a button")
    }, 200, [Symbol()]);

    return <button>hello world</button>
}
```