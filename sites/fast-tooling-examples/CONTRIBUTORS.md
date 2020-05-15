# Adding a new example

When adding a new example the following steps should be taken:
- Add a link in the `app/index.html` to the example in the appropriate category.
- Add a TypeScript file with the corresponding example numbering and category, for example `example-react-2.ts` and include in it an `id` which in this case would be `react-2` and text that will go above the example.
- Add this new example to the `registry.ts` file be following the syntax there.
- Add a folder in the examples file with your new example.
- Add to the `webpack.config.js` file a new `entry` in the above example it would be `exampleReact2` and point it to your new `index.ts` file in your example folder.
- Add to the `webpack.config.js` file a new instance of `HtmlWebpackPlugin` which points to your new template. Be sure to filter out the main js file and all other example js files and only include your own.
