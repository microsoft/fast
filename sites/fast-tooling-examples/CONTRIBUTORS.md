# Adding a new example

When adding a new example the following steps should be taken:
- Add a link in the `app/index.html` to the example in the appropriate category.
- Add a TypeScript file named with the corresponding example numbering and category, `example-{category}-{number}.ts`, for example `example-react-2.ts` the contents of which should include in it an `id`, in this case `react-2`, and a `text` property that will go above the example.

Example:
```typescript
    export default {
    id: "react-2",
    text: "An example editor using the Viewer, Form and Navigation components.",
};
```

- Add this new example to the `registry.ts` file by following the syntax there.
- Add a folder in the examples file with your new example.
- Add to the `webpack.config.js` file a new `entry` in the above example with camelCase naming corresponding to the name of the example file, taking the example file name `example-react-2` above, it would be `exampleReact2` and point it to your new `index.ts`/`index.tsx` file in your example folder.
- Add to the `webpack.config.js` file a new instance of `HtmlWebpackPlugin` which points to your new template. Be sure to filter out the main js file and all other example js files so that they only include your own, use other template files as reference.

Note: Naming conventions must be strictly adhered to for templating to strip out irrelevant script files.
