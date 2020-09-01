# Contributing

Each folder not labelled "app" or "node_modules" is a project by itself.

## Setting up your environment

Aside from the usual suspects for web development (NodeJS, yarn, git) you will need:
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html)
    - MacOS guidance: please note that in order to prevent having to declare the path everytime you open a new terminal (or command line), you will need to edit your `.bashrc` and `.bash_profile` with PATH and environment variables. To find out what these variables are, `cd` into your `emsdk` repository folder and run `source ./emsdk_env.sh`.
- `yarn install`

## Running the test environment

To run the app you will need to build the `.wasm` and `.js` files then start up the webpack dev server:

```bash
$ yarn build
$ yarn start
```

## Tips for compiling for Web Assembly

For more information on why certain options are used to generate the files, see [this article](https://hacks.mozilla.org/2018/01/shrinking-webassembly-and-javascript-code-sizes-in-emscripten/) for details on how these options shrink the size of the output code.

## Adding a new project

1. Add a unique folder name, separate any words with "-" and use lowercase
2. Add any generated files to the `.gitignore`
3. Add any build steps to the `package.json` `scripts` property, use the syntax `build:{folder-name}` and add this to the `build` script. If there are multiple build scripts use `&&` for example `yarn build:project-1 && yarn build:project-2`
4. Add some manual testing mechanism to the `./app/index.ts` and/or `./app/index.html` files
5. Add the `.js` file to the `./app/index.html` file (do not use webpack to wrap any files generated from emscripten, this will result in the global `Module` variable not being modified)
6. Modify the `webpack.config.js` file to copy any files `.js` or `.wasm` to the `outDir`, see the `CopyPlugin` in the plugins section of the config
